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
            'title': '',
            'category': "Miscellaneous",
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
    db.update(db_tables.tags)
        .set({
            title: newData.title,
            category: newData.category
        })
        .where(eq(db_tables.tags.id, newData.id))

}

// update to conform with form page
type formData = {
    'id': number,
    'title': string,
    'category': "Person" | "Topic" | "Miscellaneous",
}