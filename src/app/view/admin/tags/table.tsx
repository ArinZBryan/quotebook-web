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
import { Tag } from "@/app/api/db/types";
import { Button } from "@/components/ui/button";
import { FilterOptionsPanel } from './filteroptions'
import { useEffect, useRef, useState } from 'react'
import { useToast } from "@/components/ui/use-toast";
import { EyeOffIcon } from "lucide-react";
import { EditForm } from "./editform";



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
    function selectFunction(cols: (keyof Tag)[]): (Tag: Tag) => Partial<Tag> {
        return (q: Tag) => {
            let p: Partial<Tag> = {}
            cols.forEach((key: keyof Tag) => {
                //@ts-ignore
                p[key] = q[key]
            })
            return p;
        }
    }

    const [sortoptions, setSortOptions] = useState<FilterOptions>({ sort: "Descending", col: "id" })
    const [filteroptions, setFilterOptions] = useState<FilterOptions>({ contains: new RegExp(""), col: "title" })
    const [colWidths, setColWidths] = useState<{ [T in keyof Tag]: number }>({ 'id': 100 / 3, 'category': 100 / 3, 'title': 100 / 3 })

    const { toast } = useToast()

    const elementRef = useRef<HTMLDivElement>(null);
    const [width, setWidth] = useState<number>(0);

    useEffect(() => {
        if (elementRef.current) {
            const elementWidth = elementRef.current.offsetWidth;
            setWidth(elementWidth);
        }
    }, [elementRef]);

    function setColWidthsW(key: keyof Tag, s: number) {
        setColWidths(prevState => {
            const newObj = { ...prevState };
            newObj[key] = s;
            //console.log("Resized " + key + " to: " + s );
            return newObj;
        });
    }

    let filteredData = data.filter(containsFunction(filteroptions)).sort(sortFunction(sortoptions));
    let selectedData = filteredData.map(selectFunction((Object.keys(data[0]) as (keyof typeof data[0])[])))
    return (
        <>
            <Toaster />
            <table className="w-full">
                <tbody>
                    <tr>
                        <td className="">
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
                                <ResizablePanel onResize={(f) => { setColWidthsW("category", f) }}>
                                    <div className="flex h-full items-center justify-center p-6">
                                        <div className="flex justify-center flex-grow">
                                            <span className="font-semibold">Category</span>
                                        </div>
                                        <FilterOptionsPanel canBeSorted={true} onDismiss={(v) => {
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
                                        <FilterOptionsPanel canBeSorted={true} onDismiss={(v) => {
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
                        </td>
                    </tr>
                    <tr>
                        {selectedData.map((v, i) =>
                            <div className={`${i % 2 == 0 ? "bg-gray-300 dark:bg-gray-950" : ""}`} key={i}>
                                <TableRow rowData={v} colWidths={colWidths} formData={filteredData[i]} />
                            </div>
                        )}
                    </tr>
                </tbody>
            </table>
        </>
    )
}

function TableRow<T extends Partial<Tag>>({ rowData, colWidths, formData }: { rowData: T, colWidths: { [K in keyof T]: number }, formData: Tag }) {

    const [dialogOpen, setDialogOpen] = useState(false);

    return (
        <div
            className="flex h-full p-2 overflow-visible hover:border-white hover:border border-transparent"
            onDoubleClick={() => setDialogOpen(true)}
        >
            {
                Object.keys(rowData).map((key, index) => {
                    return <span style={{ width: colWidths[key as keyof T] + "%", paddingLeft: "0.5rem" }} key={index}>
                        {String(rowData[key as keyof T])}
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
    col: keyof Tag
}


