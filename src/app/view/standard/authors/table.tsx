"use client"
import type { Author } from "@/app/api/db/types";
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
    CardTitle
} from "@/components/ui/card";
import { FixedSizeList as List } from 'react-window';
import { FilterOptionsPanel } from '@/app/view/filteroptions';
import { AuthorTagStd, TagStd } from "@/components/component/tag";
import { FloatingHiddenColsList } from "@/app/view/hiddenColsList";
import { CSSProperties, useState, useEffect } from 'react'
import { useToast } from "@/components/ui/use-toast";
import useWindowDimensions from "@/lib/useWindowDimensions";
import useToggle from "@/lib/useToggle";


export function Table({ data, onTableInvalid }: { data: Author[], onTableInvalid: () => void }) {
    function sortFunction(options: FilterOptions): (a: Author, b: Author) => number {
        let dir = 0;
        if (options.sort == undefined) { return () => 0; }
        if (options.sort === "Ascending") { dir = 1; }
        else if (options.sort === "Descending") { dir = -1; }
        else { dir = 0; }
        return (a: Author, b: Author) => { return dir * (parseInt(String(a[options.col])) - parseInt(String(b[options.col]))) }
    }
    function containsFunction(options: FilterOptions): (a: Author) => boolean {
        if (options.contains == undefined) { return (a) => false; }
        return (a: Author) => { return options.contains!.test(String(a[options.col])) }
    }

    const [sortoptions, setSortOptions] = useState<FilterOptions>({ sort: "Descending", col: "id" });
    const [filteroptions, setFilterOptions] = useState<FilterOptions>({ contains: new RegExp(""), col: "preferred_name" });

    const pageDims = useWindowDimensions()
    const windowWidth = (pageDims.width == undefined || isNaN(pageDims.width!)) ? 600 : pageDims.width
    const smallWindow = (windowWidth! < 470)
    const [scrollbarSize, setScrollbarSize] = useState(0);
    useEffect(() => {
        setScrollbarSize(window.innerWidth - document.documentElement.clientWidth);
    }, [])

    const allKeys: Set<(keyof Author)> = new Set(['id', 'preferred_name', 'search_text', 'tag'])
    const [selectedCols, setSelectedCols] = useState<Set<(keyof Author)>>(allKeys)
    const hiddenCols = [...allKeys].filter(x => !selectedCols.has(x))

    const stdWidth = 100 / 4;
    const [colWidths, setColWidths] = useState<{ [T in keyof Author]: number }>({
        'id': stdWidth,
        'preferred_name': stdWidth,
        'search_text': stdWidth,
        'tag': stdWidth
    });

    function setColWidthsW(key: keyof Author, s: number) {
        setColWidths(prevState => {
            const newObj = { ...prevState };
            newObj[key] = s;
            //console.log("Resized " + key + " to: " + s );
            return newObj;
        });
    }

    const { value: disabledPanelControls, toggle: toggleDisabledControls } = useToggle(false)

    const selectedData = data.filter(containsFunction(filteroptions)).sort(sortFunction(sortoptions));

    const colsConfig: { column: keyof Author, columnName: string, filter: boolean, sort: boolean }[] = [
        { column: "id", columnName: "ID", filter: true, sort: true },
        { column: "preferred_name", columnName: "Preferred Name", filter: true, sort: false },
        { column: "search_text", columnName: "Aliases", filter: true, sort: false },
        { column: "tag", columnName: "Tag", filter: true, sort: false },
    ]

    const selectedColConfigs = colsConfig.filter((v) => selectedCols.has(v.column))

    const [rerenderHiddenColsList, setRerenderHiddenColsList] = useState(0)

    return (
        <>
            <FloatingHiddenColsList
                list={hiddenCols}
                onItemRemoved={(i) => { setSelectedCols(selectedCols.add(i as keyof Author)); setRerenderHiddenColsList(rerenderHiddenColsList + 1) }}
                rerender={rerenderHiddenColsList}
            />
            <div className="w-full text-xs sm:text-md">
                <ResizablePanelGroup direction="horizontal" style={{ paddingRight: scrollbarSize }}>
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
                                onHide={(column) => {
                                    const newSet = new Set([...selectedCols].filter((x) => x != column))
                                    setSelectedCols(newSet)
                                }}
                                setFilterOptions={{ 'filter': col.filter ? setFilterOptions : undefined, 'sort': col.sort ? setSortOptions : undefined }}
                                order={idx}
                                key={idx}
                            />
                        )
                    }
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
    column: keyof Author,
    columnName?: string,
    defaultSize: number,
    setFilterOptions: {
        sort?: (value: FilterOptions) => void,
        filter?: (value: FilterOptions) => void,
    }
    handle: boolean,
    onToggleDisabledControls?: () => void,
    disableHandle?: boolean,
    onResize: (key: keyof Author, s: number) => void,
    onHide: (column: keyof Author) => void,
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
                    <span className="font-semibold hover:line-through hover:cursor-pointer" onClick={() => { props.onHide(props.column) }}>{props.columnName ?? props.column}</span>
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

function TableRow<T extends Author>({ rowData, colWidths, className, style, onEditClose, hiddenCols }: {
    rowData: T,
    colWidths: { [K in keyof T]: number },
    className?: string,
    style: CSSProperties,
    onEditClose?: () => void,
    hiddenCols?: (keyof T)[]
}) {

    return (
        <div className={`w-full ${className}`} style={style}>
            <HoverCard>
                <HoverCardTrigger asChild>
                    <div className="flex h-full p-2 overflow-visible hover:border-white hover:border border-transparent" >
                        {
                            Object.keys(rowData).map((key, index) => {
                                if (hiddenCols?.includes(key as keyof T)) { return "" }
                                return <span style={{ width: colWidths[key as keyof T] + "%", paddingLeft: "0.5rem" }} key={index}>
                                    {
                                        key != 'tag' ? String(rowData[key as keyof T]) : <TagStd tag={rowData.tag!} />
                                    }
                                </span>
                            })
                        }
                    </div>
                </HoverCardTrigger>
                <HoverCardContent asChild>
                    <Card className="w-96">
                        <CardTitle className="text-md">
                            <div>Author</div>
                        </CardTitle>
                        <CardDescription>
                            <div>
                                #{rowData.id}
                            </div>
                        </CardDescription>
                        <CardContent>
                            <div className="text-xl flex flex-col">
                                {rowData.preferred_name}
                                <AuthorTagStd author={rowData} />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <div className="flex flex-col justify-center flex-grow">
                                Also known as:
                                <div className="flex-grow flex flex-row flex-wrap justify-center">
                                    {rowData.search_text.split(",").map((n, i) => <span key={i}>{n}</span>)}
                                </div>
                            </div>
                        </CardFooter>
                    </Card>
                </HoverCardContent>
            </HoverCard>
        </div>
    );
}

type FilterOptions = {
    sort?: "Ascending" | "Descending" | "None",
    contains?: RegExp,
    col: keyof Author
}


