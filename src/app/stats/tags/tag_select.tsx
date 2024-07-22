"use client"
import { Tag } from "@/app/api/db/types";
import { useState } from "react";
import { TagStd } from "@/components/component/tag";
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
import { TagSelectorSingle } from "@/components/component/tag-selector";

export function SelectTag({ defaultData, formSubmit, tags }: { defaultData: Tag | null, formSubmit: (formResult: Tag | null) => void, tags: Tag[] }) {

    const [formData, setFormData] = useState<Tag | null>(defaultData)

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
                <TagSelectorSingle showLabel={true} sourceTags={tags} onSelectedTagChanged={(t) => {setFormData(t)}} />
                <DialogClose>
                    <Button className="!bg-gray-800 !text-white hover:!bg-[#1f2937CC]" onClick={() => {
                        formSubmit(formData)
                    }}>Submit</Button>
                </DialogClose>
            </DialogContent>
        </Dialog>)
}