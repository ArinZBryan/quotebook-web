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

function RichQuoteToString(q: RichQuote) {
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

    if ((windowWidth ?? 1100) < 1000) {
        return <div className='p-3 pt-5 pb-5 flex flex-col gap-2'>
            <div className='text-4xl pb-2 flex'>
                <div className='pb-2'>Stats on:</div>
                <SelectTag defaultData={selectedTag} formSubmit={(t) => { setSelectedTag(t) }} tags={props.tags} />
            </div>
            {
                selectedTag != null && data != null ?
                    <>
                        <div  className="flex flex-wrap justify-between gap-2">
                            <div className='flex-grow border-gray-900 border-2 rounded-xl p-2 h-fit w-full sm:max-w-[47.5vw]'>
                                <div className='text-2xl text-center'>Related Tags</div>
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
                            <div className='flex-grow border-gray-900 border-2 rounded-xl p-2 h-fit w-full sm:max-w-[47.5vw]'>
                                <div className='text-2xl text-center'>Tag usage per author</div>
                                <ChartContainer
                                    config={data.usagePerAuthor.chartConfig}
                                    className="aspect-square"
                                >
                                    <PieChart>
                                        <ChartTooltip
                                            cursor={false}
                                            content={<ChartTooltipContent hideLabel />}
                                        />
                                        <Pie
                                            data={data.usagePerAuthor.data}
                                            dataKey="uses"
                                            nameKey="authorName"
                                            innerRadius={"50%"}
                                        />
                                    </PieChart>
                                </ChartContainer>
                            </div>
                        </div>
                        <div className='border-gray-900 border-2 rounded-xl p-2 flex flex-col items-center'>
                            <div className='w-full text-2xl text-center'>Usage of this tag over time</div>
                            <div className="w-full">
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
                                            dataKey="uses"
                                            type="monotone"
                                            strokeWidth={2}
                                            dot={false}
                                        />
                                    </LineChart>
                                </ChartContainer>
                            </div>
                        </div>
                        <div className='border-gray-900 border-2 rounded-xl p-2 flex flex-col'>
                            <div className='w-full text-2xl flex flex-col items-center'>Most Recent Usage of this Tag:</div>
                            <div className='w-full h-auto flex-grow flex flex-col items-center justify-center'>
                                <div className='w-fit'>{RichQuoteToString(data.quotesTaggedWithTarget.last)}</div>
                            </div>
                        </div>
                        <div className=' border-gray-900 border-2 rounded-xl p-2 flex flex-col'>
                            <div className='w-full text-2xl flex flex-col items-center'>First Use of this Tag:</div>
                            <div className='w-full h-auto flex-grow flex flex-col items-center justify-center'>
                                <div className=''>{RichQuoteToString(data.quotesTaggedWithTarget.first)}</div>
                            </div>
                        </div>
                        <div className='border-gray-900 border-2 rounded-xl p-2'>
                            <div className='w-full text-xl text-center'>All Usages of this Tag</div>
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
        <Grid cols={4} rows={2} gap={1} className='w-full text-2xl'>
            <GridElement className='text-4xl pb-2 flex' pos={{ width: 4, height: 1, row: 0, column: 0 }}>
                <div className='pb-2'>Stats on:</div>
                <SelectTag defaultData={selectedTag} formSubmit={(t) => { setSelectedTag(t) }} tags={props.tags} />
            </GridElement>
            {
                selectedTag != null && data != null ?
                    <>
                        <GridElement className='border-gray-900 border-2 rounded-xl p-2 flex flex-col items-center' pos={{ width: 1, height: 1, row: 1, column: 0 }}>
                            <div className='text-3xl'>Related Tags</div>
                            <ChartContainer
                                config={data.commonlyFoundWith.chartConfig}
                                className="flex-grow"
                            >
                                <PieChart margin={{ 'bottom': 0, 'left': 0, 'right': 0, 'top': 0 }}>
                                    <ChartTooltip
                                        cursor={false}
                                        content={<ChartTooltipContent hideLabel />}
                                    />
                                    <Pie
                                        data={data.commonlyFoundWith.data}
                                        dataKey="uses"
                                        nameKey="tag"
                                        innerRadius={60}
                                    />
                                </PieChart>
                            </ChartContainer>
                        </GridElement>
                        <GridElement className='relative border-gray-900 border-2 rounded-xl p-2 flex flex-col items-center' pos={{ width: 1, height: 1, row: 2, column: 0 }}>
                            <div className='text-3xl'>Tag Usage By Author</div>
                            <ChartContainer
                                config={data.usagePerAuthor.chartConfig}
                                className="flex-grow"
                            >
                                <PieChart>
                                    <ChartTooltip
                                        cursor={false}
                                        content={<ChartTooltipContent hideLabel />}
                                    />
                                    <Pie
                                        data={data.usagePerAuthor.data}
                                        dataKey="uses"
                                        nameKey="authorName"
                                        innerRadius={"50%"}
                                    />
                                </PieChart>
                            </ChartContainer>
                        </GridElement>
                        <GridElement className='border-gray-900 border-2 rounded-xl p-2 flex flex-col items-center' pos={{ width: 3, height: 2, row: 1, column: 1 }}>
                            <div className='w-full text-3xl text-center'>Usage of this tag over time</div>
                            <div className="w-full">
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
                                            dataKey="uses"
                                            type="monotone"
                                            strokeWidth={2}
                                            dot={false}
                                        />
                                    </LineChart>
                                </ChartContainer>
                            </div>
                        </GridElement>
                        <GridElement className='border-gray-900 border-2 rounded-xl p-2 flex flex-col' pos={{ width: 1, height: 1, row: 3, column: 0 }}>
                            <div className='w-full text-2xl flex flex-col items-center'>Most Recent Usage of this Tag:</div>
                            <div className='w-full h-auto flex-grow flex flex-col items-center justify-center'>
                                <div className='w-fit'>{RichQuoteToString(data.quotesTaggedWithTarget.last)}</div>
                            </div>
                        </GridElement>
                        <GridElement className=' border-gray-900 border-2 rounded-xl p-2 flex flex-col' pos={{ width: 1, height: 1, row: 3, column: 1 }}>
                            <div className='w-full text-2xl flex flex-col items-center'>First Use of this Tag:</div>
                            <div className='w-full h-auto flex-grow flex flex-col items-center justify-center'>
                                <div className=''>{RichQuoteToString(data.quotesTaggedWithTarget.first)}</div>
                            </div>
                        </GridElement>
                        <GridElement className='border-gray-900 border-2 rounded-xl p-2' pos={{ width: 2, height: 1, row: 3, column: 2 }}>
                            <div className='w-full text-2xl flex flex-col items-center'>All Usages of this Tag:</div>
                            <div className='flex flex-col items-center px-16' style={{ maxWidth: (windowWidth ?? 100) / 2 }}>
                                <Carousel className='w-full'>
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
    const authorInstancesData = Object.entries(filteredQuotes.reduce((acc: { [k: string]: number }, quote) => {
        acc[quote.author.preferred_name] = (acc[quote.author.preferred_name] || 0) + 1;
        return acc;
    }, {})).map((v, i) => ({ authorName: v[0], uses: v[1], fill: `hsl(var(--chart-${i % 5 + 1}))` }));
    const authorInstancesConfig = authorInstancesData.reduce((prev: { [k: string]: { label: string, color?: string } }, cur, curIndex) => {
        prev[cur.authorName] = {
            label: cur.authorName,
            color: `hsl(var(--chart-${curIndex % 5 + 1}))`
        }
        return prev;
    }, { 'uses': { 'label': "Uses" } }) satisfies ChartConfig

    //Usage of target tag over time (message_date)
    const rawTagUsage = filteredQuotes.map((q) => q.message_date)   //pull out array of dates
        .reduce((acc: { [k: string]: number }, date) => {           //tally per date into object (typeof rawTagUsage = { [`${year}-${month}`] : [uses_on_that_date] })
            const truncatedDate = date.substring(0, 7)              //truncate date into [`${year}-${month}`] format
            acc[truncatedDate] = (acc[truncatedDate] || 0) + 1;     //update tally for relevant month
            return acc;
        }, {});
    const dateStartText = Object.keys(rawTagUsage)[Object.keys(rawTagUsage).length - 1] //grab the last date a tag was used
    const dateEndText = Object.keys(rawTagUsage)[0]                                     //grab the first date a tag was used
    const dateRange = makeDateRange(dateStartText, dateEndText)                         //makes an array of strings, where each is of the year+months in the range provided
    //> IE. if start was '2023/10/xx' and end was '2024/03/xx', 
    //> this would return the following array: 
    //> ['2023-10', '2023-11', '2023-12', '2024-01', '2024-02', '2024-03']
    let tagUsage: { [k: string]: number } = {}
    dateRange.forEach((d) => { tagUsage[d] = (rawTagUsage[d] || 0) })   //fill months with no usages with zeros during copy

    const tagUsageData = Object.entries(tagUsage).map((v) => ({ month: v[0], uses: v[1] }))
    const tagUsageConfig = { month: { label: 'Month' } } satisfies ChartConfig

    //Tags commonly included with target
    const simmilarTagsData = Object.entries(filteredQuotes.reduce((acc: { [k: string]: number }, quote) => {
        quote.tags.filter((t) => t.id != target.id).forEach((t) => {
            acc[tagToString(t)] = (acc[tagToString(t)] || 0) + 1;
        })
        return acc;
    }, {})).map(v => ({ tag: v[0], uses: v[1] }));
    const simmilarTagsConfig = simmilarTagsData.reduce((prev: { [k: string]: { label: string } }, cur) => {
        prev[cur.tag] = {
            label: cur.tag
        }
        return prev;
    }, {}) satisfies ChartConfig

    //List of quotes with target tag
    const taggedWithTarget = filteredQuotes;

    //First chronological appearance of target tag
    const firstQuoteWithTag = filteredQuotes[filteredQuotes.length - 1];

    //Last chronological appearance of target tag
    const lastQuoteWithTag = filteredQuotes[0]


    return {
        usagePerAuthor: {
            data: authorInstancesData,
            chartConfig: authorInstancesConfig,
        },
        usageOverTime: {
            data: tagUsageData,
            chartConfig: tagUsageConfig,
        },
        commonlyFoundWith: {
            data: simmilarTagsData,
            chartConfig: simmilarTagsConfig
        },
        quotesTaggedWithTarget: {
            all: taggedWithTarget,
            first: firstQuoteWithTag,
            last: lastQuoteWithTag
        }
    }
}
