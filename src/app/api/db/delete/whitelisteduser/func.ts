"use server"
import { db, db_tables } from "@/schema";
import { eq } from "drizzle-orm";

export async function respond(user_id : number) {
    const id = await db.delete(db_tables.whitelisted_users)
        .where(eq(db_tables.whitelisted_users.id, user_id))
}