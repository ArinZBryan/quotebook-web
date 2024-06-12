"use client"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RichQuote, Author, Tag } from "@/app/api/db/types";
import { useEffect, useState } from "react";
import { AuthorTagAdmin, TagStd } from "@/components/component/tag";
import Fuse from 'fuse.js'
import { Button } from "@/components/ui/button";


export function EditForm({ defaultData, formSubmit }: { defaultData : Author | null, formSubmit: (formResult : Author | null) => void }) {

    const [authorData, setAuthorData] = useState<Author[]>([])
    const [sortedAuthor, setSortedAuthor] = useState<Author[]>([])

    const [formData, setFormData] = useState<Author | null>(defaultData)

    useEffect(() => {
        fetch(`/api/db/raw/authors`)
            .then((res) => res.json())
            .then((data) => {
                setAuthorData(data)
        })
    }, [])

    return (<>
        <Label htmlFor="author">Author</Label>
        <Input type="search" id="author" onInput={(e) => {
            const fuse = new Fuse(authorData, {keys:['preferred_name', 'search_text'], threshold:0.1, ignoreLocation:true, isCaseSensitive:false});
            setSortedAuthor(fuse.search(e.currentTarget.value).map((r) => r.item))
        }}/>
        {
            sortedAuthor.length > 1 || formData != null? 
            <ScrollArea className="max-h-40 min-h-10 border-gray-800 border-2 rounded-md p-1">
                {
                    formData == null ? sortedAuthor.map((a, i) => 
                        <div className="m-1" key={i}>
                            <AuthorTagAdmin author={a} onAdd={(a) => setFormData(a)} onRemove={(a) => {setFormData(null)}} startState="pin"/>
                        </div>
                    ) : 
                        <div className="m-1">
                            <AuthorTagAdmin author={formData} onAdd={(a) => setFormData(a)} onRemove={(a) => {setFormData(null)}} startState="unpin"/>
                        </div>
                }
            </ScrollArea> : ""  
        }
        <Button className="!bg-gray-800 !text-white hover:!bg-[#1f2937CC]" onClick={() => {
            formSubmit(formData)
        }}>Submit</Button>
        
    </>)
}