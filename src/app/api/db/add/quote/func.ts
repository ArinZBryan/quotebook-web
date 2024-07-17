import { RichQuote } from "../../types";
import { db, db_tables } from "@/schema";

export async function respond(quote: RichQuote) {
    const quote_id = (await db.insert(db_tables.quotes)
        .values({
            'preamble':quote.preamble,
            'quote':quote.quote,
            'author':quote.author.id,
            'date':quote.date,
            'confirmed_date':"true",
            'message_date':quote.message_date,
            'message_id':quote.message_id
        })
        .returning({id: db_tables.quotes.id}))[0].id

    const tags = await db.insert(db_tables.tag_instances)
        .values(quote.tags.map((t) => ({'quote' : quote_id, 'tag':t.id})))
    
    return {...quote, id: quote_id}
}

