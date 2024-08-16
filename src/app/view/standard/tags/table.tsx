"use client"
import type { Tag } from "@/app/api/db/types";
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
    CardHeader
} from "@/components/ui/card";
import { FixedSizeList as List } from 'react-window';
import { FilterOptionsPanel } from '@/app/view/filteroptions';
import { FloatingHiddenColsList } from "@/app/view/hiddenColsList";
import { TagStd } from "@/components/component/tag";
import { CSSProperties, useState, useEffect } from 'react'
import { useToast } from "@/components/ui/use-toast";
import useWindowDimensions from "@/lib/useWindowDimensions";
import useToggle from "@/lib/useToggle";



export function Table({ data, onTableInvalid }: { data: Tag[], onTableInvalid: () => void }) {
    function sortFunction(options: FilterOptions): (a: Tag, b: Tag) => number {
        let dir = 0;
        if (options.sort == undefined) { return () => 0; }
        if (options.sort === "Ascending") { dir = 1; }
        else if (options.sort === "Descending") { dir = -1; }
        else { dir = 0; }
        return (a: Tag, b: Tag) => { return dir * (parseInt(String(a[options.col])) - parseInt(String(b[options.col]))) }
    }
    function containsFunction(options: FilterOptions): (a: Tag) => boolean {
        if (options.contains == undefined) { return (a) => false; }
        return (a: Tag) => { return options.contains!.test(String(a[options.col])) }
    }
    const [sortoptions, setSortOptions] = useState<FilterOptions>({ sort: "Descending", col: "id" })
    const [filteroptions, setFilterOptions] = useState<FilterOptions>({ contains: new RegExp(""), col: "title" })

    const pageDims = useWindowDimensions()
    const windowWidth = (pageDims.width == undefined || isNaN(pageDims.width!)) ? 600 : pageDims.width
    const smallWindow = (windowWidth! < 470)
    const [scrollbarSize, setScrollbarSize] = useState(0);
    useEffect(() => {
        setScrollbarSize(window.innerWidth - document.documentElement.clientWidth);
    }, [])

    const allKeys: Set<(keyof Tag)> = new Set(['id', 'category', 'title'])
    const [selectedCols, setSelectedCols] = useState<Set<(keyof Tag)>>(allKeys)
    const hiddenCols = [...allKeys].filter(x => !selectedCols.has(x))

    const stdWidth = 100 / 3;
    const [colWidths, setColWidths] = useState<{ [T in keyof Tag]: number }>({
        'id': stdWidth,
        'category': stdWidth,
        'title': stdWidth
    })

    function setColWidthsW(key: keyof Tag, s: number) {
        setColWidths(prevState => {
            const newObj = { ...prevState };
            newObj[key] = s;
            //console.log("Resized " + key + " to: " + s );
            return newObj;
        });
    }

    const { value: disabledPanelControls, toggle: toggleDisabledControls } = useToggle(false)

    let selectedData = data.filter(containsFunction(filteroptions)).sort(sortFunction(sortoptions));

    const colsConfig: { column: keyof Tag, columnName: string, filter: boolean, sort: boolean }[] = [
        { column: "id", columnName: "ID", filter: true, sort: true },
        { column: "category", columnName: "Category", filter: true, sort: false },
        { column: "title", columnName: "Title", filter: true, sort: false },
    ]
    const selectedColConfigs = colsConfig.filter((v) => selectedCols.has(v.column))

    const [rerenderHiddenColsList, setRerenderHiddenColsList] = useState(0)

    return (
        <>
            <FloatingHiddenColsList
                list={hiddenCols}
                onItemRemoved={(i) => { setSelectedCols(selectedCols.add(i as keyof Tag)); setRerenderHiddenColsList(rerenderHiddenColsList + 1) }}
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
                                onHide={(column) => { setSelectedCols(selectedCols.difference(new Set([column]))) }}
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
    column: keyof Tag,
    columnName?: string,
    defaultSize: number,
    setFilterOptions: {
        sort?: (value: FilterOptions) => void,
        filter?: (value: FilterOptions) => void,
    }
    handle: boolean,
    onToggleDisabledControls?: () => void,
    disableHandle?: boolean,
    onResize: (key: keyof Tag, s: number) => void,
    onHide: (column: keyof Tag) => void,
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

function TableRow<T extends Tag>({ rowData, colWidths, className, style, onEditClose, hiddenCols }: {
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
                    <div className="flex items-center justify-center h-full p-2 overflow-visible hover:border-white hover:border border-transparent" >
                        {
                            Object.keys(rowData).map((key, index) => {
                                if (hiddenCols?.includes(key as keyof T)) { return "" }
                                return <span style={{ width: colWidths[key as keyof T] + "%", paddingLeft: "0.5rem" }} key={index}>
                                    {String(rowData[key as keyof T])}
                                </span>
                            })
                        }
                    </div>
                </HoverCardTrigger>
                <HoverCardContent asChild>
                    <Card className="w-96">
                        <CardContent>
                            <div className="text-xl">
                                <TagStd tag={rowData} />
                            </div>
                        </CardContent>
                    </Card>
                </HoverCardContent>
            </HoverCard>
        </div>
    );
}




type FilterOptions = {
    sort?: "Ascending" | "Descending" | "None",
    contains?: RegExp,
    col: keyof Tag
}


