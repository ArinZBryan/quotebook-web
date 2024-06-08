"use client"
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable"
import { Toaster } from "@/components/ui/toaster";
import { Author } from "@/app/api/db/types";

import { FilterOptionsPanel } from './filteroptions'
import { useEffect, useRef, useState } from 'react'
import { useToast } from "@/components/ui/use-toast";
import { EyeOffIcon } from "lucide-react";
import { TagStd } from "@/components/component/tag";


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

    const [colsToHide, setColsToHide] = useState<(keyof Author)[]>([]);
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
    const selectedData = filteredData.map(selectFunction((Object.keys(data[0]) as (keyof typeof data[0])[]).filter(x => !colsToHide.includes(x))))
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
                                {colsToHide.find((v) => v == "preferred_name") == undefined ? (
                                    <>
                                        <ResizablePanel onResize={(a) => { setColWidthsW("preferred_name", a) }}>
                                            <div className="flex h-full items-center justify-center p-6">
                                                <div className="flex justify-center flex-grow">
                                                    <span className="font-semibold hover:line-through hover:cursor-pointer" onClick={() => { setColsToHide([...colsToHide, "preferred_name"]) }}>Preferred Name</span>
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
                                    </>
                                ) : <></>}
                                {colsToHide.find((v) => v == "search_text") == undefined ? (
                                    <>
                                        <ResizablePanel onResize={(a) => { setColWidthsW("search_text", a) }}>
                                            <div className="flex h-full items-center justify-center p-6">
                                                <div className="flex justify-center flex-grow">
                                                    <span className="font-semibold hover:line-through hover:cursor-pointer" onClick={() => { setColsToHide([...colsToHide, "search_text"]) }}>search_text</span>
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
                                    </>
                                ) : <></>}
                                {colsToHide.find((v) => v == 'tag') == undefined ? (
                                    <>
                                        <ResizablePanel onResize={(g) => { setColWidthsW("tag", g) }}>
                                            <div className="flex h-full items-center justify-center p-6">
                                                <div className="flex justify-center flex-grow">
                                                    <span className="font-semibold hover:line-through hover:cursor-pointer" onClick={() => { setColsToHide([...colsToHide, "tag"]) }}>Tags</span>
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
                                    </>) : <></>}
                            </ResizablePanelGroup>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            {selectedData.map((v, i) =>
                                <div className={`${i % 2 == 0 ? " bg-gray-950" : ""}`} key={i}>
                                    <TableRow rowData={v} colWidths={colWidths} formData={filteredData[i]}/>
                                </div>
                            )}
                        </td>
                    </tr>
                </tbody>
            </table>
        </>
    )
}
function TableRow<T extends Partial<Author>>({ rowData, colWidths, formData }: { rowData: T, colWidths: { [K in keyof T]: number }, formData: Author }) {
    
    return (
        <div className="flex h-full p-2 overflow-visible hover:border-white hover:border border-transparent">
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
        </div>
    );
}

type FilterOptions = {
    sort?: "Ascending" | "Descending" | "None",
    contains?: RegExp,
    col: keyof Author
}


