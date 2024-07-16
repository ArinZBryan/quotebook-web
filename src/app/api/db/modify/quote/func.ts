import { Tag } from "../../types"

import { db, db_tables } from '@/schema'
import { eq } from 'drizzle-orm'


export async function respond(newData: formData) {
    "use server"
    const tagvalues = newData.tags.map((t) => {return {tag: t.id, quote: newData.id}})

    const authors = await db.select({ id: db_tables.authors.id })
        .from(db_tables.authors)
        .where(eq(db_tables.authors.tag, newData.author?.id!))

    await db.update(db_tables.quotes)
        .set({
            preamble: newData.preamble,
            quote: newData.quote,
            date: newData.date,
            confirmed_date: 'true',
            author:authors[0].id
        })
        .where(eq(db_tables.quotes.id, newData.id))

    await (db.delete(db_tables.tag_instances)
        .where(eq(db_tables.tag_instances.quote, newData.id))
        .catch((reason) => console.error(reason)))

    await db.insert(db_tables.tag_instances)
        .values(tagvalues)
        .catch((reason) => console.error(reason))
    
}

type formData = {
    'id':number,
    'preamble': string,
    'quote': string,
    'date': string,
    'author': Tag | null,
    'tags': Tag[]
}