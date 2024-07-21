"use client"
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable"
import { Toaster } from "@/components/ui/toaster";
import { Author, UnverifedQuote } from "@/app/api/db/types";

import { useEffect, useRef, useState } from 'react'
import { useToast } from "@/components/ui/use-toast";
import { TagStd } from "@/components/component/tag";


export function Table({ data, onItemSelected }: { data: UnverifedQuote[], onItemSelected: (selectedQuote:UnverifedQuote)=>void }) {

    const std_width = 25
    const [colWidths, setColWidths] = useState<{ [T in keyof UnverifedQuote]: number }>({ 
        'id': std_width * 2/10, 
        'content': std_width * 26/10, 
        'message_id': std_width * 7/10,
        'message_date': std_width * 5/10, 
    });

    const { toast } = useToast()

    const elementRef = useRef<HTMLDivElement>(null);
    const [width, setWidth] = useState<number>(0);

    useEffect(() => {
        if (elementRef.current) {
            const elementWidth = elementRef.current.offsetWidth;
            setWidth(elementWidth);
        }
    }, [elementRef]);

    function setColWidthsW(key: keyof UnverifedQuote, s: number) {
        setColWidths(prevState => {
            const newObj = { ...prevState };
            newObj[key] = s;
            console.log("Resized " + key + " to: " + s );
            return newObj;
        });
    }

    return (
        <>
            <Toaster />
            <div className="w-full">
                <ResizablePanelGroup direction="horizontal">
                    <ResizablePanel onResize={(a) => { setColWidthsW("id", a) }} defaultSize={colWidths.id}>
                        <div className="flex h-full items-center justify-center p-6">
                            <div className="flex justify-center flex-grow">
                                <span className="font-semibold">ID</span>
                            </div>
                        </div>
                    </ResizablePanel>
                    <ResizableHandle withHandle={true} />
                    <ResizablePanel onResize={(a) => { setColWidthsW("content", a) }} defaultSize={colWidths.content}>
                        <div className="flex h-full items-center justify-center p-6">
                            <div className="flex justify-center flex-grow">
                                <span className="font-semibold">Content</span>
                            </div>
                        </div>
                    </ResizablePanel>
                    <ResizableHandle withHandle={true} />
                    <ResizablePanel onResize={(g) => { setColWidthsW("message_id", g) }} defaultSize={colWidths.message_id}>
                        <div className="flex h-full items-center justify-center p-6">
                            <div className="flex justify-center flex-grow">
                                <span className="font-semibold">Message ID</span>
                            </div>
                        </div>
                    </ResizablePanel>
                    <ResizableHandle withHandle={true} />
                    <ResizablePanel onResize={(a) => { setColWidthsW("message_date", a) }} defaultSize={colWidths.message_date}>
                        <div className="flex h-full items-center justify-center p-6">
                            <div className="flex justify-center flex-grow">
                                <span className="font-semibold">Message Date</span>
                            </div>
                        </div>
                    </ResizablePanel>
                </ResizablePanelGroup>
                {data.map((v, i) =>
                    <div className={`${i % 2 == 0 ? "bg-gray-300 dark:bg-gray-950" : ""}`} key={i} onClick={() => onItemSelected(v)}>
                        <TableRow rowData={v} colWidths={colWidths}/>
                    </div>
                )}
            </div>
        </>
    )
}
function TableRow<T extends Partial<UnverifedQuote>>({ rowData, colWidths }: { rowData: T, colWidths: { [K in keyof T]: number }}) {

    return (
        <div className="flex h-full p-2 overflow-visible hover:border-white hover:border border-transparent">
            {
                Object.keys(rowData).map((key, index) => {
                    let innerhtml : string | JSX.Element = "" 
                    switch (key) {
                        case 'message_date':
                            innerhtml = rowData.message_date!.substring(0,10);
                            break;
                        default:
                            innerhtml = String(rowData[key as keyof T])
                            break;
                    }

                    return <span style={{ width: colWidths[key as keyof T] + "%", paddingLeft: "0.5rem" }} key={index}>{ innerhtml }</span>
                })
            }
            <hr />
        </div>
    );
}
