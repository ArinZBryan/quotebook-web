import { NextResponse } from "next/server";
import { auth } from "@/auth"
import { RichUser } from "../../types"
import { api } from "@/api";


export async function POST(req : Request) {
    const session = await auth()
    if (!session) {
        const res = NextResponse.json([]);
        return res;
    }
    else {
        let rawjson: Omit<RichUser, "emailVerified" | "image"> = {
            id: "",
            name: "",
            email: "",
            admin: false,
            linked_author: null,
        }
        try {
            rawjson = (await req.json())
        } catch (e) { if (!(e instanceof TypeError)) throw e; }
        const ret = api.modify.user(rawjson as Omit<RichUser, "emailVerified" | "image">)
        const res = NextResponse.json(ret);
        return res;        
    }
}