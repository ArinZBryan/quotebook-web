import { respond as delete_author } from "@/app/api/db/delete/author/func";
import { respond as delete_tag } from "@/app/api/db/delete/tag/func";
import { respond as delete_unverifedquote } from "@/app/api/db/delete/unverfiedquote/func"
import { respond as modify_author } from "@/app/api/db/modify/author/func";
import { respond as modify_tag } from "@/app/api/db/modify/tag/func"
import { respond as modify_quote } from "@/app/api/db/modify/quote/func";
import { linkAuthorToAccount, unlinkAuthorToAccount, updateAuthorName } from "@/app/api/db/modify/settings"
import { getQuotesRaw as get_richquotes } from "@/app/api/db/get/all/func"
import { getAuthors as get_authors } from "@/app/api/db/get/authors/func";
import { getTagsRaw as get_tags} from "@/app/api/db/get/tags/func";
import { getQuotesRaw as get_quotes} from "@/app/api/db/get/quotes/func";
import { getUserData as get_userauthor} from "@/app/api/db/get/userauthor/func";
import { getLinkedUser as get_linkeduser } from "./app/api/db/get/linkedaccount/func";
import { getUnverifiedQuotes as get_unverifedquotes } from "./app/api/db/get/unverifiedquotes/func";
import { respond as add_author } from "@/app/api/db/add/author/func"
import { respond as add_quote } from "@/app/api/db/add/quote/func"
import { respond as add_tag } from "@/app/api/db/add/tag/func"
import { DiscordBot } from "./app/api/discord/func";
import { redirect } from "next/navigation";

export const api = {
    get: {
        authors: get_authors,
        tags: get_tags,
        quotes: get_quotes,
        richquotes: get_richquotes,
        userauthor: get_userauthor,
        linkeduser: get_linkeduser,
        unverifiedquotes: get_unverifedquotes,
    },
    delete: {
        author: delete_author,
        tag: delete_tag,
        unverifiedquote: delete_unverifedquote,
    },
    modify: {
        author: modify_author,
        tag: modify_tag,
        quote: modify_quote,
        usersettings: {
            add_linked_author: linkAuthorToAccount,
            remove_linked_author: unlinkAuthorToAccount,
            update_linked_author: updateAuthorName
        }
    },
    add: {
        author: add_author,
        quote: add_quote,
        tag: add_tag
    },
    discord: (automatically_update_search_text: boolean, clear_tables: boolean, run_migrations: boolean ) => {
        const bot = new DiscordBot({
            'automatically_update_search_text': automatically_update_search_text,
            'clear_tables': clear_tables,
            'discord_options': {
                'application_id': process.env.DISCORD_APPLICATION_ID!,
                'source_channel': process.env.DISCORD_SOURCE_CHANNEL!,
                'token': process.env.DISCORD_TOKEN!
            },
            'migrations_folder': process.env.DRIZZLE_MIGRATIONS!,
            'run_migrations': run_migrations
        })
        return bot.gatherQuotes()
    }
}

export function triggerServerSideReload(url:string) {
    redirect(`${url}?${Math.random()}`)
}