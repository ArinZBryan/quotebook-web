"use server"
import { db, db_tables } from "@/schema"
import { eq } from "drizzle-orm"

export async function respond(newData: formData): Promise<{ successful: boolean, reason: string }> {
    let res = {
        'successful': true,
        'reason': ""
    }

    await db.delete(db_tables.authors)
        .where(eq(db_tables.authors.id, newData.id))
        .catch((reason) => {
            console.log(reason)
            res = {
                'successful': false,
                'reason': reason
            }
        })
    
    return res;
}

// update to conform with form page
type formData = {
    'id': number
}