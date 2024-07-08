"use client"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RichQuote, Author, Tag } from "@/app/api/db/types";
import { useEffect, useState } from "react";
import { AuthorTagAdmin, AuthorTagStd, TagAdmin, TagStd } from "@/components/component/tag";
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

export function SelectAuthor({ defaultData, formSubmit }: { defaultData: Author | null, formSubmit: (formResult: Author | null) => void }) {

    const [authorData, setAuthorData] = useState<Author[]>([])
    const [sortedAuthors, setSortedAuthors] = useState<Author[]>([])
    const [formData, setFormData] = useState<Author | null>(defaultData)

    useEffect(() => {
        fetch(`/api/db/get/authors`)
            .then((res) => res.json())
            .then((data) => {
                setAuthorData(data)
            })
    }, [])

    return (
        <Dialog>
            <DialogTrigger>
                <AuthorTagStd 
                    author={formData ?? defaultData ?? undefined } 
                />
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Select Author</DialogTitle>
                    <DialogDescription>Select an author to view statistics on</DialogDescription>
                </DialogHeader>
                <Label htmlFor="author">Author</Label>
                <Input type="search" id="author" onInput={(e) => {
                    const fuse = new Fuse(authorData, { keys: ['preferred_name', 'search_text'], threshold: 0.2, ignoreLocation: true, isCaseSensitive: false });
                    setSortedAuthors(fuse.search(e.currentTarget.value).map((r) => r.item))
                }} />
                {
                    sortedAuthors.length > 1 || formData != null ?
                        <ScrollArea className="max-h-40 min-h-10 border-gray-800 border-2 rounded-md p-1">
                            {
                                formData == null ? sortedAuthors.map((a, i) =>
                                    <div className="m-1" key={i}>
                                        <AuthorTagAdmin author={a} onAdd={(a) => setFormData(a)} onRemove={(a) => { setFormData(null) }} startState="pin" />
                                    </div>
                                ) :
                                    <div className="m-1">
                                        <AuthorTagAdmin author={formData} onAdd={(a) => setFormData(a)} onRemove={(a) => { setFormData(null) }} startState="unpin" />
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