"use client"
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable"
import { Toaster } from "@/components/ui/toaster";
import { FixedSizeList as List } from 'react-window'
import { FilterOptionsPanel } from './filteroptions'
import { Tag } from "@/app/api/db/types";
import { CSSProperties, useState, useEffect } from 'react'
import { useToast } from "@/components/ui/use-toast";



export function Table({ data }: { data: Tag[] }) {
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

    const stdWidth = 100 / 3
    const [colWidths, setColWidths] = useState<{ [T in keyof Tag]: number }>({
        'id': stdWidth,
        'category': stdWidth,
        'title': stdWidth
    })

    const [scrollbarSize, setScrollbarSize] = useState(0);

    useEffect(() => {
        setScrollbarSize(window.innerWidth - document.documentElement.clientWidth);
    }, [])
    const { toast } = useToast()

    function setColWidthsW(key: keyof Tag, s: number) {
        setColWidths(prevState => {
            const newObj = { ...prevState };
            newObj[key] = s;
            //console.log("Resized " + key + " to: " + s );
            return newObj;
        });
    }

    let selectedData = data.filter(containsFunction(filteroptions)).sort(sortFunction(sortoptions));

    return (
        <>
            <Toaster />
            <div className="w-full">
                <ResizablePanelGroup direction="horizontal" style={{ paddingRight: scrollbarSize }}>
                    <ResizablePanel onResize={(a) => { setColWidthsW("id", a) }}>
                        <div className="flex h-full items-center justify-center p-6">
                            <div className="flex justify-center flex-grow">
                                <span className="font-semibold">ID</span>
                            </div>
                            <FilterOptionsPanel canBeSorted={true} onSubmit={(v) => {
                                setSortOptions({ sort: v.direction, col: "id" });
                                setFilterOptions({ contains: new RegExp(v.contains, "i"), col: "id" });
                                toast({
                                    description: `Filtered to contain: ${v.contains}`,
                                });
                                toast({
                                    description: `Sorted into ${v.direction} order by ID`,
                                });
                            }} />
                        </div>
                    </ResizablePanel>
                    <ResizableHandle withHandle={true} />
                    <ResizablePanel onResize={(f) => { setColWidthsW("category", f) }}>
                        <div className="flex h-full items-center justify-center p-6">
                            <div className="flex justify-center flex-grow">
                                <span className="font-semibold">Category</span>
                            </div>
                            <FilterOptionsPanel canBeSorted={true} onSubmit={(v) => {
                                setFilterOptions({ contains: new RegExp(v.contains, "i"), col: "category" })
                                toast({
                                    description: `Filtered to contain: ${v.contains}`,
                                });
                                toast({
                                    description: `Sorted into ${v.direction} order by category`,
                                });
                            }} />
                        </div>
                    </ResizablePanel>
                    <ResizableHandle withHandle={true} />
                    <ResizablePanel onResize={(g) => { setColWidthsW("title", g) }}>
                        <div className="flex h-full items-center justify-center p-6">
                            <div className="flex justify-center flex-grow">
                                <span className="font-semibold">Title</span>
                            </div>
                            <FilterOptionsPanel canBeSorted={true} onSubmit={(v) => {
                                setSortOptions({ sort: v.direction, col: "title" });
                                setFilterOptions({ contains: new RegExp(v.contains, "i"), col: "title" })
                                toast({
                                    description: `Filtered to contain: ${v.contains}`,
                                });
                                toast({
                                    description: `Sorted into ${v.direction} order by title`,
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

function TableRow<T extends Tag>({ rowData, colWidths, className, style, onEditClose }: {
    rowData: T,
    colWidths: { [K in keyof T]: number },
    className?: string,
    style: CSSProperties,
    onEditClose?: () => void
}) {

    return (
        <div className="flex h-full p-2 overflow-visible hover:border-white hover:border border-transparent" style={style}>
            {
                Object.keys(rowData).map((key, index) => {
                    return <span style={{ width: colWidths[key as keyof T] + "%", paddingLeft: "0.5rem" }} key={index}>
                        {String(rowData[key as keyof T])}
                    </span>
                })
            }
        </div>
    );
}



type FilterOptions = {
    sort?: "Ascending" | "Descending" | "None",
    contains?: RegExp,
    col: keyof Tag
}


