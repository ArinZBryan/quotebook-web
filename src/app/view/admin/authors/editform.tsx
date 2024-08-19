import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Author, Tag } from "@/app/api/db/types";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
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
import { TagSelectorSingle } from "@/components/component/tag-selector";



export function EditForm({ rowData }: { rowData: Author }) {

    const [tagData, setTagData] = useState<Tag[]>([])
    const [sortedTags, setSortedTags] = useState<Tag[]>([])

    const [formData, setFormData] = useState<{
        'id': number,
        'preferred_name': string,
        'search_text': string[],
        'tag': Tag | null
    }>({
        'id': rowData.id,
        'preferred_name': rowData.preferred_name,
        'search_text': rowData.search_text.split(","),
        'tag': rowData.tag
    })

    const [showWarnings, setShowWarnings] = useState(false)

    const [deleteResult, setDeleteResult] = useState<{ successful: boolean, reason: string } | null>(null)

    useEffect(() => {
        fetch(`/api/db/get/tags`)
            .then((res) => res.json())
            .then((data: Tag[]) => {
                setTagData(data.filter((v) => v.category == "Person"))
            })
    }, [])

    return (<>
        <Label htmlFor="preferred_name">Preferred Name</Label>
        <Input id="preferred_name" defaultValue={rowData.preferred_name} />
        <Label htmlFor="tag">Author Tag{showWarnings ? <span className="text-red-500 ml-4">Tag is REQUIRED</span> : ""}</Label>
        <TagSelectorSingle 
            showLabel={false} 
            sourceTags={tagData} 
            defaultTag={rowData.tag}
            onSelectedTagChanged={(t) => {setFormData({...formData, 'tag' : t})}} 
        />
        <Label htmlFor="tag">Search Text</Label>
        <Input type="text" id="tag" onKeyDown={(e) => {
            if (e.key == 'Enter') setFormData({ ...formData, 'search_text': formData.search_text.concat([e.currentTarget.value]) })
        }} />
        {
            <ScrollArea className="max-h-40 min-h-10 border-gray-800 border-2 rounded-md p-1">
                {
                    formData.search_text.map((v, i) => <div key={i} className="hover:line-through" onClick={() => { setFormData({ ...formData, 'search_text': formData.search_text.filter((val) => val != v) }) }}>{v}</div>)
                }
            </ScrollArea>
        }
        <Button type="submit" className="!bg-gray-800 !text-white hover:!bg-[#1f2937CC]" onClick={() => {
            if (formData.tag == null) { setShowWarnings(true); return; }
            fetch('/api/db/modify/author', {
                'method': 'POST',
                'body': JSON.stringify(formData),
                'headers': {
                    "Content-type": "application/json; charset=UTF-8"
                }
            })
                .then((res) => res.json())
                .then((data) => {
                    setTagData(data)
                })
        }}>Submit Changes</Button>
        <AlertDialog>
            <AlertDialogTrigger>
                <Button type="button" className="w-full" variant={'destructive'}>
                    Delete Author
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete this author.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => {
                        fetch('/api/db/delete/author', {
                            'method': 'POST',
                            'body': JSON.stringify({id: formData.id}),
                            'headers': {
                                "Content-type": "application/json; charset=UTF-8"
                            }
                        })
                        .then((res) => res.json())
                        .then((data) => {
                            setDeleteResult(data);
                        })
                    }}>Continue</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
        <AlertDialog open={deleteResult != null ? !deleteResult.successful : false} onOpenChange={() => setDeleteResult(null)}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Could Not Delete Author</AlertDialogTitle>
                    <AlertDialogDescription>
                        {deleteResult != null ? deleteResult.reason : ""}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Okay</AlertDialogCancel>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    </>)
}