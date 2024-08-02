"use client"
import { useState, useEffect } from "react"
import { RichQuote } from "@/app/api/db/types"
import { ScrollToTop } from "@/components/component/scroll-to-top"
import { Table as QuotesTable } from "./table"
import { SkeletonTable } from "./skeleton-table"
import { Reload } from "@/components/component/reload"

export function InteractivePage(env_vars : { server_id: string, channel_id: string }) {

    const [quotes, SetQuotes] = useState<RichQuote[]>([])

    useEffect(() => {
        fetch("/api/db/get/all")
            .then((v) => v.json())
            .then(SetQuotes)
    }, [])

    return <>
        <QuotesTable 
            data={quotes} 
            onTableInvalid={async () => {
                fetch("/api/db/get/all")
                .then((v) => v.json())
                .then(SetQuotes)
            }}
            env_vars={env_vars}
        />
        <ScrollToTop />
        <Reload onClick={async () => {
            fetch("/api/db/get/all")
            .then((v) => v.json())
            .then(SetQuotes)
        }} />
    </>
}