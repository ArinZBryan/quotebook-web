"use server"
import { RichQuote, Tag } from "@/app/api/db/types"
import { db, db_tables } from '@/schema'
import { sql, eq } from 'drizzle-orm'

export async function getQuotesRaw(limit?: number): Promise<RichQuote[]> {
    "use server"
    let lim = -1;
    if (limit != undefined && limit > 0) { lim = limit; }

    const rows = await db.select({
        quote_id: db_tables.quotes.id,
        preamble: db_tables.quotes.preamble,
        quote: db_tables.quotes.quote,
        date: db_tables.quotes.date,
        confirmed_date: db_tables.quotes.confirmed_date,
        message_id: db_tables.quotes.message_id,
        message_date: db_tables.quotes.message_date,
        author_id: db_tables.authors.id,
        author_tag_id: db_tables.authors.tag,
        author_name: db_tables.authors.preferred_name,
        author_search_text: db_tables.authors.search_text,
        tags: sql<string>`(
            SELECT 
                GROUP_CONCAT(t.tag_text, ', ') 
            FROM ((
                SELECT 
                    ${db_tables.tags.category} || ':' || ${db_tables.tags.title} || ':' || ${db_tables.tags.id} as tag_text 
                FROM ${db_tables.tags} 
                INNER JOIN ${db_tables.tag_instances} ON ${db_tables.tag_instances.tag} = ${db_tables.tags.id}
                WHERE ${db_tables.tag_instances.quote} = ${db_tables.quotes.id}
            )) t)`.as("tags")
      })
        .from(db_tables.quotes)
        .innerJoin(db_tables.authors, eq(db_tables.quotes.author, db_tables.authors.id))

    return rows.map((row) => {
        return {
            id: row.quote_id,
            preamble: row.preamble,
            quote: row.quote,
            author: {
                id: row.author_id,
                preferred_name: row.author_name,
                search_text: row.author_search_text,
                tag: {
                    id: row.author_tag_id,
                    category: "Person",
                    title: row.author_name
                } as Tag
            },
            date: row.date,
            confirmed_date: row.confirmed_date,
            message_id: row.message_id,
            message_date: row.message_date,
            tags: row.tags.split(",").map((substr) => substr.trim()).map(tagtext => { 
                return {
                    'id':parseInt(tagtext.split(":")[2]),
                    'category': tagtext.split(":")[0],
                    'title': tagtext.split(":")[1]
                } as Tag 
            })
        } as RichQuote
    })
}