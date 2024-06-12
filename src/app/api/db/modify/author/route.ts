import { NextResponse } from "next/server";
import { auth } from "@/auth"
import { Tag } from "../../types"

import { db, db_tables } from '@/schema'
import { eq } from 'drizzle-orm'

export async function POST(req : Request) {
    const session = await auth()
    if (!session) {
        const res = NextResponse.json([]);
        return res;
    }
    else {
        let rawjson: formData = {
            'id': 0,
            'preferred_name': '',
            'search_text': [],
            'tag': null
        }
        try {
            rawjson = (await req.json())
        } catch (e) { if (!(e instanceof TypeError)) throw e; }
        const ret = respond(rawjson as formData)
        const res = NextResponse.json(ret);
        return res;        
    }
}

export async function respond(newData: formData) {
    "use server"
    db.update(db_tables.authors)
        .set({
            preferred_name: newData.preferred_name,
            search_text: newData.search_text.join(','),
            tag: newData.tag?.id
        })
        .where(eq(db_tables.authors.id, newData.id))
        .catch((reason) => console.error(reason))
}

type formData = {
    'id': number,
    'preferred_name': string,
    'search_text': string[],
    'tag': Tag | null
}