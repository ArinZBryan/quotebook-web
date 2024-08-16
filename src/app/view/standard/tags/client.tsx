"use client"
import { useState, useEffect } from "react"
import { Tag } from "@/app/api/db/types"
import { ScrollToTop } from "@/components/component/scroll-to-top"
import { Table as TagsTable } from "./table"
import { Toaster } from "@/components/ui/toaster";
import { Reload } from "@/components/component/reload"

export function InteractivePage() {

    const [tags, setTags] = useState<Tag[]>([])

    useEffect(() => {
        fetch("/api/db/get/tags")
            .then((v) => v.json())
            .then(setTags)
    }, [])

    return <>
        <Toaster />
        <TagsTable 
            data={tags} 
            onTableInvalid={async () => {
                fetch("/api/db/get/tags")
                .then((v) => v.json())
                .then(setTags)
            }}
        />
        <ScrollToTop />
        <Reload onClick={async () => {
            fetch("/api/db/get/tags")
            .then((v) => v.json())
            .then(setTags)
        }} />
    </>
}