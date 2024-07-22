"use server"
import { Author } from "../../types";
import { db, db_tables } from "@/schema";

export async function respond(author: Omit<Author, "id">) {
    const id = await db.insert(db_tables.authors)
        .values({
            preferred_name: author.preferred_name,
            search_text: author.search_text,
            tag: author.tag.id,
        })
        .returning({id: db_tables.authors.id})
    return {...author, id:id[0].id}
}