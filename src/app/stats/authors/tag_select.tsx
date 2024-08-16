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
import { AuthorSelector } from "@/components/component/tag-selector";

export function SelectAuthor({ defaultData, formSubmit, authors }: { defaultData: Author | null, formSubmit: (formResult: Author | null) => void, authors: Author[] }) {

    const [formData, setFormData] = useState<Author | null>(defaultData)

    return (
        <Dialog>
            <DialogTrigger>
                <AuthorTagStd 
                    author={formData ?? defaultData ?? {'id': -1, 'preferred_name': "[System] Author Missing", 'search_text': '', 'tag': {'id': -1, 'category': 'Person', 'title': "Tag Missing"}} as Author } 
                />
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Select Author</DialogTitle>
                    <DialogDescription>Select an author to view statistics on</DialogDescription>
                </DialogHeader>
                <AuthorSelector showLabel={true} sourceAuthors={authors} onSelectedAuthorChanged={(a) => setFormData(a)} />
                <DialogClose>
                    <Button className="!bg-gray-800 !text-white hover:!bg-[#1f2937CC]" onClick={() => {
                        formSubmit(formData)
                    }}>Submit</Button>
                </DialogClose>
            </DialogContent>
        </Dialog>)
}