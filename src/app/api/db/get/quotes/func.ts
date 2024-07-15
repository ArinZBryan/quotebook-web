import { Quote } from "../../types"
import { db, db_tables } from '@/schema'

export async function getQuotesRaw(limit?: number): Promise<Quote[]>
{
    "use server"
    let lim = -1;
    if (limit != undefined && limit > 0) { lim = limit; }

    const res = await db.select()
        .from(db_tables.quotes)

    return res.map((q) => { return {
        'date': q.date, 
        'id': q.id, 
        'preamble': q.preamble,
        'quote': q.quote, 
        'author': q.author + "", 
        'confirmed_date': q.confirmed_date, 
        'message_id': q.message_id,
        'message_date': q.message_date
    } } ) as Quote[]
}

