import { Author } from "../../types"
import { db, db_tables } from '@/schema'
import { eq } from 'drizzle-orm'

export async function getAuthors(limit?: number): Promise<Author[]>
{
    "use server"
    let lim = -1;
    if (limit != undefined && limit > 0) { lim = limit; }

    const authors_selected = await db.select()
        .from(db_tables.authors)
        .innerJoin(db_tables.tags, eq(db_tables.authors.tag, db_tables.tags.id))
        .limit(lim != -1 ? lim : -1)

    return authors_selected.map(row => {return {'id': row.authors.tag, 'preferred_name': row.authors.preferred_name, 'search_text': row.authors.search_text, 'tag':{'id': row.authors.tag, 'category': row.tags.category, 'title': row.tags.title}} as Author})
}

