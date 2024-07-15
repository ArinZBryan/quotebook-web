import { Tag } from "../../types"
import { db, db_tables } from '@/schema'

export async function getTagsRaw(limit?: number): Promise<Tag[]>
{
    "use server"
    let lim = -1;
    if (limit != undefined && limit > 0) { lim = limit; }

    const res = await db.select()
        .from(db_tables.tags)
        .limit(lim != -1 ? lim : -1)
    return res as Tag[]
}

