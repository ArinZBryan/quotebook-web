"use client"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RichQuote, Author, Tag } from "@/app/api/db/types";
import { useEffect, useState } from "react";
import { AuthorTagAdmin, TagAdmin, TagStd } from "@/components/component/tag";
import Fuse from 'fuse.js'
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

export function SelectTag({ defaultData, formSubmit }: { defaultData: Tag | null, formSubmit: (formResult: Tag | null) => void }) {

    const [tagData, setTagData] = useState<Tag[]>([])
    const [sortedTags, setSortedTags] = useState<Tag[]>([])
    const [formData, setFormData] = useState<Tag | null>(defaultData)

    useEffect(() => {
        fetch(`/api/db/get/tags`)
            .then((res) => res.json())
            .then((data) => {
                setTagData(data)
            })
    }, [])

    return (
        <Dialog>
            <DialogTrigger>
                <TagStd 
                    tag={formData ?? defaultData ?? {'id': -1, 'category': 'Miscellaneous', 'title': '[SYSTEM] Unknown'} as Tag} 
                    overrideColor={((formData == undefined || formData == null) && (defaultData == undefined || defaultData == null)) ? "555555" : undefined} 
                />
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Select Tag</DialogTitle>
                    <DialogDescription>Select a tag to view statistics for</DialogDescription>
                </DialogHeader>
                <Label htmlFor="tag">Tag</Label>
                <Input type="search" id="tag" onInput={(e) => {
                    const fuse = new Fuse(tagData, { keys: ['title'], threshold: 0.2, ignoreLocation: true, isCaseSensitive: false });
                    setSortedTags(fuse.search(e.currentTarget.value).map((r) => r.item))
                }} />
                {
                    sortedTags.length > 1 || formData != null ?
                        <ScrollArea className="max-h-40 min-h-10 border-gray-800 border-2 rounded-md p-1">
                            {
                                formData == null ? sortedTags.map((a, i) =>
                                    <div className="m-1" key={i}>
                                        <TagAdmin tag={a} onAdd={(a) => setFormData(a)} onRemove={(a) => { setFormData(null) }} startState="pin" />
                                    </div>
                                ) :
                                    <div className="m-1">
                                        <TagAdmin tag={formData} onAdd={(a) => setFormData(a)} onRemove={(a) => { setFormData(null) }} startState="unpin" />
                                    </div>
                            }
                        </ScrollArea> : ""
                }
                <DialogClose>
                    <Button className="!bg-gray-800 !text-white hover:!bg-[#1f2937CC]" onClick={() => {
                        formSubmit(formData)
                    }}>Submit</Button>
                </DialogClose>
            </DialogContent>
        </Dialog>)
}