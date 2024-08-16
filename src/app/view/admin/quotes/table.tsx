"use client"
import type { RichQuote } from "@/app/api/db/types";
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
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
    CardHeader
} from "@/components/ui/card";
import { Popover, PopoverTrigger } from "@/components/ui/popover";
import { PopoverContent } from "@radix-ui/react-popover";
import Slideover from "@/components/component/slideover"
import { Button } from "@/components/ui/button";
import { FixedSizeList as List } from 'react-window';
import { FilterOptionsPanel } from '@/app/view/filteroptions';
import { EditForm } from "./editform";
import { TagStd } from "@/components/component/tag";
import { FloatingHiddenColsList } from "@/app/view/hiddenColsList";
import { CSSProperties, useMemo, useState, useEffect } from 'react'
import { useToast } from "@/components/ui/use-toast";
import useWindowDimensions from "@/lib/useWindowDimensions";
import useToggle from "@/lib/useToggle";
import { CheckCircle2Icon } from "lucide-react";
import { api } from "@/api";

;

export function Table({ data, onTableInvalid }: { data: RichQuote[], onTableInvalid: () => void }) {
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
                try {
                    const test = a.author.preferred_name
                } catch (e) {
                    console.log(e)
                }
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

    const pageDims = useWindowDimensions()
    const windowWidth = (pageDims.width == undefined || isNaN(pageDims.width!)) ? 600 : pageDims.width
    const smallWindow = (windowWidth! < 470)
    const [scrollbarSize, setScrollbarSize] = useState(0);
    useEffect(() => {
        setScrollbarSize(window.innerWidth - document.documentElement.clientWidth);
    }, [])


    const allKeys: Set<(keyof RichQuote)> = new Set(['id', 'preamble', 'quote', 'author', 'date', 'message_id', 'message_date', 'tags'])
    const [selectedCols, setSelectedCols] = useState<Set<(keyof RichQuote)>>(allKeys)
    const hiddenCols = [...allKeys].filter(x => !selectedCols.has(x))
    useEffect(() => {
        if (smallWindow) {
            setSelectedCols(new Set(['quote', 'author', 'date']))
            setColWidthsW('date', stdWidth * 7/12)
        }
    }, [smallWindow])

    const [touchIsPrimaryInput, setTouchIsPrimaryInput] = useState(false);
    useEffect(() => {
        setTouchIsPrimaryInput((('ontouchstart' in window) ||
        (navigator.maxTouchPoints > 0) ||
        ((navigator as any).msMaxTouchPoints > 0)))
    })

    const stdWidth = 100 / 9
    const [colWidths, setColWidths] = useState<{ [T in keyof RichQuote]: number }>({
        'id': stdWidth * 1 / 3,
        'preamble': stdWidth * 5 / 3,
        'quote': stdWidth * 14 / 6,
        'author': stdWidth * 11 / 12,
        'date': stdWidth * 5 / 12,
        'confirmed_date': 0,
        'tags': stdWidth * 56 / 30,
        'message_id': stdWidth * 9 / 10,
        'message_date': stdWidth * 17 / 30
    })
    function setColWidthsW(key: keyof RichQuote, s: number) {
        setColWidths(prevState => {
            const newObj = { ...prevState };
            newObj[key] = s;
            return newObj;
        });

    }

    const { value: disabledPanelControls, toggle: toggleDisabledControls } = useToggle(false)

    const filteredSortedQuotes = useMemo(() => {
        return data.filter(containsFunction(filteroptions)).sort(sortFunction(sortoptions));
    }, [data, filteroptions, sortoptions]);


    const colsConfig: { column: keyof RichQuote, columnName: string, filter: boolean, sort: boolean }[] = [
        { column: "id", columnName: "ID", filter: true, sort: true },
        { column: "preamble", columnName: "Preamble", filter: true, sort: false },
        { column: "quote", columnName: "Quote", filter: true, sort: false },
        { column: "author", columnName: "Author", filter: true, sort: false },
        { column: "date", columnName: "Date", filter: true, sort: true },
        { column: "message_id", columnName: "Message ID", filter: true, sort: false },
        { column: "message_date", columnName: "Message Date", filter: true, sort: true },
        { column: "tags", columnName: "Tags", filter: true, sort: false },
    ]
    const selectedColConfigs = colsConfig.filter((v) => selectedCols.has(v.column))

    const [rerenderHiddenColsList, setRerenderHiddenColsList] = useState(0)

    return (
        <>
            <FloatingHiddenColsList 
                list={hiddenCols} 
                onItemRemoved={(i) => { setSelectedCols(selectedCols.add(i as keyof RichQuote)); setRerenderHiddenColsList(rerenderHiddenColsList + 1) }} 
                rerender={rerenderHiddenColsList}
            />
            <div className="w-full text-xs sm:text-lg">
                <ResizablePanelGroup direction="horizontal" style={{ paddingRight: scrollbarSize + 1 }}>
                    {
                        selectedColConfigs.map((col, idx) =>
                            <TableHeader
                                column={col.column}
                                columnName={col.columnName}
                                defaultSize={colWidths[col.column]}
                                handle={idx != selectedColConfigs.length - 1}
                                disableHandle={disabledPanelControls}
                                onToggleDisabledControls={toggleDisabledControls}
                                onResize={setColWidthsW}
                                onHide={(column) => {setSelectedCols(selectedCols.difference(new Set([column])))}}
                                setFilterOptions={{ 'filter': col.filter ? setFilterOptions : undefined, 'sort': col.sort ? setSortOptions : undefined }}
                                order={idx}
                                key={idx}
                            />
                        )
                    }
                </ResizablePanelGroup>
                <List
                    height={775}
                    itemCount={filteredSortedQuotes.length}
                    itemSize={55}
                    width={"100%"}
                >
                    {
                        ({ index, style }) => (touchIsPrimaryInput ? 
                            <MobileTableRow
                                style={style}
                                rowData={filteredSortedQuotes[index]}
                                colWidths={colWidths}
                                hiddenCols={hiddenCols}
                                className={`${index % 2 == 0 ? "bg-gray-300 dark:bg-gray-950" : ""} overflow-visible h-full`}
                            /> :
                            <TableRow
                                style={style}
                                rowData={filteredSortedQuotes[index]}
                                colWidths={colWidths}
                                hiddenCols={hiddenCols}
                                className={`${index % 2 == 0 ? "bg-gray-300 dark:bg-gray-950" : ""} overflow-visible h-full`}
                            />
                        )
                    }
                </List>
            </div>
        </>
    )
}

function TableHeader(props: {
    column: keyof RichQuote,
    columnName?: string,
    defaultSize: number,
    setFilterOptions: {
        sort?: (value: FilterOptions) => void,
        filter?: (value: FilterOptions) => void,
    }
    handle: boolean,
    onToggleDisabledControls?: () => void,
    disableHandle?: boolean,
    onResize: (key: keyof RichQuote, s: number) => void,
    onHide: (column: keyof RichQuote) => void,
    order: number
}) {

    const { toast } = useToast()

    return <>
        <ResizablePanel
            onResize={(f) => { props.onResize(props.column, f) }}
            defaultSize={props.defaultSize}
            order={props.order}
        >
            <div className="flex h-full items-center justify-center p-6">
                <div className="flex justify-center flex-grow">
                    <span className="font-semibold hover:line-through hover:cursor-pointer" onClick={() => {props.onHide(props.column)}}>{props.columnName ?? props.column}</span>
                </div>
                <FilterOptionsPanel
                    canBeSorted={props.setFilterOptions.sort !== undefined}
                    onOpen={() => { props.onToggleDisabledControls?.call({}) }}
                    onClose={() => { props.onToggleDisabledControls?.call({}) }}
                    onSubmit={(v) => {
                        props.setFilterOptions.filter?.call({}, { contains: new RegExp(v.contains, "i"), col: props.column })
                        props.setFilterOptions.sort?.call({}, { sort: v.direction, col: props.column })
                        toast({
                            description: `Filtered to contain: ${v.contains}`,
                        });
                    }}
                />
            </div>
        </ResizablePanel>
        {props.handle ? <ResizableHandle withHandle={!props.disableHandle} disabled={props.disableHandle} /> : ""}
    </>
}

function TableRow<T extends RichQuote>({ rowData, colWidths, className, style, onEditClose, hiddenCols }: {
    rowData: T,
    colWidths: { [K in keyof T]: number },
    className?: string,
    style: CSSProperties,
    onEditClose?: () => void,
    hiddenCols?: (keyof T)[]
}) {

    return (
        <Dialog>
            <DialogTrigger className={`w-full ${className}`} style={style}>
                <HoverCard>
                    <HoverCardTrigger asChild>
                        <div className="flex items-center justify-center h-full p-2 overflow-visible hover:border-white hover:border border-transparent" >
                            {
                                Object.keys(rowData)
                                    .map((key, index) => {
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
                                                innerhtml = <div className="flex flex-row gap-[0.125rem] justify-center items-center">{rowData.date}{rowData.confirmed_date == "true" ? <CheckCircle2Icon className="text-gray-500 pt-[0.325rem] pb-[0.325rem]" /> : ""}</div>
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
                                            case "message_id":
                                                innerhtml = String(rowData[key as keyof T]).substring(0, 7) + "[...]"
                                                break;
                                            case "message_date":
                                                innerhtml = <span className="w-full text-center">{rowData.message_date?.substring(0, 10).replaceAll('-', '/')}</span>
                                                break;
                                            default:
                                                const stringRepr = String(rowData[key as keyof T]);
                                                if (stringRepr.length > 50) { innerhtml = stringRepr.substring(0, 45) + " [...]" }
                                                else { innerhtml = stringRepr }
                                        }
                                        if (hiddenCols?.includes(key as keyof T)) { return "" }
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
                                        <form onSubmit={async (e) => {
                                            e.preventDefault()
                                            const route = await api.get.quoteurl(rowData.message_id);
                                            window.open(route, "_blank")
                                        }}>
                                            <Button variant={"link"} type="submit">View Original Message</Button>
                                        </form>
                                    </div>
                                </div>
                            </CardFooter>
                        </Card>
                    </HoverCardContent>
                </HoverCard>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Modify Entry</DialogTitle>
                    <DialogDescription>
                        This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>
                <EditForm rowData={rowData} />
                <DialogClose asChild>
                    <Button type="button" variant="secondary" onClick={() => { onEditClose?.call({}); }}>
                        Close
                    </Button>
                </DialogClose>
            </DialogContent>
        </Dialog>
    );
}

function MobileTableRow<T extends RichQuote>({ rowData, colWidths, className, style, onEditClose, hiddenCols }: {
    rowData: T,
    colWidths: { [K in keyof T]: number },
    className?: string,
    style: CSSProperties,
    onEditClose?: () => void,
    hiddenCols?: (keyof T)[]
}) {

    const [open, setOpen] = useState(false)

    return (
        <Dialog open={open}>
            <div className={`w-full ${className}`} style={style}>
                <Popover>
                    <PopoverTrigger asChild>
                        <div className="flex items-center justify-center h-full overflow-visible hover:border-white hover:border border-transparent" onDoubleClick={() => {setOpen(true);console.log("double click")}}>
                            <Slideover originalContent={
                                Object.keys(rowData)
                                .map((key, index) => {
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
                                            innerhtml = <div className="flex flex-row gap-[0.125rem] justify-center items-center">{rowData.date}{rowData.confirmed_date == "true" ? <CheckCircle2Icon className="text-gray-500 pt-[0.325rem] pb-[0.325rem]" /> : ""}</div>
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
                                        case "message_id":
                                            innerhtml = String(rowData[key as keyof T]).substring(0, 7) + "[...]"
                                            break;
                                        case "message_date":
                                            innerhtml = <span className="w-full text-center">{rowData.message_date?.substring(0, 10).replaceAll('-', '/')}</span>
                                            break;
                                        default:
                                            const stringRepr = String(rowData[key as keyof T]);
                                            if (stringRepr.length > 50) { innerhtml = stringRepr.substring(0, 45) + " [...]" }
                                            else { innerhtml = stringRepr }
                                    }
                                    if (hiddenCols?.includes(key as keyof T)) { return "" }
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
                        
                            } coverContent={
                                <div className="bg-red-600 w-full h-full cursor-pointer overflow-hidden flex items-center justify-center">
                                    Edit Quote
                                </div>}
                            delay={500}
                            className="w-full h-full"
                            onConfirm={() => {setOpen(true)}}
                        />
                                
                        </div>
                    </PopoverTrigger>
                    <PopoverContent asChild>
                        <Card className="w-full z-50">
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
                                        <form onSubmit={async (e) => {
                                            e.preventDefault()
                                            const route = await api.get.quoteurl(rowData.message_id);
                                            window.open(route, "_blank")
                                        }}>
                                            <Button variant={"link"} type="submit">View Original Message</Button>
                                        </form>
                                    </div>
                                </div>
                            </CardFooter>
                        </Card>
                    </PopoverContent>
                </Popover>
            </div>
            <DialogContent onInteractOutside={() => {setOpen(false);}} onCloseAutoFocus={() => {setOpen(false)}}>
                <DialogHeader>
                    <DialogTitle>Modify Entry</DialogTitle>
                    <DialogDescription>
                        This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>
                <EditForm rowData={rowData} />
                <DialogClose asChild>
                    <Button type="button" variant="secondary" onClick={() => { onEditClose?.call({}); setOpen(false); }}>
                        Close
                    </Button>
                </DialogClose>
            </DialogContent>
        </Dialog>
    );
}

type FilterOptions = {
    sort?: "Ascending" | "Descending" | "None",
    contains?: RegExp,
    col: keyof RichQuote
}


