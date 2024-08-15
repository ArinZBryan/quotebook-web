import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tag } from "@/app/api/db/types";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
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


export function EditForm({ rowData }: { rowData: Tag }) {

    const [formData, setFormData] = useState<{
        'id': number,
        'title': string,
        'category': "Person" | "Topic" | "Miscellaneous",
    }>({
        'id': rowData.id,
        'title': rowData.title,
        'category': rowData.category
    })

    const [deleteResult, setDeleteResult] = useState<{ successful: boolean, reason: string } | null>(null)

    return (<>
        <Label htmlFor="title">Preamble</Label>
        <Input type="text" id="title" defaultValue={formData.title} onInput={(e) => setFormData({ ...formData, 'title': e.currentTarget.value })} />
        <Label htmlFor="category">Category</Label>
        <Select onValueChange={(v) => setFormData({ ...formData, 'category': v as "Person" | "Topic" | "Miscellaneous" })}>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={formData.category} />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="Person">Person</SelectItem>
                <SelectItem value="Topic">Topic</SelectItem>
                <SelectItem value="Miscellaneous">Miscellaneous</SelectItem>
            </SelectContent>
        </Select>
        <Button className="!bg-gray-800 !text-white hover:!bg-[#1f2937CC]" onClick={() => {
            console.log(JSON.stringify(formData))
            fetch('/api/db/modify/tag', {
                'method': 'POST',
                'body': JSON.stringify(formData),
                'headers': {
                    "Content-type": "application/json; charset=UTF-8"
                }
            })
        }}>Submit</Button>
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button className="!bg-gray-800 !text-white hover:!bg-[#1f2937CC] w-full">
                    Delete Tag
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete this tag.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={async () => {
                        fetch('/api/db/delete/tag', {
                            'method': 'POST',
                            'body': JSON.stringify({ id: formData.id }),
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
                    <AlertDialogTitle>Could Not Delete Tag</AlertDialogTitle>
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