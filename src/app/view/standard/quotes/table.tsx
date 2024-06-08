"use client"
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable"
import { Toaster } from "@/components/ui/toaster";
import { RichQuote } from "@/app/api/db/types";

import { FilterOptionsPanel } from './filteroptions'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useToast } from "@/components/ui/use-toast";
import { EyeOffIcon } from "lucide-react";
import { TagStd } from "@/components/component/tag";

interface TableProps {
    data: RichQuote[],
    onTableInvalid: () => void
}

// The below IDE warning is actually fine. As this client component is only ever used by other client components, there
// is no issue here, just the TS VSCode plugin being wierd.
// This even has an issue on github: https://github.com/vercel/next.js/issues/55332, so it is a known issue.
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
    function selectFunction(cols: (keyof RichQuote)[]): (quote: RichQuote) => Partial<RichQuote> {
        return (q: RichQuote) => {
            let p: Partial<RichQuote> = {}
            cols.forEach((key: keyof RichQuote) => {
                //the below code is fine, it will not error and compiles fine, but vscode is having a hissy
                //@ts-ignore
                p[key] = q[key]
            })
            return p;
        }
    }

    const [colsToHide, setColsToHide] = useState<(keyof RichQuote)[]>([])
    const [sortoptions, setSortOptions] = useState<FilterOptions>({ sort: "Descending", col: "id" })
    const [filteroptions, setFilterOptions] = useState<FilterOptions>({ contains: new RegExp(""), col: "author" })
    const [colWidths, setColWidths] = useState<{ [T in keyof RichQuote]: number }>({ 'id': 100 / 8, 'preamble': 100 / 8, 'quote': 100 / 8, 'author': 100 / 8, 'date': 100 / 8, 'confirmed_date': 100 / 8, 'tags': 100 / 8, 'message_id': 100 / 8 })

    const { toast } = useToast()

    const elementRef = useRef<HTMLDivElement>(null);
    const [width, setWidth] = useState<number>(0);

    useEffect(() => {
        if (elementRef.current) {
            const elementWidth = elementRef.current.offsetWidth;
            setWidth(elementWidth);
        }
    }, [elementRef]);

    function setColWidthsW(key: keyof RichQuote, s: number) {
        setColWidths(prevState => {
            const newObj = { ...prevState };
            newObj[key] = s;
            //console.log("Resized " + key + " to: " + s );
            return newObj;
        });
    }

    const memoizedData = useMemo(() => {
        return data.filter(containsFunction(filteroptions)).sort(sortFunction(sortoptions));
    }, [data, filteroptions, sortoptions]);

    const selectedData = useMemo(() => {
        return memoizedData.map(selectFunction((Object.keys(data[0]) as (keyof typeof data[0])[]).filter(x => !colsToHide.includes(x))));
    }, [memoizedData, colsToHide]);

    return (
        <>
            <Toaster />
            <table className="w-full">
                <tbody>
                    <tr>
                        <td>
                            <div className="flex flex-row flex-wrap justify-center" ref={elementRef}>
                                {
                                    colsToHide.map((v) =>
                                        <div className="flex flex-row pl-1 pr-2 hover:line-through hover:cursor-pointer" onClick={() => {
                                            setColsToHide(colsToHide.filter((a) => a !== v))
                                        }}>
                                            <EyeOffIcon />
                                            <div className="pl-2">{v}</div>
                                        </div>
                                    )
                                }
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td className="">
                            <ResizablePanelGroup direction="horizontal">
                                {colsToHide.find((v) => v == "id") == undefined ? (
                                    <>
                                        <ResizablePanel onResize={(a) => { setColWidthsW("id", a) }}>
                                            <div className="flex h-full items-center justify-center p-6">
                                                <div className="flex justify-center flex-grow">
                                                    <span className="font-semibold hover:line-through hover:cursor-pointer" onClick={() => { setColsToHide([...colsToHide, "id"]) }}>ID</span>
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
                                    </>
                                ) : <></>}
                                {colsToHide.find((v) => v == "preamble") == undefined ? (
                                    <>
                                        <ResizablePanel onResize={(b) => { setColWidthsW("preamble", b) }}>
                                            <div className="flex h-full items-center justify-center p-6">
                                                <div className="flex justify-center flex-grow">
                                                    <span className="font-semibold hover:line-through hover:cursor-pointer" onClick={() => { setColsToHide([...colsToHide, "preamble"]) }}>Preamble</span>
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
                                    </>) : <></>}
                                {colsToHide.find((v) => v == "quote") == undefined ? (
                                    <>
                                        <ResizablePanel onResize={(c) => { setColWidthsW("quote", c) }}>
                                            <div className="flex h-full items-center justify-center p-6">
                                                <div className="flex justify-center flex-grow">
                                                    <span className="font-semibold hover:line-through hover:cursor-pointer" onClick={() => { setColsToHide([...colsToHide, "quote"]) }}>RichQuote</span>
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
                                    </>) : <></>}
                                {colsToHide.find((v) => v == "author") == undefined ? (
                                    <>
                                        <ResizablePanel onResize={(d) => { setColWidthsW("author", d) }}>
                                            <div className="flex h-full items-center justify-center p-6">
                                                <div className="flex justify-center flex-grow">
                                                    <span className="font-semibold hover:line-through hover:cursor-pointer" onClick={() => { setColsToHide([...colsToHide, "author"]) }}>Author</span>
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
                                    </>) : <></>}
                                {colsToHide.find((v) => v == "date") == undefined ? (
                                    <>
                                        <ResizablePanel onResize={(e) => { setColWidthsW("date", e) }}>
                                            <div className="flex h-full items-center justify-center p-6">
                                                <div className="flex justify-center flex-grow">
                                                    <span className="font-semibold hover:line-through hover:cursor-pointer" onClick={() => { setColsToHide([...colsToHide, "date"]) }}>Date</span>
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
                                    </>) : <></>}
                                {colsToHide.find((v) => v == "confirmed_date") == undefined ? (
                                    <>
                                        <ResizablePanel onResize={(f) => { setColWidthsW("confirmed_date", f) }}>
                                            <div className="flex h-full items-center justify-center p-6">
                                                <div className="flex justify-center flex-grow">
                                                    <span className="font-semibold hover:line-through hover:cursor-pointer" onClick={() => { setColsToHide([...colsToHide, "confirmed_date"]) }}>Confirmed Date</span>
                                                </div>
                                                <FilterOptionsPanel canBeSorted={false} onDismiss={(v) => {
                                                    setFilterOptions({ contains: new RegExp(v.contains, "i"), col: "confirmed_date" })
                                                    toast({
                                                        description: `Filtered to contain: ${v.contains}`,
                                                    });
                                                }} />
                                            </div>
                                        </ResizablePanel>
                                        <ResizableHandle withHandle={true} />
                                    </>) : <></>}
                                {colsToHide.find((v) => v == "message_id") == undefined ? (
                                    <>
                                        <ResizablePanel onResize={(g) => { setColWidthsW("message_id", g) }}>
                                            <div className="flex h-full items-center justify-center p-6">
                                                <div className="flex justify-center flex-grow">
                                                    <span className="font-semibold hover:line-through hover:cursor-pointer" onClick={() => { setColsToHide([...colsToHide, "message_id"]) }}>Message ID</span>
                                                </div>
                                                <FilterOptionsPanel canBeSorted={true} onDismiss={(v) => {
                                                    setSortOptions({ sort: v.direction, col: "message_id" });
                                                    setFilterOptions({ contains: new RegExp(v.contains, "i"), col: "message_id" })
                                                    toast({
                                                        description: `Filtered to contain: ${v.contains}`,
                                                    });
                                                    toast({
                                                        description: `Sorted into ${v.direction} order by message_id`,
                                                    });
                                                }} />
                                            </div>
                                        </ResizablePanel>
                                        <ResizableHandle withHandle={true} />
                                    </>) : <></>}
                                {colsToHide.find((v) => v == "tags") == undefined ? (
                                    <>
                                        <ResizablePanel onResize={(f) => { setColWidthsW("tags", f) }}>
                                            <div className="flex h-full items-center justify-center p-6">
                                                <div className="flex justify-center flex-grow">
                                                    <span className="font-semibold hover:line-through hover:cursor-pointer" onClick={() => { setColsToHide([...colsToHide, "tags"]) }}>Tags</span>
                                                </div>
                                                <FilterOptionsPanel canBeSorted={false} onDismiss={(v) => {
                                                    setFilterOptions({ contains: new RegExp(v.contains, "i"), col: "tags" })
                                                    toast({
                                                        description: `Filtered to contain: ${v.contains}`,
                                                    });
                                                }} />
                                            </div>
                                        </ResizablePanel>

                                    </>) : <></>}
                            </ResizablePanelGroup>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            {selectedData.map((v, i) =>
                                <div className={`${i % 2 == 0 ? " bg-gray-950" : ""}`} key={i}>
                                    <TableRow rowData={v} colWidths={colWidths} formData={memoizedData[i]} onEditClose={() => onTableInvalid()} />
                                </div>
                            )}
                        </td>
                    </tr>
                </tbody>
            </table>
        </>
    )
}

function TableRow<T extends Partial<RichQuote>>({ rowData, colWidths, formData, onEditClose }: { rowData: T, colWidths: { [K in keyof T]: number }, formData: RichQuote, onEditClose: () => void }) {


    return (
        <div
            className="flex h-full p-2 overflow-visible hover:border-white hover:border border-transparent"
        >
            {
                Object.keys(rowData).map((key, index) => {
                    return (
                        <span
                            style={{
                                width: colWidths[key as keyof T] + "%",
                                paddingLeft: "0.5rem",
                            }}
                            key={index}
                        >
                            {(() => {
                                switch (key) {
                                    case "author":
                                        return rowData.author?.preferred_name;
                                        break;
                                    case "tags":
                                        return useMemo(() => (
                                            <div className="flex flex-row flex-wrap">
                                                {rowData.tags!.map((tag, index) => (
                                                    <TagStd tag={tag} key={index} />
                                                ))}
                                            </div>
                                        ), [rowData.tags]);
                                    default:
                                        return String(rowData[key as keyof T]);
                                }
                            })()}
                        </span>
                    );
                })
            }
            <hr />
        </div>
    );
}



type FilterOptions = {
    sort?: "Ascending" | "Descending" | "None",
    contains?: RegExp,
    col: keyof RichQuote
}


