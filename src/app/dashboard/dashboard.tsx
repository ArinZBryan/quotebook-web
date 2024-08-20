import { auth } from '@/auth';
import { api } from '@/api'
import { Tag } from '../api/db/types';

import { DashboardClient } from './dashboard-client';
import { ChartConfig } from '@/components/ui/chart';

export async function Dashboard() {

    const session = await auth();
    const userauthor = await api.get.userauthor(session?.user.linked_author ?? null)
    const all_quotes = await api.get.richquotes();
    
    const your_quotes = all_quotes.filter((q) => q.author.id == userauthor?.id )
    const your_tags_usage_data = Object.entries(your_quotes.reduce((acc: { [k: string]: number }, quote) => {
        quote.tags.filter((t) => t.id != userauthor?.tag.id).forEach((t) => {
            acc[tagToString(t)] = (acc[tagToString(t)] || 0) + 1;
        })
        return acc;
    }, {})).map(v => ({ authorName: v[0], uses: v[1] }));
    const your_tags_usage_config = your_tags_usage_data.reduce((prev: { [k: string]: { label: string } }, cur) => {
        prev[cur.authorName] = {
            label: cur.authorName
        }
        return prev;
    }, {}) satisfies ChartConfig

    const others_quotes = all_quotes.filter((q) => q.author.id != userauthor?.id)
    const your_usage_by_others_data = Object.entries(others_quotes.reduce((acc: { [k: string]: number }, quote) => {
        quote.tags.filter((t) => t.id == userauthor?.tag.id).forEach((t) => {
            acc[quote.author.preferred_name] = (acc[quote.author.preferred_name] || 0) + 1;
        })
        return acc
    }, {})).map(v => ({authorName: v[0], uses: v[1]}))
    const your_usage_by_others_config = your_usage_by_others_data.reduce((prev: { [k: string]: { label: string } }, cur) => {
        prev[cur.authorName] = {
            label: cur.authorName
        }
        return prev;
    }, {}) satisfies ChartConfig

    const data = { 
        your_tags_usage: {
            config: your_tags_usage_config,
            data: your_tags_usage_data
        }, 
        your_usage_by_others: {
            config: your_usage_by_others_config,
            data: your_usage_by_others_data,
        }
    };

    return <div  className='text-2xl'>
        <DashboardClient userauthor={userauthor} data={data} session={session} your_quotes={your_quotes}/>
    </div>

}

function tagToString(t : Tag) { return t.category + ":" + t.title}

