import { NextResponse } from "next/server";
import { auth } from "@/auth"
import { Tag } from "../../types"
import { api } from "@/api";


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
        const ret = api.modify.author(rawjson as formData)
        const res = NextResponse.json(ret);
        return res;        
    }
}
type formData = {
    'id': number,
    'preferred_name': string,
    'search_text': string[],
    'tag': Tag | null
}