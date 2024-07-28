import { NextResponse } from "next/server";
import { auth } from "@/auth"

import { Tag } from "@/app/api/db/types"
import { api } from "@/api";


export async function POST(req: Request) {
    const session = await auth()
    if (!session) {
        const res = NextResponse.json([]);
        return res;
    }
    else {
        let rawjson: formData = {
            'id': ""
        }
        try {
            rawjson = (await req.json())
        } catch (e) { if (!(e instanceof TypeError)) throw e; }
        const ret = api.delete.user(rawjson as formData)
        const res = NextResponse.json(ret);
        return res;  
    }
}

// update to conform with form page
type formData = {
    'id': string
}