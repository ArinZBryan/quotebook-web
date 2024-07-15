import { NextResponse } from "next/server";
import { auth } from "@/auth"
import { api } from "@/api";


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
        const ret = api.delete.author(rawjson as formData)
        const res = NextResponse.json(ret);
        return res;   
    }
}

type formData = {
    'id': number
}