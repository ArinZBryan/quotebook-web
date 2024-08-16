import { auth } from '@/auth';
import { api } from '@/api'
import { Tag } from '../api/db/types';

import { DashboardClient } from './dashboard-client';

export async function Dashboard() {

    const session = await auth();
    const userauthor = await api.get.userauthor(session?.user.linked_author ?? null)
    const all_quotes = await api.get.richquotes();
    const your_quotes = all_quotes.filter((q) => q.author.id == userauthor?.id )
    
    const your_quotes_tags = your_quotes.map((q) => q.tags)
    
    let tag_data : { value: number, label: string }[] = []

    your_quotes_tags.forEach((v) => {
        v.forEach((t) => {
            let in_tags : number = -1;
            for (let i = 0; i < tag_data.length; i++) if (tagToString(t) == tag_data[i].label) { in_tags = i }
            if (in_tags != -1) { tag_data[in_tags].value++; }
            else { tag_data.push({value: 1, label: tagToString(t)})}
        })
    })

    const you_appear_in = all_quotes.filter(q => q.tags.includes(userauthor?.tag!))

    let author_data : { value: number, label: string }[] = []

    you_appear_in.forEach((v) => {
        let in_author_data : number = -1;
        for (let i = 0; i < author_data.length; i++) if (v.author.preferred_name == author_data[i].label) { in_author_data = i }
        if (in_author_data != -1) { author_data[in_author_data].value++; }
        else { tag_data.push({value: 1, label: v.author.preferred_name})}
    })

    const data = { 
        tags: {
            labels: tag_data.map((v) => v.label),
            datasets: [
                {
                    label: '# of uses in your quotes',
                    data: tag_data.map((v) => v.value),
                    borderWidth: 1,
                },
            ],
        }, 
        includes: {
            labels: tag_data.map((v) => v.label),
            datasets: [
                {
                    label: "# of your appearance in peoples' quotes",
                    data: tag_data.map((v) => v.value),
                    borderWidth: 1,
                },
            ],
        }
    };

    return <div  className='text-2xl'>
        <DashboardClient userauthor={userauthor} data={data} session={session} your_quotes={your_quotes}/>
    </div>

}

function tagToString(t : Tag) { return t.category + ":" + t.title}

