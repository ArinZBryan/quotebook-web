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
        const req_body = await req.json() as request;
        let ret = await api.get.userauthor(req_body.author_id)
        const res = NextResponse.json(ret);
        return res;
    }
}

type request = {
    author_id: number | null
}
