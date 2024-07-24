import { NextResponse } from "next/server";
import { auth } from "@/auth"
import { Tag , Author} from "../../types"
import { api } from "@/api";

export async function POST(req : Request) {
    const session = await auth()
    if (!session) {
        const res = NextResponse.json([]);
        return res;
    }
    else {
        let rawjson: formData = {
            'id':0,
            'preamble': '',
            'quote': '',
            'date': '',
            'author': {
                'id': -1,
                'preferred_name': "Placeholder",
                'search_text' : "",
                'tag' : {
                    'id' : -1,
                    'category' : 'Miscellaneous',
                    'title': "Placeholder"
                }
            } as Author,
            'tags': []
        }
        try {
            rawjson = (await req.json())
        } catch (e) { if (!(e instanceof TypeError)) throw e; }
        const ret = api.modify.quote(rawjson as formData)
        const res = NextResponse.json(ret);
        return res;        
    }
}

type formData = {
    'id':number,
    'preamble': string,
    'quote': string,
    'date': string,
    'author': Author,
    'tags': Tag[]
}