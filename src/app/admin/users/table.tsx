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


export function Table({ data, onItemSelected }: { data: RichUser[], onItemSelected: (selectedQuote : RichUser)=>void }) {

    const std_width = 100/6
    const [colWidths, setColWidths] = useState<{ [T in keyof RichUser]: number }>({ 
        'id': std_width, 
        'name' : std_width,
        'email' : std_width * 11/6,
        'emailVerified' : 0,
        'image' : std_width * 2/6 ,
        'admin' : std_width * 3/6,
        'linked_author' : std_width,
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

    function setColWidthsW(key: keyof RichUser, s: number) {
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
                    <ResizablePanel onResize={(a) => { setColWidthsW("name", a) }} defaultSize={colWidths.name}>
                        <div className="flex h-full items-center justify-center p-6">
                            <div className="flex justify-center flex-grow">
                                <span className="font-semibold">Username</span>
                            </div>
                        </div>
                    </ResizablePanel>
                    <ResizableHandle withHandle={true} />
                    <ResizablePanel onResize={(g) => { setColWidthsW("email", g) }} defaultSize={colWidths.email}>
                        <div className="flex h-full items-center justify-center p-6">
                            <div className="flex justify-center flex-grow">
                                <span className="font-semibold">Email</span>
                            </div>
                        </div>
                    </ResizablePanel>
                    <ResizableHandle withHandle={true} />
                    <ResizablePanel onResize={(a) => { setColWidthsW("image", a) }} defaultSize={colWidths.image}>
                        <div className="flex h-full items-center justify-center p-6">
                            <div className="flex justify-center flex-grow">
                                <span className="font-semibold">Profile Image</span>
                            </div>
                        </div>
                    </ResizablePanel>
                    <ResizableHandle withHandle={true} />
                    <ResizablePanel onResize={(a) => { setColWidthsW("admin", a) }} defaultSize={colWidths.admin}>
                        <div className="flex h-full items-center justify-center p-6">
                            <div className="flex justify-center flex-grow">
                                <span className="font-semibold">Administrator</span>
                            </div>
                        </div>
                    </ResizablePanel>
                    <ResizableHandle withHandle={true} />
                    <ResizablePanel onResize={(a) => { setColWidthsW("linked_author", a) }} defaultSize={colWidths.linked_author}>
                        <div className="flex h-full items-center justify-center p-6">
                            <div className="flex justify-center flex-grow">
                                <span className="font-semibold">Linked Author</span>
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
function TableRow<T extends Partial<RichUser>>({ rowData, colWidths }: { rowData: T, colWidths: { [K in keyof T]: number }}) {

    return (
        <div className="flex h-full p-2 overflow-visible hover:border-white hover:border border-transparent">
            {
                Object.keys(rowData).map((key, index) => {
                    let innerhtml : string | JSX.Element = "" 
                    switch (key) {
                        case 'email':
                            innerhtml = <div className="flex flex-row gap-2">
                                {rowData.email}
                                <span>
                                    { rowData.emailVerified != undefined && rowData.emailVerified != null ? 
                                        <CheckCircle2Icon/> :
                                        <CircleXIcon/>
                                    }
                                </span>
                            </div>
                            break;
                        case 'emailVerified' :
                            innerhtml = "";
                            break;
                        case 'image': 
                            innerhtml = <Avatar>
                            <AvatarImage src={rowData.image ?? undefined}/>
                            <AvatarFallback>{rowData.name?.split(" ").map((v) => v[0]).reduce((p, c) => p + c, "")}</AvatarFallback>
                        </Avatar>
                            break;
                        case 'admin':
                            innerhtml = <span className={`${rowData.admin ? "text-green-600" : "text-red-600"}`}>{(rowData.admin ?? "false") + ""}</span>
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
