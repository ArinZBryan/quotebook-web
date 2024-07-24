"use server"

import { db, db_tables } from '@/schema'
import { eq } from 'drizzle-orm'
import { RichUser } from '../../types'
import { api } from '@/api'

export async function getUsers(quantity? : number): Promise<RichUser[]> {

    const users = await db.select()
        .from(db_tables.users)

    const authors = await api.get.authors()

    const res = users.map((v) => ({
        'id' : v.id,
        'name' : v.name,
        'email' : v.email,
        'emailVerified' : v.emailVerified,
        'image' : v.image,
        'admin' : v.admin == "true" ? true : false,
        'linked_author' : authors.find((a) => a.id == v.linked_author) ?? null
    }))

    return res;
}