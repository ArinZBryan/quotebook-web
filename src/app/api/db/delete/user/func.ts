"use server"
import { db, db_tables } from "@/schema"
import { eq } from "drizzle-orm"

export async function respond(newData: formData): Promise<{ successful: boolean, reason: string } | void> {
    let res = {
        'successful': true,
        'reason': ""
    }

    await db.delete(db_tables.users)
        .where(eq(db_tables.users.id, newData.id))
        .catch((reason) => {
            console.log(reason)
            res = {
                'successful': false,
                'reason': "Unknown Database Row Deletion Faliure"
            }
        })
    
    return res;
}

// update to conform with form page
type formData = {
    'id': string
}