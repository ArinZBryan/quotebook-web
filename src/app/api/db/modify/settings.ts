"use server"
import { db, db_tables } from '@/schema'
import { eq } from 'drizzle-orm'
import { Author } from '@/app/api/db/types'

export async function unlinkAuthorToAccount(user_id: string): Promise<void> {
    "use server"
    await db.update(db_tables.users)
        .set({ linked_author: null })
        .where(eq(db_tables.users.id, user_id))
}

export async function linkAuthorToAccount(user_id: string, author: Author | null): Promise<void> {
    "use server"
    await db.update(db_tables.users)
        .set({ linked_author: author?.id ?? null })
        .where(eq(db_tables.users.id, user_id))
}

export async function updateAuthorName(author: Author, name: string) {
    "use server"
    await db.update(db_tables.authors)
        .set({preferred_name: name})
        .where(eq(db_tables.authors.id, author.id))
    await db.update(db_tables.tags)
        .set({title: name})
        .where(eq(db_tables.tags.id, author.tag.id))
}