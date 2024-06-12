import { NextResponse } from "next/server";
import { auth } from "@/auth"
import { Tag } from "../../types"

import { db, db_tables } from '@/schema'

export async function GET() {
    const session = await auth()
    if (!session) {
        const res = NextResponse.json([]);
        return res;
    }
    else {
        let ret = await getTagsRaw()
        const res = NextResponse.json(ret);
        return res;
    }
}

export async function POST(req : Request) {
    const session = await auth()
    if (!session) {
        const res = NextResponse.json([]);
        return res;
    }
    else {
        let ret = await getTagsRaw(await req.json())
        const res = NextResponse.json(ret);
        return res;
    }
}

export async function getTagsRaw(limit?: number): Promise<Tag[]>
{
    "use server"
    let lim = -1;
    if (limit != undefined && limit > 0) { lim = limit; }

    const res = await db.select()
        .from(db_tables.tags)
        .limit(lim != -1 ? lim : -1)
    return res as Tag[]
}

