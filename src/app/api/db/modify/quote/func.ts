"use server"
import { Tag, Author } from "../../types"

import { db, db_tables } from '@/schema'
import { eq } from 'drizzle-orm'


export async function respond(newData: formData) {
    const tagvalues = newData.tags.map((t) => {return {tag: t.id, quote: newData.id}})


    await db.update(db_tables.quotes)
        .set({
            preamble: newData.preamble,
            quote: newData.quote,
            date: newData.date,
            confirmed_date: 'true',
            author:newData.author!.id
        })
        .where(eq(db_tables.quotes.id, newData.id))

    await (db.delete(db_tables.tag_instances)
        .where(eq(db_tables.tag_instances.quote, newData.id))
        .catch((reason) => console.error(reason)))

    await db.insert(db_tables.tag_instances)
        .values(tagvalues)
        .catch((reason) => console.error(reason))
    
}

type formData = {
    'id':number,
    'preamble': string,
    'quote': string,
    'date': string,
    'author': Author,
    'tags': Tag[]
}