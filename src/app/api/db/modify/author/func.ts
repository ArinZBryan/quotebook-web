"use server"
import { Tag } from "../../types"
import { db, db_tables } from '@/schema'
import { eq } from 'drizzle-orm'

export async function respond(newData: formData): Promise<{ successful: boolean, reason: string }> {
    let res = {
        'successful': true,
        'reason': ""
    }

    await db.update(db_tables.authors)
        .set({
            preferred_name: newData.preferred_name,
            search_text: newData.search_text.join(','),
            tag: newData.tag?.id
        })
        .where(eq(db_tables.authors.id, newData.id))
        .catch((reason) => {
            console.error(reason);
            res = {
                'successful': false,
                'reason': reason
            };
        })
    return res;
}

type formData = {
    'id': number,
    'preferred_name': string,
    'search_text': string[],
    'tag': Tag | null
}