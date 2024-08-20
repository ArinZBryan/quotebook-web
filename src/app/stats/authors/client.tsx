"use client"
import { Author, RichQuote, Tag } from "@/app/api/db/types";
import { Grid, GridElement } from '@/components/component/grid';
import { CartesianGrid, Line, LineChart, XAxis, Pie, PieChart } from "recharts"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import { SelectAuthor } from "./tag_select";
import { useState, useEffect } from "react";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import useWindowDimensions from '@/lib/useWindowDimensions';
import Image from "next/image"
import { DotIcon } from "lucide-react";

function RichQuoteToString(q: RichQuote) {
    const preamble = q.preamble.length > 0 ? `[${q.preamble}]` : "";
    const quote = q.quote;
    const author = q.author.preferred_name;
    const date = q.confirmed_date == "true" ? q.date : "";
    return `${preamble} "${quote}" - ${author} ${date}`
}

export function InteractivePage(props: { rich_quotes: RichQuote[], authors: Author[], tags: Tag[] }) {

    const { width: windowWidth, height: windowHeight } = useWindowDimensions()

    const [selectedAuthor, setSelectedAuthor] = useState<Author | null>(null)
    const [linkedAccount, setLinkedAccount] = useState<{ name: string | null, image: string | null }>({ name: null, image: null })

    useEffect(() => {
        fetch('/api/db/get/linkedaccount', {
            'method': 'POST',
            'body': JSON.stringify({ author_id: selectedAuthor?.id ?? null }),
            'headers': {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
            .then((res) => res.json())
            .then((data) => {
                setLinkedAccount(data)
            })
    }, [selectedAuthor])



    const data = analyseData(props, selectedAuthor)

    console.log(data)

    const [rerender, setRerender] = useState(0)

    useEffect(() => { setRerender(rerender + 1) }, [windowWidth])

    if ((windowWidth ?? 900) < 750) {
        return <div className='p-3 pt-5 pb-5 gap-2 flex flex-col'>
            <div className='text-3xl'>
                <div className='pb-2'>Stats on:</div>
                <SelectAuthor defaultData={selectedAuthor} formSubmit={(a) => { setSelectedAuthor(a) }} authors={props.authors} />
            </div>
            {
                selectedAuthor != null && data != null ?
                    <>
                        {linkedAccount.image != undefined ?
                            <div className='border-gray-900 border-2 rounded-xl p-2 pr-4 pl-4 flex flex-col max-w-full'>
                                <div className='w-full text-xl flex flex-col items-center'>A little more info:</div>
                                <div className="w-full text-lg flex flex-row items-center justify-center gap-4">
                                    <Image src={linkedAccount.image} alt={linkedAccount.name!} width={40} height={40} className="rounded-full w-15 h-15" />
                                    {linkedAccount.name!}
                                </div>
                                <div className="w-full pt-2 text-lg flex flex-col">
                                    Aliases:
                                    {
                                        data.aliases.map((alias, i) => <div key={i} className="pl-8 flex flex-row"><DotIcon />{alias}</div>)
                                    }
                                </div>
                            </div>
                            : <div className='border-gray-900 border-2 rounded-xl p-2 pr-4 pl-4 flex flex-col'>
                                <div className='w-full text-xl flex flex-col items-center'>A little more info:</div>
                                <div className='w-full text-xl flex flex-col items-center'>This author has not been linked to a user account.</div>
                            </div>
                        }
                        <div className='border-gray-900 border-2 rounded-xl p-2 flex flex-col flex-grow'>
                            <div className='w-full text-xl flex flex-col items-center'>Most Recent Quote From This Author</div>
                            <div className='w-full h-auto flex-grow text-center'>
                                {RichQuoteToString(data.quotesTaggedWithTarget.last)}
                            </div>
                        </div>
                        <div className='border-gray-900 border-2 rounded-xl p-2 flex flex-col'>
                            <div className='w-full text-xl flex flex-col items-center'>First Quote From This Author</div>
                            <div className='w-full h-auto flex-grow flex flex-col items-center justify-center'>
                                <div className='w-fit'>{RichQuoteToString(data.quotesTaggedWithTarget.first)}</div>
                            </div>
                        </div>
                        <div className='border-gray-900 border-2 rounded-xl p-2 w-full h-fit'>
                            <div className='text-xl text-center'>Tags often used by this author</div>
                            <ChartContainer
                                config={data.commonlyFoundWith.chartConfig}
                                className="aspect-square"
                            >
                                <PieChart>
                                    <ChartTooltip
                                        cursor={false}
                                        content={<ChartTooltipContent hideLabel />}
                                    />
                                    <Pie
                                        data={data.commonlyFoundWith.data}
                                        dataKey="uses"
                                        nameKey="authorName"
                                        innerRadius={"50%"}
                                    />
                                </PieChart>
                            </ChartContainer>
                        </div>
                        <div className='border-gray-900 border-2 rounded-xl p-2 w-full h-fit'>
                            <div className='text-xl text-center'>Posts by this author over time</div>
                            <ChartContainer config={data.usageOverTime.chartConfig}
                                className="w-[90vw] h-full flex-shrink">
                                <LineChart
                                    data={data.usageOverTime.data}
                                    margin={{
                                        left: 24,
                                        right: 24,
                                        bottom: 24,
                                        top: 24
                                    }}
                                >
                                    <CartesianGrid vertical={false} />
                                    <XAxis
                                        dataKey="month"
                                        tickLine={true}
                                        axisLine={false}
                                        tickMargin={20}
                                        angle={-35}
                                    />
                                    <ChartTooltip
                                        cursor={false}
                                        content={<ChartTooltipContent hideLabel />}
                                    />
                                    <Line
                                        dataKey="quotes"
                                        type="monotone"
                                        strokeWidth={2}
                                        dot={false}
                                    />
                                </LineChart>
                            </ChartContainer>
                        </div>
                        <div className='border-gray-900 border-2 rounded-xl p-2'>
                            <div className='w-full text-xl text-center'>All Quotes By This Author</div>
                            <div className='flex flex-col items-center justify-center' >
                                <Carousel className='max-w-[75%]'>
                                    <CarouselContent>
                                        {
                                            data.quotesTaggedWithTarget.all.map((q, i) =>
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
                        </div>
                    </>
                    : <></>
            }
        </div >

    }

    return <div className='p-3 pt-5 pb-5'>
        <Grid cols={4} rows={2} gap={1} className="w-full">
            <GridElement className='text-3xl flex' pos={{ width: 4, height: 1, row: 0, column: 0 }}>
                <div className='pb-2'>Stats on:</div>
                <SelectAuthor defaultData={selectedAuthor} formSubmit={(a) => { setSelectedAuthor(a) }} authors={props.authors} />
            </GridElement>
            {
                selectedAuthor != null && data != null ?
                    <>
                        <GridElement className='border-gray-900 border-2 rounded-xl p-2 flex flex-col items-center' pos={{ width: 1, height: 1, row: 1, column: 0 }}>
                            <div className='text-xl'>Tags often used by this author</div>
                            <div className='w-full h-full' style={{ maxWidth: (windowWidth ?? 100) / 4 }}>
                                <ChartContainer
                                    config={data.commonlyFoundWith.chartConfig}
                                    className="flex-grow"
                                >
                                    <PieChart>
                                        <ChartTooltip
                                            cursor={false}
                                            content={<ChartTooltipContent hideLabel />}
                                        />
                                        <Pie
                                            data={data.commonlyFoundWith.data}
                                            dataKey="uses"
                                            nameKey="authorName"
                                            innerRadius={"50%"}
                                        />
                                    </PieChart>
                                </ChartContainer>
                            </div>
                        </GridElement>
                        <GridElement className='border-gray-900 border-2 rounded-xl p-2 flex flex-col items-center' pos={{ width: 2, height: 1, row: 1, column: 1 }}>
                            <div className='w-full text-xl flex flex-col items-center'>Posts by this author over time</div>
                            <div style={{ maxWidth: (windowWidth ?? 100) / 2 }} className='w-full h-full'>
                                <ChartContainer config={data.usageOverTime.chartConfig}>
                                    <LineChart
                                        data={data.usageOverTime.data}
                                        margin={{
                                            left: 24,
                                            right: 24,
                                            bottom: 24,
                                            top: 24
                                        }}
                                    >
                                        <CartesianGrid vertical={false} />
                                        <XAxis
                                            dataKey="month"
                                            tickLine={true}
                                            axisLine={false}
                                            tickMargin={20}
                                            angle={-35}
                                        />
                                        <ChartTooltip
                                            cursor={false}
                                            content={<ChartTooltipContent hideLabel />}
                                        />
                                        <Line
                                            dataKey="quotes"
                                            type="monotone"
                                            strokeWidth={2}
                                            dot={false}
                                        />
                                    </LineChart>
                                </ChartContainer>
                            </div>
                        </GridElement>
                        {linkedAccount.image != undefined ?
                            <GridElement className='border-gray-900 border-2 rounded-xl p-2 pr-4 pl-4 flex flex-col' pos={{ width: 1, height: 1, row: 1, column: 3 }}>
                                <div className='w-full text-xl flex flex-col items-center'>A little more info:</div>
                                <div className="w-full text-lg flex flex-row items-center gap-4">
                                    <Image src={linkedAccount.image} alt={linkedAccount.name!} width={40} height={40} className="rounded-full w-15 h-15" />
                                    {linkedAccount.name!}
                                </div>
                                <div className="w-full pt-2 text-lg flex flex-col">
                                    Aliases:
                                    {
                                        data.aliases.map((alias, i) => <div key={i} className="pl-8 flex flex-row"><DotIcon />{alias}</div>)
                                    }
                                </div>
                            </GridElement>
                            : <GridElement className='border-gray-900 border-2 rounded-xl p-2 pr-4 pl-4 flex flex-col' pos={{ width: 1, height: 1, row: 1, column: 3 }}>
                                <div className='w-full text-xl flex flex-col items-center'>A little more info:</div>
                                <div className='w-full text-xl flex flex-col items-center'>This author has not been linked to a user account.</div>
                            </GridElement>
                        }
                        <GridElement className='border-gray-900 border-2 rounded-xl p-2 flex flex-col' pos={{ width: 1, height: 1, row: 2, column: 0 }}>
                            <div className='w-full text-xl flex flex-col items-center'>First Quote From This Author</div>
                            <div className='w-full h-auto flex-grow flex flex-col items-center justify-center'>
                                <div className='w-fit'>{RichQuoteToString(data.quotesTaggedWithTarget.last)}</div>
                            </div>
                        </GridElement>
                        <GridElement className='border-gray-900 border-2 rounded-xl p-2 flex flex-col' pos={{ width: 1, height: 1, row: 2, column: 1 }}>
                            <div className='w-full text-xl flex flex-col items-center'>Most Recent Quote From This Author</div>
                            <div className='w-full h-auto flex-grow flex flex-col items-center justify-center'>
                                <div className='w-fit'>{RichQuoteToString(data.quotesTaggedWithTarget.first)}</div>
                            </div>
                        </GridElement>
                        <GridElement className='border-gray-900 border-2 rounded-xl p-2' pos={{ width: 2, height: 1, row: 2, column: 2 }}>
                            <div className='w-full text-xl flex flex-col items-center'>All Quotes By This Author</div>
                            <div className='flex flex-col items-center px-4'>
                                <Carousel className='min-w-0 w-[45vw] max-w-[85%]'>
                                    <CarouselContent>
                                        {
                                            data.quotesTaggedWithTarget.all.map((q, i) =>
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
 * - Usage of target author over time (message_date)
 * - Tags commonly used by this author
 * - List of quotes with the by the author
 * - First chronological quote by author
 * - Last chronological quote by author
 * - Aliases of author
*/
function analyseData(dataSources: { rich_quotes: RichQuote[], authors: Author[], tags: Tag[] }, target: Author | null) {
    if (target == null) return null
    const filteredQuotes = dataSources.rich_quotes.filter(q => q.author.id === target.id);

    //Usage of target author over time (message_date)
    const rawTagUsage = filteredQuotes.map((q) => q.message_date)   //pull out array of dates
        .reduce((acc: { [k: string]: number }, date) => {           //tally per date into object (typeof rawTagUsage = { [`${year}-${month}`] : [uses_on_that_date] })
            const truncatedDate = date.substring(0, 7)              //truncate date into [`${year}-${month}`] format
            acc[truncatedDate] = (acc[truncatedDate] || 0) + 1;     //update tally for relevant month
            return acc;
        }, {});
    const dateStartText = Object.keys(rawTagUsage)[Object.keys(rawTagUsage).length - 1] //grab the last date an author was used
    const dateEndText = Object.keys(rawTagUsage)[0]                                     //grab the first date an author was used
    const dateRange = makeDateRange(dateStartText, dateEndText)                         //makes an array of strings, where each is of the year+months in the range provided
    //> IE. if start was '2023/10/xx' and end was '2024/03/xx', 
    //> this would return the following array: 
    //> ['2023-10', '2023-11', '2023-12', '2024-01', '2024-02', '2024-03']
    let tagUsage: { [k: string]: number } = {}
    dateRange.forEach((d) => { tagUsage[d] = (rawTagUsage[d] || 0) })   //fill months with no usages with zeros during copy

    const authorUsageData = Object.entries(tagUsage).map((v) => ({ month: v[0], quotes: v[1] }))
    const authorUsageConfig = { month: { label: 'Month' } } satisfies ChartConfig


    //Tags commonly used by this author
    const simmilarTagsData = Object.entries(filteredQuotes.reduce((acc: { [k: string]: number }, quote) => {
        quote.tags.filter((t) => t.id != target.id).forEach((t) => {
            acc[tagToString(t)] = (acc[tagToString(t)] || 0) + 1;
        })
        return acc;
    }, {})).map(v => ({ authorName: v[0], uses: v[1] }));
    const simmilarTagsConfig = simmilarTagsData.reduce((prev: { [k: string]: { label: string } }, cur) => {
        prev[cur.authorName] = {
            label: cur.authorName
        }
        return prev;
    }, {}) satisfies ChartConfig

    //List of quotes with the by the author
    const taggedWithTarget = filteredQuotes;

    //First chronological quote by author
    const firstQuoteWithTag = filteredQuotes[filteredQuotes.length - 1];

    //Last chronological quote by author
    const lastQuoteWithTag = filteredQuotes[0]

    //TODO: It may be that these last two options need switching around, I can't remember if filteredQuotes
    //      comes in in chronological order, or reverse-chronological order, as numbered by ID.

    //Aliases of author
    const aliases = target.search_text.split(",").map((alias) => alias.trim())

    return {
        usageOverTime: {
            data: authorUsageData,
            chartConfig: authorUsageConfig,
        },
        commonlyFoundWith: {
            data: simmilarTagsData,
            chartConfig: simmilarTagsConfig
        },
        quotesTaggedWithTarget: {
            all: taggedWithTarget,
            first: firstQuoteWithTag,
            last: lastQuoteWithTag
        },
        aliases: aliases
    }
}