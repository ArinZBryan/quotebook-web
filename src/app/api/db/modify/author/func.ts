import { Tag } from "../../types"
import { db, db_tables } from '@/schema'
import { eq } from 'drizzle-orm'

export async function respond(newData: formData) {
    "use server"
    db.update(db_tables.authors)
        .set({
            preferred_name: newData.preferred_name,
            search_text: newData.search_text.join(','),
            tag: newData.tag?.id
        })
        .where(eq(db_tables.authors.id, newData.id))
        .catch((reason) => console.error(reason))
}

type formData = {
    'id': number,
    'preferred_name': string,
    'search_text': string[],
    'tag': Tag | null
}