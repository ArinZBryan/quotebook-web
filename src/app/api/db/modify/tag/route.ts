import { NextResponse } from "next/server";
import { auth } from "@/auth"
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
            'title': '',
            'category': "Miscellaneous",
        }
        try {
            rawjson = (await req.json())
        } catch (e) { if (!(e instanceof TypeError)) throw e; }
        const ret = api.modify.tag(rawjson as formData)
        const res = NextResponse.json(ret);
        return res;        
    }
}

// update to conform with form page
type formData = {
    'id': number,
    'title': string,
    'category': "Person" | "Topic" | "Miscellaneous",
}