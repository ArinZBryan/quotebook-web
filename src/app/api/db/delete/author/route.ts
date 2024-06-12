import { NextResponse } from "next/server";
import { auth } from "@/auth"
import { Tag } from "@/app/api/db/types"

import { db, db_tables } from "@/schema"
import { eq } from "drizzle-orm"

export async function POST(req: Request) {
    const session = await auth()
    if (!session) {
        const res = NextResponse.json([]);
        return res;
    }
    else {
        let rawjson: formData = {
            'id': 0
        }
        try {
            rawjson = (await req.json())
        } catch (e) { if (!(e instanceof TypeError)) throw e; }
        const ret = respond(rawjson as formData)
        const res = NextResponse.json(ret);
        return res;   
    }
}

export async function respond(newData: formData): Promise<{ successful: boolean, reason: string } | void> {
    "use server"
    let res = {
        'successful': true,
        'reason': ""
    }

    await db.delete(db_tables.authors)
        .where(eq(db_tables.authors.id, newData.id))
        .catch((reason) => {
            console.log(reason)
            res = {
                'successful': false,
                'reason': "Unknown Database Row Deletion Faliure"
            }
        })
    
    return res;
}

// update to conform with form page
type formData = {
    'id': number
}