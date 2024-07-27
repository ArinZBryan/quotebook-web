import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import { Button } from "@/components/ui/button";
import { RichQuote, Author, Tag } from "@/app/api/db/types";
import { AuthorSelector, TagSelector } from "@/components/component/tag-selector";
import { api } from "@/api";
import { revalidatePath } from "next/cache";

export function EditForm({ rowData }: { rowData: RichQuote }) {

    const [authorData, setAuthorData] = useState<Author[]>([])
    const [tagData, setTagData] = useState<Tag[]>([])

    const [formData, setFormData] = useState<{
        'id': number,
        'preamble': string,
        'quote': string,
        'date': string,
        'author': Author | null,
        'tags': Tag[]
    }>({
        'id': rowData.id,
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

    const [showWarnings, setShowWarnings] = useState(false)

    return (<form>
        <Label htmlFor="preamble">Preamble</Label>
        <Textarea id="preamble" defaultValue={formData.preamble} onInput={(value) => setFormData({ ...formData, 'preamble': value.currentTarget.value })}></Textarea>
        <Label htmlFor="quote">Quote</Label>
        <Textarea id="quote" defaultValue={formData.quote} onInput={(value) => setFormData({ ...formData, 'quote': value.currentTarget.value })}></Textarea>
        <Label htmlFor="date">Date</Label>
        <Input type="number" id="date" placeholder={formData.date} onInput={(value) => setFormData({ ...formData, 'date': value.currentTarget.value })} />
        <Label htmlFor="author">Author {showWarnings ? <span className="text-red-500 ml-4">Quotes must have an author</span> : ""}</Label>
        <AuthorSelector
            showLabel={false}
            sourceAuthors={authorData}
            defaultAuthor={rowData.author}
            onSelectedAuthorAdded={(a) => { setFormData({ ...formData, 'author': a, 'tags': formData.tags.concat([a.tag]) }) }}
            onSelectedAuthorRemoved={(a) => { setFormData({ ...formData, 'author': null, 'tags': formData.tags.filter(t => t.id != a.tag.id) }) }}
        />
        <TagSelector
            showLabel={true}
            sourceTags={tagData}
            includeAuthor={formData.author ?? undefined}
            onSelectedTagsChanged={(t) => { setFormData({ ...formData, 'tags': t }); console.log(t) }}
            defaultTags={rowData.tags}
        />
        <Button className="!bg-gray-800 !text-white hover:!bg-[#1f2937CC] w-full mt-4" onClick={async (e) => {
            if (formData.author == null) { e.preventDefault(); setShowWarnings(true); return; }
            console.log(formData)
            await api.modify.quote({ ...formData, 'author': formData.author! });
            revalidatePath("/view/admin/quotes")
        }}
        >Submit</Button>
        <AlertDialog>
            <AlertDialogTrigger asChild>
            <Button variant={'destructive'} className="w-full mt-4">
                Delete Quote
            </Button>    
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently and irrecoverably delete this quote.
                        The only way back will be to make the quote anew <a href={"/admin/unverified"}>here</a>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction asChild>
                        <form onSubmit={(e) => {
                            e.preventDefault()
                            api.delete.quote({'id' : formData.id})
                        }} className="!p-0">
                            <Button variant={'destructive'} type="submit" className="w-full h-full">Continue</Button>
                        </form>
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>

    </form>)
}