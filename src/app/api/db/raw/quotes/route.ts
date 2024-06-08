import { NextResponse } from "next/server";
import { auth } from "@/auth"
import { Quote } from "../../types"

import { db, db_tables } from '@/schema'
import { eq } from 'drizzle-orm'

export async function GET() {
    const session = await auth()
    if (!session) {
        const res = NextResponse.json([]);
        return res;
    }
    else {
        let ret = await getQuotesRaw()
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
        let ret = await getQuotesRaw(await req.json())
        const res = NextResponse.json(ret);
        return res;
    }
}

export async function getQuotesRaw(limit?: number): Promise<Quote[]>
{
    let lim = -1;
    if (limit != undefined && limit > 0) { lim = limit; }

    /*
    const client = new pg.Client({
        connectionString: process.env.POSTGRES_URL
    });
    await client.connect().catch(e => console.error(e));;
    let res = await client.query(`SELECT * FROM quotes ${ lim != -1 ? `LIMIT ${lim}` : ""}`).catch(e => console.error(e));
    if (res === undefined) { return [{id: "-1", preamble: "", quote: "DB query did not work", author:"", date:"", confirmed_date:"false", message_id:""},{id: "-1", preamble: "", quote: "DB query did not work", author:"", date:"", confirmed_date:"false", message_id:""}]}
    */

    const res = await db.select()
        .from(db_tables.quotes)

    return res.map((q) => { return {
        'date': q.date, 
        'id': q.id, 
        'preamble': q.preamble,
        'quote': q.quote, 
        'author': q.author + "", 
        'confirmed_date': q.confirmed_date, 
        'message_id': q.message_id
    } } ) as Quote[]
}

