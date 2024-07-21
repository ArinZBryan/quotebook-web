import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RichQuote, Author, Tag } from "@/app/api/db/types";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { AuthorSelector, TagSelector } from "@/components/component/tag-selector";
import { api } from "@/api";


export function EditForm({ rowData }: { rowData: RichQuote }) {

    const [authorData, setAuthorData] = useState<Author[]>([])
    const [tagData, setTagData] = useState<Tag[]>([])

    const [formData, setFormData] = useState<{
        'id':number,
        'preamble': string,
        'quote': string,
        'date': string,
        'author': Author | null,
        'tags': Tag[]
    }>({
        'id':rowData.id,
        'preamble': rowData.preamble,
        'quote': rowData.quote,
        'date': rowData.date,
        'author': rowData.author,
        'tags': rowData.tags
    })

    useEffect(() => {
        fetch(`/api/db/get/authors`)
            .then((res) => res.json())
            .then((data) => {
                setAuthorData(data)
        })
        fetch(`/api/db/get/tags`)
            .then((res) => res.json())
            .then((data) => {
                setTagData(data)
        })
    }, [])

    const [ showWarnings, setShowWarnings ] = useState(false)

    return (<form>
        <Label htmlFor="preamble">Preamble</Label>
        <Textarea id="preamble" defaultValue={formData.preamble} onInput={(value) => setFormData({...formData, 'preamble': value.currentTarget.value})}></Textarea>
        <Label htmlFor="quote">Quote</Label>
        <Textarea id="quote" defaultValue={formData.quote} onInput={(value) => setFormData({...formData, 'quote': value.currentTarget.value})}></Textarea>
        <Label htmlFor="date">Date</Label>
        <Input type="number" id="date" placeholder={formData.date} onInput={(value) => setFormData({...formData, 'date': value.currentTarget.value})}/>
        <Label htmlFor="author">Author {showWarnings? <span className="text-red-500 ml-4">Quotes must have an author</span> : "" }</Label>
        <AuthorSelector showLabel={false} sourceAuthors={authorData} onSelectedAuthorChanged={(a) => {setFormData({...formData, 'author':a})}}/>
        <TagSelector showLabel={true} sourceTags={tagData} onSelectedTagsChanged={(t) => {setFormData({...formData, 'tags' : t})}} />
        <Button className="!bg-gray-800 !text-white hover:!bg-[#1f2937CC]" onClick={(e) => {
            if (formData.author == null) { e.preventDefault(); setShowWarnings(true); return; }
            api.modify.quote({...formData, 'author': formData.author!});
        }}
        >Submit</Button>
        
    </form>)
}