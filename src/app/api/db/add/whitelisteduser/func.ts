"use server"
import { db, db_tables } from "@/schema";
import { revalidatePath } from "next/cache";

export async function respond(user: typeof db_tables.whitelisted_users.$inferInsert) {
    const id = await db.insert(db_tables.whitelisted_users)
        .values({
            'discord_id': user.discord_id,
            'linked_author': user.linked_author,
            'make_admin': user.make_admin
        })
        .returning({id: db_tables.whitelisted_users.id})
    return id
}