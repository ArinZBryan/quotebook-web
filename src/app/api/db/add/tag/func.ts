"use server"
import { Tag } from "../../types";
import { db, db_tables } from "@/schema";

export async function respond(tag: Tag) {
    const id = await db.insert(db_tables.tags)
        .values({
            'category' : tag.category,
            'title' : tag.title
        })
        .returning({id: db_tables.tags.id})
    return {...tag, id:id[0].id}
}