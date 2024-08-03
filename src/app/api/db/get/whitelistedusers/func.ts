"use server"

import { db, db_tables } from '@/schema'
import { Author } from '../../types'
import { api } from '@/api'

export async function getWhitelistedtUsers(quantity? : number): Promise<{
    'id' : number,
    'discord_id' : string,
    'linked_author' : Author | null,
    'make_admin' : boolean 
}[]> {

    const users = await db.select()
        .from(db_tables.whitelisted_users)

    const authors = await api.get.authors()

    const res = users.map((v) => ({
        'id' : v.id,
        'discord_id' : v.discord_id,
        'make_admin' : v.make_admin == "true" ? true : false,
        'linked_author' : authors.find((a) => a.id == v.linked_author) ?? null
    }))

    return res;
}