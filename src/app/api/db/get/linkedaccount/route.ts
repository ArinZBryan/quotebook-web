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
        let ret = await api.get.linkeduser(await req.json())
        const res = NextResponse.json(ret);
        return res;
    }
}

