import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RichQuote, Author, Tag } from "@/app/api/db/types";
import { useEffect, useState } from "react";
import { TagAdmin, TagStd } from "@/components/component/tag";
import Fuse from 'fuse.js'
import { Button } from "@/components/ui/button";


export function EditForm({ rowData }: { rowData: RichQuote }) {

    const [authorData, setAuthorData] = useState<Author[]>([])
    const [sortedAuthor, setSortedAuthor] = useState<Author[]>([])
    const [tagData, setTagData] = useState<Tag[]>([])
    const [sortedTags, setSortedTags] = useState<Tag[]>([])

    const [formData, setFormData] = useState<{
        'id':number,
        'preamble': string,
        'quote': string,
        'date': string,
        'author': Tag | null,
        'tags': Tag[]
    }>({
        'id':rowData.id,
        'preamble': rowData.preamble,
        'quote': rowData.quote,
        'date': rowData.date,
        'author': rowData.author.tag,
        'tags': rowData.tags
    })

    useEffect(() => {
        fetch(`/api/db/raw/authors`)
            .then((res) => res.json())
            .then((data) => {
                setAuthorData(data)
        })
        fetch(`/api/db/raw/tags`)
            .then((res) => res.json())
            .then((data) => {
                setTagData(data)
        })
    }, [])

    const [ showWarnings, setShowWarnings ] = useState(false)

    return (<>
        <Label htmlFor="preamble">Preamble</Label>
        <Textarea id="preamble" defaultValue={formData.preamble} onInput={(value) => setFormData({...formData, 'preamble': value.currentTarget.value})}></Textarea>
        <Label htmlFor="quote">Quote</Label>
        <Textarea id="quote" defaultValue={formData.quote} onInput={(value) => setFormData({...formData, 'quote': value.currentTarget.value})}></Textarea>
        <Label htmlFor="date">Date</Label>
        <Input type="number" id="date" placeholder={formData.date} onInput={(value) => setFormData({...formData, 'date': value.currentTarget.value})}/>
        <Label htmlFor="author">Author {showWarnings? <span className="text-red-500 ml-4">Quotes must have an author</span> : "" }</Label>
        <Input type="search" id="author" onInput={(e) => {
            const fuse = new Fuse(authorData, {keys:['preferred_name', 'search_text'], threshold:0.1, ignoreLocation:true, isCaseSensitive:false});
            setSortedAuthor(fuse.search(e.currentTarget.value).map((r) => r.item))
        }}/>
        {
            sortedAuthor.length > 1 || formData.author != null? 
            <ScrollArea className="max-h-40 min-h-10 border-gray-800 border-2 rounded-md p-1">
                {
                    formData.author == null ? sortedAuthor.map((a, i) => 
                        <div className="m-1" key={i}>
                            <TagAdmin tag={a.tag} onAdd={(t) => setFormData({...formData, 'author': t, 'tags':formData.tags.concat([t])})} onRemove={(tag) => {setFormData({...formData, 'author': null, 'tags': formData.tags.toSpliced(formData.tags.indexOf(tag))})}} startState="pin"/>
                        </div>
                    ) : 
                        <div className="m-1">
                            <TagAdmin tag={formData.author} onAdd={(t) => setFormData({...formData, 'author': t,'tags':formData.tags.concat([t])})} onRemove={(tag) => {setFormData({...formData, 'author': null, 'tags': formData.tags.toSpliced(formData.tags.indexOf(tag))})}} startState="unpin"/>
                        </div>
                }
            </ScrollArea> : ""  
        }
        <Label htmlFor="tags">Tags</Label>
        <Input type="search" id="tags" onInput={(e) => {
            const fuse = new Fuse(tagData, {keys:['title'], threshold:0.1, ignoreLocation:true, isCaseSensitive:false});
            setSortedTags(fuse.search(e.currentTarget.value).map((r) => r.item))
        }}/>
        {
            sortedTags.length > 1 || formData.tags.length > 0 ? 
            <ScrollArea className="max-h-40 min-h-10 border-gray-800 border-2 rounded-md p-1">
                {
                    formData.author != null ? <div className="m-1"><TagStd tag={formData.author!}/></div> : ""
                }
                {
                    formData.tags
                        .toSpliced(formData.tags.indexOf(formData.author!))
                        .map((tag,i) =>  <div className="m-1" key={i}><TagAdmin tag={tag} key={i} onAdd={(t) => setFormData({...formData, 'tags': formData.tags.concat([tag])})} onRemove={() => setFormData({...formData, 'tags': formData.tags.toSpliced(formData.tags.indexOf(tag))})} startState="unpin"/></div>)
                }
                {
                    sortedTags.map((tag,i) =>  <div className="m-1" key={i}><TagAdmin tag={tag} key={i} onAdd={(t) => setFormData({...formData, 'tags': formData.tags.concat([tag])})} onRemove={() => setFormData({...formData, 'tags': formData.tags.toSpliced(formData.tags.indexOf(tag))})} startState="pin"/></div>)
                }
            </ScrollArea> : ""
        }
        <Button className="!bg-gray-800 !text-white hover:!bg-[#1f2937CC]" onClick={() => {
            if (formData.author == null) { setShowWarnings(true); return; }
            console.log(JSON.stringify(formData))
            fetch('/api/db/modify/quote',{
                'method': 'POST',
                'body' : JSON.stringify(formData),
                'headers': {
                    "Content-type": "application/json; charset=UTF-8"
                }
            })
            .then((res) => res.json())
            .then((data) => {
                setAuthorData(data)
        })
        }}>Submit</Button>
        
    </>)
}