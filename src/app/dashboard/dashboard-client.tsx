"use client"
import { Author, RichQuote } from '../api/db/types';
import { TagStd } from '@/components/component/tag';
import { DoughnutChart } from '../../components/component/charts-client';
import { Session } from 'next-auth';
import useWindowDimensions from '@/lib/useWindowDimensions'
import { Grid, GridElement } from '@/components/component/grid';

export function DashboardClient({ userauthor, data, session, your_quotes }: {
    userauthor: Author | null,
    data: {
        tags: {
            labels: string[];
            datasets: {
                label: string;
                data: number[];
                borderWidth: number;
            }[];
        },
        includes: {
            labels: string[];
            datasets: {
                label: string;
                data: number[];
                borderWidth: number;
            }[];
        }
    },
    session: Session | null,
    your_quotes: RichQuote[],
}) {
    const { width: rawWidth, height: rawHeight } = useWindowDimensions();
    const windowWidth = (rawWidth == undefined || isNaN(rawWidth!)) ? 600 : rawWidth
    const windowHeight = (rawHeight == undefined || isNaN(rawHeight!)) ? 600 : rawHeight
    const smallWindow = (windowWidth! < 470)

    const most_recent_quote = your_quotes[0] ?? {
        'preamble': "", 
        'quote': "", 
        'author': {
            'id': -1, 
            'preferred_name': "No Author Assigned To This Account", 
            'search_text': "", 
            'tag': {
                'category': "Person", 
                'id': -1, 
                'title': "No Author Assigned To This Account"
            }
        }, 
        'date': "", 
        'confirmed_date': 'false', 
        'message_id': '', 
        'id': -1,
        'tags': [
            {
                'category': "Miscellaneous", 
                'id': -1, 
                'title': "Tag Not Found"
            }
        ]
    } as RichQuote

    if (smallWindow) {
        return <Grid cols={1} gap={3} className='p-3'>
            <GridElement className='w-full h-full border-gray-900 border-2 rounded-xl p-2' pos={{ width: 1, height: 1, row: 0, column: 0 }}>
                <h1 className='text-[2.5rem] overflow-hidden'>Hello, {userauthor?.preferred_name ?? session?.user.name ?? "[Not Logged In]"}</h1>
            </GridElement>
            <GridElement className='w-full h-full  border-gray-900 border-2 rounded-xl p-2' pos={{ width: 1, height: 2, row: 1, column: 0 }}>
                <div className='text-gray-600 flex flex-col space-y-1'>
                    <div>ID: {userauthor?.id}</div>
                    <div className='flex flex-row flex-wrap'>Tag: <TagStd tag={userauthor?.tag ?? { 'category': "Person", 'id': -1, 'title': "No Author Assigned To This Account" }} overrideColor='aaaaaa'/></div>
                    <div className='flex flex-row flex-wrap'>Aliases: <span className='flex flex-row flex-wrap w-full'>{userauthor?.search_text.split(",").map((v, i) => <span className='flex-shrink-0 pt-1 pb-1' key={i}><TagStd tag={{ 'category': 'Person', 'id': userauthor?.tag.id!, 'title': v }} overrideColor='242930' /></span>)}</span></div>
                </div>
            </GridElement>
            <GridElement className='w-full h-full min-w-[50%] border-gray-900 border-2 rounded-xl p-2' >
                You've been quoted {your_quotes.length + ""} times
            </GridElement>
            <GridElement className='w-full h-full border-gray-900 border-2 rounded-xl p-2'>
                Your most recent quote was: {most_recent_quote.preamble.length >= 1 ? `[${most_recent_quote.preamble}]` : ""} "{most_recent_quote.quote}" - {(userauthor?.preferred_name == undefined ? most_recent_quote.author.preferred_name : userauthor?.preferred_name)} ({most_recent_quote.date})
            </GridElement>
            <GridElement className='h-full w-full border-gray-900 border-2 rounded-xl p-2' pos={{ width: 1, height: 3, row: 3, column: 0 }}>
                <div className='h-full'>Your quotes are tagged with:
                    <DoughnutChart data={data.tags} />
                </div>
            </GridElement>
            <GridElement className='h-full w-full border-gray-900 border-2 rounded-xl p-2' pos={{ width: 1, height: 3, row: 6, column: 0 }}>
                <div className='h-full'>You are often included in quotes by:
                    <DoughnutChart data={data.includes} />
                </div>
            </GridElement>
        </Grid>

    } else {
        return <Grid cols={2} gap={3} className='p-3'>
            <GridElement className='w-full h-full border-gray-900 border-2 rounded-xl p-2' pos={{ width: 2, height: 1, row: 0, column: 0 }}>
                <h1 className='text-[2.5rem] overflow-hidden'>Hello, {userauthor?.preferred_name ?? session?.user.name}</h1>
            </GridElement>
            <GridElement className='w-full h-full  border-gray-900 border-2 rounded-xl p-2' pos={{ width: 1, height: 2, row: 1, column: 0 }}>
                <div className='text-gray-600 flex flex-col space-y-1'>
                    <div>ID: {userauthor?.id}</div>
                    <div className='flex flex-row flex-wrap'>Tag: <TagStd tag={userauthor?.tag ?? { 'category': "Person", 'id': -1, 'title': "No Author Assigned To This Account" }} overrideColor='aaaaaa'/></div>
                    <div className='flex flex-row flex-wrap'>Aliases: <span className='flex flex-row flex-wrap w-full'>{userauthor?.search_text.split(",").map((v, i) => <span className='flex-shrink-0 pt-1 pb-1' key={i}><TagStd tag={{ 'category': 'Person', 'id': userauthor?.tag.id!, 'title': v }} overrideColor='242930' /></span>)}</span></div>
                </div>
            </GridElement>
            <GridElement className='w-full h-full min-w-[50%] border-gray-900 border-2 rounded-xl p-2' pos={{ width: 1, height: 1, row: 1, column: 1 }}>
                You've been quoted {your_quotes.length + ""} times
            </GridElement>
            <GridElement className='w-full h-full border-gray-900 border-2 rounded-xl p-2' pos={{ width: 1, height: 1, row: 2, column: 1 }}>
                Your most recent quote was: {most_recent_quote.preamble.length >= 1 ? `[${most_recent_quote.preamble}]` : ""} "{most_recent_quote.quote}" - {userauthor?.preferred_name + ""} ({most_recent_quote.date})
            </GridElement>
            <GridElement className='h-full border-gray-900 border-2 rounded-xl p-2' pos={{ width: 1, height: 3, row: 3, column: 0 }}>
                <div className='h-full' style={{ width: (windowWidth / 2 * 0.9) }}>Your quotes are tagged with:
                    <DoughnutChart data={data.tags} />
                </div>
            </GridElement>
            <GridElement className='h-full w-full border-gray-900 border-2 rounded-xl p-2' pos={{ width: 1, height: 3, row: 3, column: 1 }}>
                <div className='h-full' style={{ width: (windowWidth / 2 * 0.9) }}>You are often included in quotes by:
                    <DoughnutChart data={data.includes} />
                </div>
            </GridElement>
        </Grid>
    }


}