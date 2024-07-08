import { respond as delete_author } from "@/app/api/db/delete/author/route";
import { respond as delete_tag } from "@/app/api/db/delete/tag/route";
import { respond as modify_author } from "@/app/api/db/modify/author/route";
import { respond as modify_tag } from "@/app/api/db/modify/tag/route"
import { respond as modify_quote } from "@/app/api/db/modify/quote/route";
import { linkAuthorToAccount, unlinkAuthorToAccount, updateAuthorName } from "@/app/api/db/modify/settings"
import { getQuotesRaw as get_richquotes } from "@/app/api/db/get/all/route"
import { getAuthors as get_authors } from "@/app/api/db/get/authors/route";
import { getTagsRaw as get_tags} from "@/app/api/db/get/tags/route";
import { getQuotesRaw as get_quotes} from "@/app/api/db/get/quotes/route";
import { getUserData as get_userauthor} from "@/app/api/db/get/userauthor/route";
import { getLinkedUser as get_linkeduser } from "./app/api/db/get/linkedaccount/route";
import { redirect } from "next/navigation";

export const api = {
    get: {
        authors: get_authors,
        tags: get_tags,
        quotes: get_quotes,
        richquotes: get_richquotes,
        userauthor: get_userauthor,
        linkeduser: get_linkeduser,
    },
    delete: {
        author: delete_author,
        tag: delete_tag
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
    }
}

export function triggerServerSideReload(url:string) {
    redirect(`${url}?${Math.random()}`)
}