"use client"
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable"
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card"
import { 
    Card, 
    CardContent, 
    CardDescription, 
    CardFooter, 
    CardHeader, 
} from "@/components/ui/card";
import { Toaster } from "@/components/ui/toaster";
import { RichQuote } from "@/app/api/db/types";
import { FixedSizeList as List } from 'react-window'
import { FilterOptionsPanel } from './filteroptions'
import { CSSProperties, useEffect, useMemo, useRef, useState } from 'react'
import { useToast } from "@/components/ui/use-toast";
import { CheckCircle2Icon, EyeOffIcon } from "lucide-react";
import { TagStd } from "@/components/component/tag";
import useScrollbarSize from "react-scrollbar-size";

interface TableProps {
    data: RichQuote[],
    onTableInvalid: () => void
}

export const Table: React.FC<TableProps> = ({ data, onTableInvalid }) => {
    function sortFunction(options: FilterOptions): (a: RichQuote, b: RichQuote) => number {
        let dir = 0;
        if (options.sort == undefined) { return () => 0; }
        if (options.sort === "Ascending") { dir = 1; }
        else if (options.sort === "Descending") { dir = -1; }
        else { dir = 0; }
        return (a: RichQuote, b: RichQuote) => { return dir * (parseInt(String(a[options.col])) - parseInt(String(b[options.col]))) }
    }
    function containsFunction(options: FilterOptions): (a: RichQuote) => boolean {
        if (options.contains == undefined) { return (a) => false; }
        return (a: RichQuote) => {
            if (options.col == 'author') {
                return options.contains!.test(String(a.author.preferred_name))
            }
            if (options.col == 'tags') {
                let ret = "";
                a.tags.forEach((tag) => ret += `${tag.category} : ${tag.title}, `);
                return options.contains!.test(ret);
            }
            return options.contains!.test(String(a[options.col]))
        }
    }

    const [sortoptions, setSortOptions] = useState<FilterOptions>({ sort: "Descending", col: "id" })
    const [filteroptions, setFilterOptions] = useState<FilterOptions>({ contains: new RegExp(""), col: "author" })

    const stdWidth = 100 / 9
    const [colWidths, setColWidths] = useState<{ [T in keyof RichQuote]: number }>({
        'id': 0,
        'preamble': stdWidth * 5 / 3,
        'quote': stdWidth * 19 / 6,
        'author': stdWidth * 11 / 12,
        'date': stdWidth * 5 / 12,
        'confirmed_date': 0,
        'tags': stdWidth * 13 / 6,
        'message_id': 0,
        'message_date': stdWidth * 4 / 6
    })

    const scrollbarSize = useScrollbarSize()
    const { toast } = useToast()

    function setColWidthsW(key: keyof RichQuote, s: number) {
        setColWidths(prevState => {
            const newObj = { ...prevState };
            newObj[key] = s;
            //console.log("Resized " + key + " to: " + s );
            return newObj;
        });
    }

    const selectedData = data.filter(containsFunction(filteroptions)).sort(sortFunction(sortoptions));

    return (
        <>
            <Toaster />
            <div className="w-full">
                <ResizablePanelGroup direction="horizontal" style={{ paddingRight: scrollbarSize.width }}>
                    <ResizablePanel onResize={(b) => { setColWidthsW("preamble", b) }} defaultSize={colWidths.preamble}>
                        <div className="flex h-full items-center justify-center p-6">
                            <div className="flex justify-center flex-grow">
                                <span className="font-semibold">Preamble</span>
                            </div>
                            <FilterOptionsPanel canBeSorted={false} onDismiss={(v) => {
                                setFilterOptions({ contains: new RegExp(v.contains, "i"), col: "preamble" })
                                toast({
                                    description: `Filtered to contain: ${v.contains}`,
                                });
                            }} />
                        </div>
                    </ResizablePanel>
                    <ResizableHandle withHandle={true} />
                    <ResizablePanel onResize={(c) => { setColWidthsW("quote", c) }} defaultSize={colWidths.quote}>
                        <div className="flex h-full items-center justify-center p-6">
                            <div className="flex justify-center flex-grow">
                                <span className="font-semibold">Quote</span>
                            </div>
                            <FilterOptionsPanel canBeSorted={false} onDismiss={(v) => {
                                setFilterOptions({ contains: new RegExp(v.contains, "i"), col: "quote" })
                                toast({
                                    description: `Filtered to contain: ${v.contains}`,
                                });

                            }} />
                        </div>
                    </ResizablePanel>
                    <ResizableHandle withHandle={true} />
                    <ResizablePanel onResize={(d) => { setColWidthsW("author", d) }} defaultSize={colWidths.author}>
                        <div className="flex h-full items-center justify-center p-6">
                            <div className="flex justify-center flex-grow">
                                <span className="font-semibold">Author</span>
                            </div>
                            <FilterOptionsPanel canBeSorted={false} onDismiss={(v) => {
                                setFilterOptions({ contains: new RegExp(v.contains, "i"), col: "author" })
                                toast({
                                    description: `Filtered to contain: ${v.contains}`,
                                });
                            }} />
                        </div>
                    </ResizablePanel>
                    <ResizableHandle withHandle={true} />
                    <ResizablePanel onResize={(e) => { setColWidthsW("date", e) }} defaultSize={colWidths.date}>
                        <div className="flex h-full items-center justify-center p-6">
                            <div className="flex justify-center flex-grow">
                                <span className="font-semibold">Date</span>
                            </div>
                            <FilterOptionsPanel canBeSorted={true} onDismiss={(v) => {
                                setSortOptions({ sort: v.direction, col: "date" });
                                setFilterOptions({ contains: new RegExp(v.contains, "i"), col: "date" })
                                toast({
                                    description: `Filtered to contain: ${v.contains}`,
                                });
                                toast({
                                    description: `Sorted into ${v.direction} order by date`,
                                });
                            }} />
                        </div>
                    </ResizablePanel>
                    <ResizableHandle withHandle={true} />
                    <ResizablePanel onResize={(f) => { setColWidthsW("message_date", f) }} defaultSize={colWidths.message_date}>
                        <div className="flex h-full items-center justify-center p-6">
                            <div className="flex justify-center flex-grow">
                                <span className="font-semibold">Message Date</span>
                            </div>
                            <FilterOptionsPanel canBeSorted={true} onDismiss={(v) => {
                                setSortOptions({ sort: v.direction, col: "message_date" });
                                toast({
                                    description: `Sorted into ${v.direction} order by message date`,
                                });
                            }} />
                        </div>
                    </ResizablePanel>
                    <ResizableHandle withHandle={true} />
                    <ResizablePanel onResize={(f) => { setColWidthsW("tags", f) }} defaultSize={colWidths.tags}>
                        <div className="flex h-full items-center justify-center p-6">
                            <div className="flex justify-center flex-grow">
                                <span className="font-semibold">Tags</span>
                            </div>
                            <FilterOptionsPanel canBeSorted={false} onDismiss={(v) => {
                                setFilterOptions({ contains: new RegExp(v.contains, "i"), col: "tags" })
                                toast({
                                    description: `Filtered to contain: ${v.contains}`,
                                });
                            }} />
                        </div>
                    </ResizablePanel>
                </ResizablePanelGroup>
                <List
                    height={775}
                    itemCount={selectedData.length}
                    itemSize={55}
                    width={"100%"}
                >
                    {
                        ({ index, style }) => (
                            <TableRow
                                style={style}
                                rowData={selectedData[index]}
                                colWidths={colWidths}
                                className={`${index % 2 == 0 ? "bg-gray-300 dark:bg-gray-950" : ""} overflow-visible h-full`}
                            />
                        )
                    }
                </List>
            </div>
        </>
    )
}

function TableRow<T extends RichQuote>({ rowData, colWidths, className, style, onEditClose }: {
    rowData: T,
    colWidths: { [K in keyof T]: number },
    className?: string,
    style: CSSProperties,
    onEditClose?: () => void
}) {

    return (
        <HoverCard>
            <HoverCardTrigger className={`w-full ${className}`} style={style}>
                <div className="flex h-full p-2 overflow-visible hover:border-white hover:border border-transparent" >
                    {
                        Object.keys(rowData).map((key, index) => {
                            if (key == "confirmed_date") {
                                return (<></>)
                            }
                            let innerhtml: string | JSX.Element | undefined = "";
                            switch (key) {
                                case "author":
                                    {
                                        const stringRepr = rowData.author?.preferred_name!
                                        if (stringRepr.length > 20) { innerhtml = stringRepr.substring(0, 15) + " [...]" }
                                        else { innerhtml = stringRepr }
                                        break;
                                    }
                                case "date":
                                    innerhtml = <div className="flex flex-row gap-[0.125rem]">{rowData.date}{rowData.confirmed_date == "true" ? <CheckCircle2Icon className="text-gray-500 pt-[0.325rem] pb-[0.325rem]" /> : ""}</div>
                                    break;
                                case "tags":
                                    if (rowData.tags?.length == 0) {
                                        innerhtml = <div></div>;
                                    } else if ((rowData.tags?.length ?? 0) <= 2) {
                                        innerhtml = <div className="flex flex-row flex-wrap">
                                            {rowData.tags!.map((tag, index) => (
                                                <TagStd tag={tag} key={index} />
                                            ))}
                                        </div>
                                    } else {
                                        innerhtml = <span className="flex flex-row items-center"><TagStd tag={rowData.tags![0]} /> +{rowData.tags!.length - 1} more tag(s)</span>
                                    }

                                    break;
                                case "message_date":
                                    innerhtml = rowData.message_date?.substring(0, 10).replaceAll('-', '/')
                                    break;
                                default:
                                    const stringRepr = String(rowData[key as keyof T]);
                                    if (stringRepr.length > 50) { innerhtml = stringRepr.substring(0, 45) + " [...]" }
                                    else { innerhtml = stringRepr }
                            }
                            return (
                                <span
                                    style={{
                                        width: colWidths[key as keyof T] + "%",
                                        paddingLeft: "0.5rem",
                                    }}
                                    key={index}
                                    className=""
                                >
                                    {innerhtml}
                                </span>
                            );
                        })
                    }
                </div>
            </HoverCardTrigger>
            <HoverCardContent asChild>
                <Card className="w-96">
                    <CardHeader className="text-md">
                        <div className="flex flex-row items-center justify-center">
                            <span><i>{rowData.author?.preferred_name} - {rowData.date}</i></span>
                            {rowData.confirmed_date == "true" ? <CheckCircle2Icon className="text-gray-500 pt-[0.325rem] pb-[0.325rem]" /> : ""}
                        </div>
                    </CardHeader>
                    <CardDescription>
                        <div>
                            {rowData.preamble}
                        </div>
                    </CardDescription>
                    <CardContent>
                        <div className="text-xl">
                            {rowData.quote}
                        </div>
                    </CardContent>
                    <CardFooter>
                        <div className="flex flex-col justify-center flex-grow">
                            <div className="flex-grow flex flex-row flex-wrap justify-center">
                                {rowData.tags!.map((tag, index) => (
                                    <TagStd tag={tag} key={index} />
                                ))}
                            </div>
                            <div className="flex-grow text-center text-gray-700">
                                Posted On: {rowData.message_date?.substring(0, 10).replaceAll('-', '/')}
                            </div>
                        </div>
                    </CardFooter>
                </Card>
            </HoverCardContent>
        </HoverCard>
    );
}

type FilterOptions = {
    sort?: "Ascending" | "Descending" | "None",
    contains?: RegExp,
    col: keyof RichQuote
}


