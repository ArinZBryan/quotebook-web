"use client"
import { Author } from "@/app/api/db/types";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { AuthorSelector } from "@/components/component/tag-selector";


export function EditForm({ defaultData, formSubmit }: { defaultData : Author | null, formSubmit: (formResult : Author | null) => void }) {

    const [authorData, setAuthorData] = useState<Author[]>([])

    const [formData, setFormData] = useState<Author | null>(defaultData)

    useEffect(() => {
        fetch(`/api/db/get/authors`)
            .then((res) => res.json())
            .then((data) => {
                setAuthorData(data)
        })
    }, [])

    return (<>
        <AuthorSelector showLabel={true} sourceAuthors={authorData} onSelectedAuthorChanged={(a) => {setFormData(a)}} />
        <Button className="!bg-gray-800 !text-white hover:!bg-[#1f2937CC]" onClick={() => {
            formSubmit(formData)
        }}>Submit</Button>
        
    </>)
}