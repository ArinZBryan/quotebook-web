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
} from "@/components/ui/dialog"
import { Toaster } from "@/components/ui/toaster";
import { Author } from "@/app/api/db/types";

import { FilterOptionsPanel } from './filteroptions'
import { useEffect, useRef, useState } from 'react'
import { useToast } from "@/components/ui/use-toast";
import { EyeOffIcon } from "lucide-react";
import { TagStd } from "@/components/component/tag";
import { Button } from "@/components/ui/button";
import { EditForm } from "./editform";


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
    function selectFunction(keys: (keyof Author)[]): (author: Author) => Partial<Author> {
        return (author: Author): Partial<Author> => {
            const result: Partial<Author> = {};
            keys.forEach(key => {
                if (key in author) {
                    //the below code is fine, it will not error and compiles fine, but vscode is having a hissy
                    //@ts-ignore
                    result[key] = author[key]
                }
            });
            return result;
        };
    }

    const [sortoptions, setSortOptions] = useState<FilterOptions>({ sort: "Descending", col: "id" });
    const [filteroptions, setFilterOptions] = useState<FilterOptions>({ contains: new RegExp(""), col: "preferred_name" });
    const [colWidths, setColWidths] = useState<{ [T in keyof Author]: number }>({ 'id': 100 / 4, 'preferred_name': 100 / 4, 'search_text': 100 / 4, 'tag': 100 / 4 });

    const { toast } = useToast()

    const elementRef = useRef<HTMLDivElement>(null);
    const [width, setWidth] = useState<number>(0);

    useEffect(() => {
        if (elementRef.current) {
            const elementWidth = elementRef.current.offsetWidth;
            setWidth(elementWidth);
        }
    }, [elementRef]);

    function setColWidthsW(key: keyof Author, s: number) {
        setColWidths(prevState => {
            const newObj = { ...prevState };
            newObj[key] = s;
            //console.log("Resized " + key + " to: " + s );
            return newObj;
        });
    }

    const filteredData = data.filter(containsFunction(filteroptions)).sort(sortFunction(sortoptions));
    const selectedData = filteredData.map(selectFunction((Object.keys(data[0]) as (keyof typeof data[0])[])))
    return (
        <>
            <div className="w-full">
                <ResizablePanelGroup direction="horizontal">
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
                {selectedData.map((v, i) =>
                    <div className={`${i % 2 == 0 ? "bg-gray-300 dark:bg-gray-950" : ""}`} key={i}>
                        <TableRow rowData={v} colWidths={colWidths} formData={filteredData[i]} />
                    </div>
                )}
            </div>
        </>
    )
}
function TableRow<T extends Partial<Author>>({ rowData, colWidths, formData }: { rowData: T, colWidths: { [K in keyof T]: number }, formData: Author }) {

    const [dialogOpen, setDialogOpen] = useState(false);

    return (
        <div className="flex h-full p-2 overflow-visible hover:border-white hover:border border-transparent"
            onDoubleClick={() => setDialogOpen(true)}>
            {
                Object.keys(rowData).map((key, index) => {
                    return <span style={{ width: colWidths[key as keyof T] + "%", paddingLeft: "0.5rem" }} key={index}>
                        {
                            key != 'tag' ? String(rowData[key as keyof T]) : <TagStd tag={rowData.tag!} />
                        }
                    </span>
                })
            }
            <hr />
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Modify Entry</DialogTitle>
                        <DialogDescription>
                            This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <EditForm rowData={formData} />
                    <DialogClose asChild>
                        <Button type="button" variant="secondary" onClick={() => setDialogOpen(false)}>
                            Close
                        </Button>
                    </DialogClose>
                </DialogContent>
            </Dialog>
        </div>
    );
}

type FilterOptions = {
    sort?: "Ascending" | "Descending" | "None",
    contains?: RegExp,
    col: keyof Author
}


