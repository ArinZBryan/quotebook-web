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
import { api } from "@/api";

type ArrayElement<ArrayType extends readonly unknown[]> = 
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

type WhitelistUser = ArrayElement<Awaited<ReturnType<typeof api.get.whitelistedusers>>>



export function Table({ data, onItemSelected }: { data: WhitelistUser[], onItemSelected: (selectedQuote : WhitelistUser) => void }) {

    const std_width = 100/4
    const [colWidths, setColWidths] = useState<{ [T in keyof WhitelistUser]: number }>({ 
        'id': std_width, 
        'discord_id' : std_width,
        'linked_author' : std_width,
        'make_admin' : std_width
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

    function setColWidthsW(key: keyof WhitelistUser, s: number) {
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
                    <ResizablePanel onResize={(a) => { setColWidthsW("discord_id", a) }} defaultSize={colWidths.discord_id}>
                        <div className="flex h-full items-center justify-center p-6">
                            <div className="flex justify-center flex-grow">
                                <span className="font-semibold">Discord User ID</span>
                            </div>
                        </div>
                    </ResizablePanel>
                    <ResizableHandle withHandle={true} />
                    <ResizablePanel onResize={(g) => { setColWidthsW("linked_author", g) }} defaultSize={colWidths.linked_author}>
                        <div className="flex h-full items-center justify-center p-6">
                            <div className="flex justify-center flex-grow">
                                <span className="font-semibold">Linked Author</span>
                            </div>
                        </div>
                    </ResizablePanel>
                    <ResizableHandle withHandle={true} />
                    <ResizablePanel onResize={(a) => { setColWidthsW("make_admin", a) }} defaultSize={colWidths.make_admin}>
                        <div className="flex h-full items-center justify-center p-6">
                            <div className="flex justify-center flex-grow">
                                <span className="font-semibold">Make Admin</span>
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
function TableRow<T extends Partial<WhitelistUser>>({ rowData, colWidths }: { rowData: T, colWidths: { [K in keyof T]: number }}) {

    return (
        <div className="flex h-full p-2 overflow-visible hover:border-white hover:border border-transparent">
            {
                Object.keys(rowData).map((key, index) => {
                    let innerhtml : string | JSX.Element = "" 
                    switch (key) {
                        case 'make_admin':
                            innerhtml = <span className={`${rowData.make_admin ? "text-green-600" : "text-red-600"}`}>{(rowData.make_admin ?? "false") + ""}</span>
                            break;
                        case 'linked_author':
                            innerhtml = <AuthorTagStd author={rowData.linked_author ?? {'id':-1,'preferred_name':"No Author Assigned",'search_text':"",'tag':{'id':-1,'category':'Person','title':"No Author Assigned"}}} />
                            break;
                        default:
                            innerhtml = String(rowData[key as keyof T])
                            break;
                    }

                    return <span style={{ width: colWidths[key as keyof T] + "%", paddingLeft: "0.5rem" }} key={index} className="flex items-center justify-center">{ innerhtml }</span>
                })
            }
            <hr />
        </div>
    );
}
