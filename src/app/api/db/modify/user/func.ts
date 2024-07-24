"use server"
import { RichUser } from "../../types"
import { db, db_tables } from '@/schema'
import { eq } from 'drizzle-orm'

export async function respond(newData: Omit<RichUser, "emailVerified" | "image">) {
    db.update(db_tables.users)
        .set({
            'admin' : newData.admin + "",
            'email' : newData.email,
            'linked_author' : newData.linked_author?.id,
            'name' : newData.name
        })
        .where(eq(db_tables.users.id, newData.id))
        .catch((reason) => console.error(reason))
}