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
    CardHeader, 
    CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FixedSizeList as List } from 'react-window'
import { FilterOptionsPanel } from './filteroptions'
import { EditForm } from "./editform";
import { Toaster } from "@/components/ui/toaster";
import { AuthorTagStd, TagStd } from "@/components/component/tag";
import { Author } from "@/app/api/db/types";

import { CSSProperties, useState } from 'react'
import { useToast } from "@/components/ui/use-toast";
import useScrollbarSize from 'react-scrollbar-size';
import { CheckCircle2Icon } from "lucide-react";



export function Table({ data }: { data: Author[] }) {
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
    
    const stdWidth = 100 / 4;
    const [colWidths, setColWidths] = useState<{ [T in keyof Author]: number }>({ 
        'id': stdWidth, 
        'preferred_name': stdWidth, 
        'search_text': stdWidth, 
        'tag': stdWidth 
    });

    const scrollbarSize = useScrollbarSize()
    const { toast } = useToast()

    function setColWidthsW(key: keyof Author, s: number) {
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
                    <ResizablePanel onResize={(a) => { setColWidthsW("id", a) }}>
                        <div className="flex h-full items-center justify-center p-6">
                            <div className="flex justify-center flex-grow">
                                <span className="font-semibold">ID</span>
                            </div>
                            <FilterOptionsPanel canBeSorted={true} onDismiss={(v) => {
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
                    <ResizablePanel onResize={(a) => { setColWidthsW("preferred_name", a) }}>
                        <div className="flex h-full items-center justify-center p-6">
                            <div className="flex justify-center flex-grow">
                                <span className="font-semibold">Preferred Name</span>
                            </div>
                            <FilterOptionsPanel canBeSorted={true} onDismiss={(v) => {
                                setSortOptions({ sort: v.direction, col: "preferred_name" });
                                setFilterOptions({ contains: new RegExp(v.contains, "i"), col: "preferred_name" });
                                toast({
                                    description: `Filtered to contain: ${v.contains}`,
                                });
                                toast({
                                    description: `Sorted into ${v.direction} order by Preferred Name`,
                                });
                            }} />
                        </div>
                    </ResizablePanel>
                    <ResizableHandle withHandle={true} />
                    <ResizablePanel onResize={(a) => { setColWidthsW("search_text", a) }}>
                        <div className="flex h-full items-center justify-center p-6">
                            <div className="flex justify-center flex-grow">
                                <span className="font-semibold">search_text</span>
                            </div>
                            <FilterOptionsPanel canBeSorted={true} onDismiss={(v) => {
                                setSortOptions({ sort: v.direction, col: "search_text" });
                                setFilterOptions({ contains: new RegExp(v.contains, "i"), col: "search_text" });
                                toast({
                                    description: `Filtered to contain: ${v.contains}`,
                                });
                                toast({
                                    description: `Sorted into ${v.direction} order by Search Text`,
                                });
                            }} />
                        </div>
                    </ResizablePanel>
                    <ResizableHandle withHandle={true} />
                    <ResizablePanel onResize={(g) => { setColWidthsW("tag", g) }}>
                        <div className="flex h-full items-center justify-center p-6">
                            <div className="flex justify-center flex-grow">
                                <span className="font-semibold">Tags</span>
                            </div>
                            <FilterOptionsPanel canBeSorted={false} onDismiss={(v) => {
                                setSortOptions({ sort: v.direction, col: "tag" });
                                setFilterOptions({ contains: new RegExp(v.contains, "i"), col: "tag" })
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
function TableRow<T extends Author>({ rowData, colWidths, className, style, onEditClose }: {
    rowData: T,
    colWidths: { [K in keyof T]: number },
    className? : string,
    style: CSSProperties,
    onEditClose?: () => void
}) {

    return (
        <Dialog>
            <DialogTrigger className={`w-full ${className}`} style={style}>
                <HoverCard>
                    <HoverCardTrigger asChild>
                        <div className="flex h-full p-2 overflow-visible hover:border-white hover:border border-transparent" >
                            {
                                Object.keys(rowData).map((key, index) => {
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
                                    <AuthorTagStd author={rowData}/>
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
    col: keyof Author
}


