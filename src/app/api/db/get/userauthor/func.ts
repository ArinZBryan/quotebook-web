import { Tag, Author } from "../../types"

import { db, db_tables } from '@/schema'
import { eq } from 'drizzle-orm'

export async function getUserData(author_id: number | null): Promise<Author | null> {
    "use server"
    if (author_id == null || author_id == undefined) { return null }
    const unprocessed = (await db.select()
        .from(db_tables.authors)
        .where(eq(db_tables.authors.id, author_id))
        .innerJoin(db_tables.tags, eq(db_tables.authors.tag, db_tables.tags.id)))
    return {
        'id': unprocessed[0].authors.id,
        'preferred_name': unprocessed[0].authors.preferred_name,
        'search_text': unprocessed[0].authors.search_text ?? "",
        'tag': unprocessed[0].tags
    }
}

type request = {
    author_id: number | null
}
