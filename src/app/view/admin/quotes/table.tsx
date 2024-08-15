"use client"
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
import { Button } from "@/components/ui/button";
import { RichQuote } from "@/app/api/db/types";
import { FixedSizeList as List } from 'react-window';
import { FilterOptionsPanel } from './filteroptions';
import { EditForm } from "./editform";
import { TagStd } from "@/components/component/tag";
import { CSSProperties, useMemo, useState, useEffect, useRef } from 'react'
import { useToast } from "@/components/ui/use-toast";
import useWindowDimensions from "@/lib/useWindowDimensions";
import useToggle from "@/lib/useToggle";
import { CheckCircle2Icon, ListCollapseIcon } from "lucide-react";
import { ImperativePanelHandle } from "react-resizable-panels";


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
    const {value: disabledPanelControls, toggle: toggleDisabledControls} = useToggle(false)

    const [scrollbarSize, setScrollbarSize] = useState(0);


    useEffect(() => {
        setScrollbarSize(window.innerWidth - document.documentElement.clientWidth);

    }, [])

    function setColWidthsW(key: keyof RichQuote, s: number) {
        setColWidths(prevState => {
            const newObj = { ...prevState };
            newObj[key] = s;
            return newObj;
        });

    }

    const selectedData = useMemo(() => {
        return data.filter(containsFunction(filteroptions)).sort(sortFunction(sortoptions));
    }, [data, filteroptions, sortoptions]);

    return (
        <>
            <div className="w-full text-xs sm:text-md">
                <ResizablePanelGroup direction="horizontal" style={{ paddingRight: scrollbarSize + 1 }}>
                    <TableHeader
                        column={"id"}
                        columnName={"ID"}
                        defaultSize={colWidths.id}
                        handle={true}
                        disableHandle={disabledPanelControls}
                        onToggleDisabledControls={toggleDisabledControls}
                        onResize={setColWidthsW}
                        setFilterOptions={{ 'filter': setFilterOptions, 'sort' : setFilterOptions }}
                    />
                    <TableHeader
                        column={"preamble"}
                        columnName={"Preamble"}
                        defaultSize={colWidths.preamble}
                        handle={true}
                        disableHandle={disabledPanelControls}
                        onToggleDisabledControls={toggleDisabledControls}
                        onResize={setColWidthsW}
                        setFilterOptions={{ 'filter': setFilterOptions }}
                    />
                    <TableHeader
                        column={"quote"}
                        columnName={"Quote"}
                        defaultSize={colWidths.quote}
                        handle={true}
                        disableHandle={disabledPanelControls}
                        onToggleDisabledControls={toggleDisabledControls}
                        onResize={setColWidthsW}
                        setFilterOptions={{ 'filter': setFilterOptions }}
                    />
                    <TableHeader
                        column={"author"}
                        columnName={"Author"}
                        defaultSize={colWidths.author}
                        handle={true}
                        disableHandle={disabledPanelControls}
                        onToggleDisabledControls={toggleDisabledControls}
                        onResize={setColWidthsW}
                        setFilterOptions={{ 'filter': setFilterOptions }}
                    />
                    <TableHeader
                        column={"date"}
                        columnName={"Date"}
                        defaultSize={colWidths.date}
                        handle={true}
                        disableHandle={disabledPanelControls}
                        onToggleDisabledControls={toggleDisabledControls}
                        onResize={setColWidthsW}
                        setFilterOptions={{ 'filter': setFilterOptions, 'sort' : setFilterOptions }}
                    />
                    <TableHeader
                        column={"message_id"}
                        columnName={"Message ID"}
                        defaultSize={colWidths.message_id}
                        handle={true}
                        disableHandle={disabledPanelControls}
                        onToggleDisabledControls={toggleDisabledControls}
                        onResize={setColWidthsW}
                        setFilterOptions={{ 'filter': setFilterOptions }}
                    />
                    <TableHeader
                        column={"message_date"}
                        columnName={"Message Date"}
                        defaultSize={colWidths.message_date}
                        handle={true}
                        disableHandle={disabledPanelControls}
                        onToggleDisabledControls={toggleDisabledControls}
                        onResize={setColWidthsW}
                        setFilterOptions={{ 'filter': setFilterOptions, 'sort': setFilterOptions }}
                    />
                    <TableHeader
                        column={"tags"}
                        columnName={"Tags"}
                        defaultSize={colWidths.tags}
                        handle={false}
                        onResize={setColWidthsW}
                        setFilterOptions={{ 'filter': setFilterOptions }}
                    />
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
    disableHandle? : boolean,
    onResize: (key: keyof RichQuote, s: number) => void,
}) {

    const { toast } = useToast()

    return <>
        <ResizablePanel
            onResize={(f) => { props.onResize(props.column, f) }}
            defaultSize={props.defaultSize}
        >
            <div className="flex h-full items-center justify-center p-6">
                <div className="flex justify-center flex-grow">
                    <span className="font-semibold">{props.columnName ?? props.column}</span>
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
        {props.handle ? <ResizableHandle withHandle={!props.disableHandle} disabled={props.disableHandle} /> : "" }
    </>
}

function TableRow<T extends RichQuote>({ rowData, colWidths, className, style, onEditClose }: {
    rowData: T,
    colWidths: { [K in keyof T]: number },
    className?: string,
    style: CSSProperties,
    onEditClose?: () => void
}) {

    return (
        <Dialog>
            <DialogTrigger className={`w-full ${className}`} style={style}>
                <HoverCard>
                    <HoverCardTrigger asChild>
                        <div className="flex items-center justify-center h-full p-2 overflow-visible hover:border-white hover:border border-transparent" >
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
                                        case "message_date":
                                            innerhtml = rowData.message_date?.substring(0, 10).replaceAll('-', '/')
                                            break;
                                        default:
                                            const stringRepr = String(rowData[key as keyof T]);
                                            if (stringRepr.length > 50) { innerhtml = stringRepr.substring(0, 45) + " [...]" }
                                            else { innerhtml = stringRepr }
                                    }
                                    if (colWidths[key as keyof T] == 0) { return "" }
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

type FilterOptions = {
    sort?: "Ascending" | "Descending" | "None",
    contains?: RegExp,
    col: keyof RichQuote
}


