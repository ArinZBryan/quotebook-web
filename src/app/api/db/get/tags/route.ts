import { NextResponse } from "next/server";
import { auth } from "@/auth"
import { api } from "@/api";

export async function GET() {
    const session = await auth()
    if (!session) {
        const res = NextResponse.json([]);
        return res;
    }
    else {
        let ret = await api.get.tags()
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
        let ret = await api.get.tags(await req.json())
        const res = NextResponse.json(ret);
        return res;
    }
}

