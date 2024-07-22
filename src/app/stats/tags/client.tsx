"use client"
import { redirect } from 'next/navigation'
import { Author, RichQuote, Tag } from "@/app/api/db/types";
import { Grid, GridElement } from '@/components/component/grid';
import { TagStd } from "@/components/component/tag";
import { BarChart, DoughnutChart, LineChart } from '@/components/component/charts-client';
import { SelectTag } from "./tag_select";
import { useState } from "react";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import useWindowDimensions from '@/lib/useWindowDimensions';

function RichQuoteToString(q : RichQuote) {
    const preamble = q.preamble.length > 0 ? `[${q.preamble}]` : "";
    const quote = q.quote;
    const author = q.author.preferred_name;
    const date = q.confirmed_date == "true" ? q.date : "";
    return `${preamble} "${quote}" - ${author} ${date}`
}

export function InteractivePage(props: { rich_quotes: RichQuote[], authors: Author[], tags: Tag[] }) {

    const { width: windowWidth, height: windowHeight } = useWindowDimensions()

    const [selectedTag, setSelectedTag] = useState<Tag | null>(null)

    const data = analyseData(props, selectedTag)

    return <div className='p-3 pt-5 pb-5'>
        <Grid cols={4} rows={2} gap={1} >
            <GridElement className='text-3xl flex' pos={{ width: 4, height: 1, row: 0, column: 0 }}>
                <div className='pb-2'>Stats on:</div>
                <SelectTag defaultData={selectedTag} formSubmit={(t) => { setSelectedTag(t) }} tags={props.tags}/>
            </GridElement>
            {
                selectedTag != null && data != null ?
                    <>
                        <GridElement className='w-full border-gray-900 border-2 rounded-xl p-2 flex flex-col items-center' pos={{ width: 1, height: 1, row: 1, column: 0 }}>
                            <div className='text-xl'>Related Tags</div>
                            <div className='' style={{ maxWidth: (windowWidth ?? 100) / 4 + 200 }}>
                                <DoughnutChart data={data.commonlyFoundWith} />
                            </div>
                        </GridElement>
                        <GridElement className='w-full border-gray-900 border-2 rounded-xl p-2 flex flex-col items-center' pos={{ width: 1, height: 1, row: 1, column: 1 }}>
                            <div className='text-xl'>Tag Usage By Author</div>
                            <div className='' style={{ maxWidth: (windowWidth ?? 100) / 4 + 200 }}>
                                <DoughnutChart data={data.usagePerAuthor} />
                            </div>
                        </GridElement>
                        <GridElement className='h-full w-full border-gray-900 border-2 rounded-xl p-2 flex flex-col items-center' pos={{ width: 2, height: 1, row: 1, column: 2 }}>
                            <div className='w-full text-xl flex flex-col items-center'>Usage of this tag over time</div>
                            <div style={{ maxWidth: (windowWidth ?? 100) / 2 }} className='w-full'>
                                <LineChart data={data.usageOverTime} />
                            </div>
                        </GridElement>
                        <GridElement className='h-full w-full border-gray-900 border-2 rounded-xl p-2 flex flex-col' pos={{ width: 1, height: 1, row: 2, column: 0 }}>
                            <div className='w-full text-xl flex flex-col items-center'>Most Recent Usage of this Tag:</div>
                            <div className='w-full h-auto flex-grow flex flex-col items-center justify-center'>
                                <div className='w-fit'>{RichQuoteToString(data.quotesTaggedWithTarget.last)}</div>
                            </div>
                        </GridElement>
                        <GridElement className='h-full w-full border-gray-900 border-2 rounded-xl p-2 flex flex-col' pos={{ width: 1, height: 1, row: 2, column: 1 }}>
                            <div className='w-full text-xl flex flex-col items-center'>Most Recent Usage of this Tag:</div>
                            <div className='w-full h-auto flex-grow flex flex-col items-center justify-center'>
                                <div className='w-fit'>{RichQuoteToString(data.quotesTaggedWithTarget.first)}</div>
                            </div>
                        </GridElement>
                        <GridElement className='h-full w-full border-gray-900 border-2 rounded-xl p-2' pos={{ width: 2, height: 1, row: 2, column: 2 }}>
                            <div className='w-full text-xl flex flex-col items-center'>All Usages of this Tag:</div>
                            <div className='flex flex-col items-center' style={{ maxWidth: (windowWidth ?? 100) / 2 }}>
                                <Carousel className='w-[85%]'>
                                    <CarouselContent>
                                        {
                                            data.quotesTaggedWithTarget.all.map((q,i) => 
                                                <CarouselItem key={i} className='w-fit flex flex-col items-center justify-center'>
                                                    <div>{RichQuoteToString(q)}</div>
                                                </CarouselItem>
                                            )
                                        }
                                    </CarouselContent>
                                    <CarouselPrevious />
                                    <CarouselNext />
                                </Carousel>
                            </div>
                        </GridElement>
                    </>
                    : <></>
            }

        </Grid>

    </div >
}

function tagToString(t: Tag) { return t.category + ":" + t.title }

function makeDateRange(dateStartText: string, dateEndText: string) {
    const start = { year: parseInt(dateStartText.substring(0, 4)), month: parseInt(dateStartText.substring(5, 7)) }
    const end = { year: parseInt(dateEndText.substring(0, 4)), month: parseInt(dateEndText.substring(5, 7)) }

    let ret: string[] = []
    for (let i = start.month; i <= 12; i++) {
        ret.push(`${start.year}-${(i + "").padStart(2, '0')}`)
    }
    for (let i = start.year + 1; i < end.year; i++) {
        ret.push(`${i}-01`)
        ret.push(`${i}-02`)
        ret.push(`${i}-03`)
        ret.push(`${i}-04`)
        ret.push(`${i}-05`)
        ret.push(`${i}-06`)
        ret.push(`${i}-07`)
        ret.push(`${i}-08`)
        ret.push(`${i}-09`)
        ret.push(`${i}-10`)
        ret.push(`${i}-11`)
        ret.push(`${i}-12`)
    }
    for (let i = 1; i <= end.month; i++) {
        ret.push(`${end.year}-${(i + "").padStart(2, '0')}`)
    }
    return ret;
}

/*
 * This function gets the following statistics and information:
 * - Usage of target tag per author
 * - Usage of target tag over time (message_date)
 * - Tags commonly included with target
 * - List of quotes with the target tag
 * - First chronological appearance of target tag
 * - Last chronological appearance of target tag
*/
function analyseData(dataSources: { rich_quotes: RichQuote[], authors: Author[], tags: Tag[] }, target: Tag | null) {
    if (target == null) return null
    const filteredQuotes = dataSources.rich_quotes.filter(q => q.tags.some((t) => t.id === target.id));

    //Usage of target tag per author
    const authorInstances = filteredQuotes.reduce((acc: { [k: string]: number }, quote) => {
        acc[tagToString(quote.author.tag)] = (acc[tagToString(quote.author.tag)] || 0) + 1;
        return acc;
    }, {});

    //Usage of target tag over time (message_date)
    const rawTagUsage = filteredQuotes.map((q) => q.message_date).reduce((acc: { [k: string]: number }, date) => {
        const truncatedDate = date.substring(0, 7)
        acc[truncatedDate] = (acc[truncatedDate] || 0) + 1;
        return acc;
    }, {});
    const dateStartText = Object.keys(rawTagUsage)[Object.keys(rawTagUsage).length - 1]
    const dateEndText = Object.keys(rawTagUsage)[0]
    const dateRange = makeDateRange(dateStartText, dateEndText)
    let tagUsage: { [k: string]: number } = {}
    dateRange.forEach((d) => { tagUsage[d] = (rawTagUsage[d] || 0) })

    //Tags commonly included with target
    const simmilarTags: { [k: string]: number } = {};
    filteredQuotes.forEach((q) => {
        q.tags.toSpliced(q.tags.indexOf(target)).forEach((t) => {
            simmilarTags[tagToString(t)] = (simmilarTags[tagToString(t)] || 0) + 1
        })
    })

    //List of quotes with target tag
    const taggedWithTarget = filteredQuotes;

    //First chronological appearance of target tag
    const firstQuoteWithTag = filteredQuotes[filteredQuotes.length - 1];

    //Last chronological appearance of target tag
    const lastQuoteWithTag = filteredQuotes[0]

    //TODO: It may be that these last two options need switching around, I can't remember if filteredQuotes
    //      comes in in chronological order, or reverse-chronological order, as numbered by ID.


    return {
        usagePerAuthor: {
            labels: Object.keys(authorInstances),
            datasets: [{
                label: '# of times this tag is used by this author',
                data: Object.values(authorInstances),
                borderWidth: 1
            }]
        },
        usageOverTime: {
            labels: Object.keys(tagUsage),
            datasets: [{
                label: tagToString(target),
                data: Object.values(tagUsage),
                tension: 0.3,
            }]
        },
        commonlyFoundWith: {
            labels: Object.keys(simmilarTags),
            datasets: [{
                label: '# of occurences of tags found with this tag',
                data: Object.values(simmilarTags),
                borderWidth: 1
            }]
        },
        quotesTaggedWithTarget: {
            all: taggedWithTarget,
            first: firstQuoteWithTag,
            last: lastQuoteWithTag
        }
    }
}