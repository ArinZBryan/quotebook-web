"use client"
import { useState, useEffect } from "react"
import { RichQuote } from "@/app/api/db/types"
import { ScrollToTop } from "@/components/component/scroll-to-top"
import { Table as QuotesTable } from "./table"
import { Toaster } from "@/components/ui/toaster";
import { Reload } from "@/components/component/reload"

export function InteractivePage() {

    const [quotes, SetQuotes] = useState<RichQuote[]>([])

    useEffect(() => {
        fetch("/api/db/get/all")
            .then((v) => v.json())
            .then(SetQuotes)
    }, [])

    return <>
        <Toaster />
        <QuotesTable 
            data={quotes} 
            onTableInvalid={async () => {
                fetch("/api/db/get/all")
                .then((v) => v.json())
                .then(SetQuotes)
            }}
        />
        <ScrollToTop />
        <Reload onClick={async () => {
            fetch("/api/db/get/all")
            .then((v) => v.json())
            .then(SetQuotes)
        }} />
    </>
}