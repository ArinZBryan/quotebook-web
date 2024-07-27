"use server"
import { db, db_tables } from "@/schema"
import { eq } from "drizzle-orm"

export async function respond(newData: formData): Promise<{ successful: boolean, reason: string } | void> {
    let res = {
        'successful': true,
        'reason': ""
    }
    
    console.log(newData)

    await db.delete(db_tables.tag_instances)
        .where(eq(db_tables.tag_instances.quote, newData.id))
        .catch((reason) => {
            console.log(reason)
            res = {
                'successful': false,
                'reason': "Failed To Delete Tags"
            }
        })

    await db.delete(db_tables.quotes)
        .where(eq(db_tables.quotes.id, newData.id))
        .catch((reason) => {
            console.log(reason)
            res = {
                'successful': false,
                'reason': "Failed To Delete Quotes"
            }
        })
    
    return res;
}

// update to conform with form page
type formData = {
    'id': number
}