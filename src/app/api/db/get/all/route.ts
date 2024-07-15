import { NextResponse } from "next/server";
import { auth } from "@/auth"
import { api } from "@/api";


export async function GET() {
    const session = await auth()
    if (!session) {
        const res = NextResponse.json([{
            quote_id: 0,
            preamble: "",
            quote: "",
            date: "",
            confirmed_date: "false",
            message_id: "",
            author_id: 0,
            author_tag_id: 0,
            author_name: "",
            author_search_text: "",
            tags: "",
        }]);
        return res;
    }
    else {
        const quotes = await api.get.richquotes();
        const res = NextResponse.json(quotes);
        return res;
    }
}



