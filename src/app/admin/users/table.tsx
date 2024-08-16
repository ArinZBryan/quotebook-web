"use client"
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable"
import { Toaster } from "@/components/ui/toaster";
import { useEffect, useRef, useState } from 'react'
import { useToast } from "@/components/ui/use-toast";
import { RichUser } from "@/app/api/db/types";
import { CheckCircle2Icon, CircleUserRoundIcon, CircleXIcon } from "lucide-react";
import Image from "next/image";
import { AuthorTagStd } from "@/components/component/tag";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";
import useWindowDimensions from "@/lib/useWindowDimensions";
import { FloatingHiddenColsList } from "@/app/view/hiddenColsList";
import { FilterOptionsPanel } from "@/app/view/filteroptions";
import useToggle from "@/lib/useToggle";


export function Table({ data, onItemSelected }: { data: RichUser[], onItemSelected: (selectedQuote: RichUser) => void }) {

    const std_width = 100 / 6
    const [colWidths, setColWidths] = useState<{ [T in keyof RichUser]: number }>({
        'id': std_width,
        'name': std_width,
        'email': std_width * 11 / 6,
        'emailVerified': 0,
        'image': std_width * 2 / 6,
        'admin': std_width * 3 / 6,
        'linked_author': std_width,
    });

    const pageDims = useWindowDimensions()
    const windowWidth = (pageDims.width == undefined || isNaN(pageDims.width!)) ? 600 : pageDims.width
    const smallWindow = (windowWidth! < 470)
    const [scrollbarSize, setScrollbarSize] = useState(0);
    useEffect(() => {
        setScrollbarSize(window.innerWidth - document.documentElement.clientWidth);
    }, [])


    const allKeys: Set<(keyof RichUser)> = new Set(['id', 'name', 'email', 'image', 'admin', 'linked_author'])
    const [selectedCols, setSelectedCols] = useState<Set<(keyof RichUser)>>(allKeys)
    const hiddenCols = [...allKeys].filter(x => !selectedCols.has(x))
    useEffect(() => {
        if (smallWindow) {
            setSelectedCols(new Set(['name', 'image', 'linked_author', 'admin']))
        }
    }, [smallWindow])


    function setColWidthsW(key: keyof RichUser, s: number) {
        setColWidths(prevState => {
            const newObj = { ...prevState };
            newObj[key] = s;
            console.log("Resized " + key + " to: " + s);
            return newObj;
        });
    }

    const { value: disabledPanelControls, toggle: toggleDisabledControls } = useToggle(false)

    const colsConfig: { column: keyof RichUser, columnName: string, filter: boolean, sort: boolean }[] = [
        { column: "id", columnName: "ID", filter: true, sort: false },
        { column: "name", columnName: "Username", filter: true, sort: true },
        { column: "email", columnName: "Email", filter: true, sort: false },
        { column: "image", columnName: "Image", filter: false, sort: false },
        { column: "admin", columnName: "Admin", filter: true, sort: false },
        { column: "linked_author", columnName: "Linked Author", filter: true, sort: false },
    ]
    const selectedColConfigs = colsConfig.filter((v) => selectedCols.has(v.column))

    const [rerenderHiddenColsList, setRerenderHiddenColsList] = useState(0)

    return (
        <>
            <FloatingHiddenColsList 
                list={hiddenCols} 
                onItemRemoved={(i) => { setSelectedCols(selectedCols.add(i as keyof RichUser)); setRerenderHiddenColsList(rerenderHiddenColsList + 1) }} 
                rerender={rerenderHiddenColsList}
            />
            <div className="w-full">
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
                                onHide={(column) => {
                                    const newSet = new Set([...selectedCols].filter((x) => x != column))
                                    setSelectedCols(newSet)
                                }}
                                order={idx}
                                key={idx}
                            />
                        )
                    }
                </ResizablePanelGroup>
                {data.map((v, i) =>
                    <div className={`${i % 2 == 0 ? "bg-gray-300 dark:bg-gray-950" : ""}`} key={i} onClick={() => onItemSelected(v)}>
                        <TableRow rowData={v} colWidths={colWidths} hiddenCols={hiddenCols}/>
                    </div>
                )}
            </div>
        </>
    )
}

function TableHeader(props: {
    column: keyof RichUser,
    columnName?: string,
    defaultSize: number,
    handle: boolean,
    onToggleDisabledControls?: () => void,
    disableHandle?: boolean,
    onResize: (key: keyof RichUser, s: number) => void,
    onHide: (column: keyof RichUser) => void,
    order: number
}) {

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
            </div>
        </ResizablePanel>
        {props.handle ? <ResizableHandle withHandle={!props.disableHandle} disabled={props.disableHandle} /> : ""}
    </>
}

function TableRow<T extends Partial<RichUser>>({ rowData, colWidths, hiddenCols }: { rowData: T, colWidths: { [K in keyof T]: number }, hiddenCols?: (keyof T)[] }) {

    return (
        <div className="flex h-full p-2 overflow-visible hover:border-white hover:border border-transparent">
            {
                Object.keys(rowData).map((key, index) => {
                    let innerhtml: string | JSX.Element = ""
                    switch (key) {
                        case 'email':
                            innerhtml = <div className="flex flex-row gap-2">
                                {rowData.email}
                                <span>
                                    {rowData.emailVerified != undefined && rowData.emailVerified != null ?
                                        <CheckCircle2Icon /> :
                                        <CircleXIcon />
                                    }
                                </span>
                            </div>
                            break;
                        case 'emailVerified':
                            innerhtml = "";
                            break;
                        case 'image':
                            innerhtml = <Avatar>
                                <AvatarImage src={rowData.image ?? undefined} />
                                <AvatarFallback>{rowData.name?.split(" ").map((v) => v[0]).reduce((p, c) => p + c, "")}</AvatarFallback>
                            </Avatar>
                            break;
                        case 'admin':
                            innerhtml = <span className={`${rowData.admin ? "text-green-600" : "text-red-600"}`}>{(rowData.admin ?? "false") + ""}</span>
                            break;
                        case 'linked_author':
                            innerhtml = <AuthorTagStd author={rowData.linked_author ?? { 'id': -1, 'preferred_name': "No Author Assigned", 'search_text': "", 'tag': { 'id': -1, 'category': 'Person', 'title': "No Author Assigned" } }} />
                            break;
                        default:
                            innerhtml = String(rowData[key as keyof T])
                            break;
                    }
                    if (hiddenCols?.includes(key as keyof T)) { return "" }
                    return <span style={{ width: colWidths[key as keyof T] + "%", paddingLeft: "0.5rem" }} key={index} className="flex items-center justify-center">{innerhtml}</span>
                })
            }
            <hr />
        </div>
    );
}

type FilterOptions = {
    sort?: "Ascending" | "Descending" | "None",
    contains?: RegExp,
    col: keyof RichUser
}


