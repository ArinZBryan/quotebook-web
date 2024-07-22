import { DiscordBot } from "./func";
import { NextResponse } from "next/server";
import { auth } from "@/auth"

export async function GET() {
    const bot = new DiscordBot({
        'automatically_update_search_text': true,
        'clear_tables': false,
        'discord_options': {
            'application_id': process.env.DISCORD_APPLICATION_ID!,
            'source_channel': process.env.DISCORD_SOURCE_CHANNEL!,
            'token': process.env.DISCORD_TOKEN!
        },
        'migrations_folder': process.env.DRIZZLE_MIGRATIONS!,
        'run_migrations': false
    })
    const result = await bot.gatherQuotes()

    const res = NextResponse.json(result, {
        status: 200
    })    
}

export async function POST(req: Request) {
    const session = await auth()
    if (!session) {
        const res = NextResponse.json("Unauthorised", {
            status: 401
        });
        return res;
    }
    else if (session.user.admin != "true") {
        const res = NextResponse.json("This Method Requires Administrator Priveleges", {
            status: 403
        })
        return res;
    }
    else {
        const req_body = await req.json() as BotOptions

        const bot = new DiscordBot({
            'automatically_update_search_text': req_body.automatically_update_search_text,
            'clear_tables': req_body.clear_tables,
            'discord_options': {
                'application_id': process.env.DISCORD_APPLICATION_ID!,
                'source_channel': process.env.DISCORD_SOURCE_CHANNEL!,
                'token': process.env.DISCORD_TOKEN!
            },
            'migrations_folder': process.env.DRIZZLE_MIGRATIONS!,
            'run_migrations': req_body.run_migrations
        })
        const result = await bot.gatherQuotes()

        const res = NextResponse.json(result, {
            status: req_body.clear_tables ? 201 : 200
        })
    }
}

type BotOptions = {
    'automatically_update_search_text': boolean,
    'clear_tables': boolean,
    'run_migrations': boolean
}