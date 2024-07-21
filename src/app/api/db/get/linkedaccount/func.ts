"use server"
import { db, db_tables } from '@/schema'
import { eq } from 'drizzle-orm'

export async function getLinkedUser(args : { author_id : number | null } ): Promise<{ name: string | null, image: string | null }>
{
    const author_id = args.author_id
    if (author_id == null) { return { name: null, image: null } }

    const authors_selected = await db.select()
        .from(db_tables.users)
        .where(eq(db_tables.users.linked_author, author_id))

    if (authors_selected.length != 1) { return { name: null, image: null } }

    return { name: authors_selected[0].name, image: authors_selected[0].image }
}

