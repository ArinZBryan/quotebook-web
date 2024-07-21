"use server"
import { db, db_tables } from '@/schema'
import { eq } from 'drizzle-orm'

export async function respond(newData: formData) {
    db.update(db_tables.tags)
        .set({
            title: newData.title,
            category: newData.category
        })
        .where(eq(db_tables.tags.id, newData.id))

}

type formData = {
    'id': number,
    'title': string,
    'category': "Person" | "Topic" | "Miscellaneous",
}