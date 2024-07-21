"use server"
import { UnverifedQuote } from "../../types"
import { db, db_tables } from '@/schema'

export async function getUnverifiedQuotes(limit?: number): Promise<UnverifedQuote[]> {
    let lim = -1;
    if (limit != undefined && limit > 0) { lim = limit; }

    const res = await db.select()
        .from(db_tables.unverified_quotes)
        .limit(lim != -1 ? lim : -1)
    return res as UnverifedQuote[]
}

