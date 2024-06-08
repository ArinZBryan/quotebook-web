"use client"
import { Suspense, useEffect, useState } from "react"
import { Author, RichQuote, Tag } from "@/pages/api/db/raw/types"
import { TitleBar } from "@/components/component/titlebar"
import { SessionProvider } from "next-auth/react"
import { ShowOnLogin } from "@/components/component/showonlogin"
import { ScrollToTop } from "@/components/component/scroll-to-top"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table as AuthorsTable } from "./authors/table"
import { Table as TagsTable } from "./tags/table"
import { Table as QuotesTable } from "./quotes/table"
import { SkeletonTable } from "./skeleton-table"
import { Reload } from "@/components/component/reload"
import { useRouter } from 'next/navigation'
export default function Page() {

    const [data, setData] = useState<Author[] | Tag[] | RichQuote[]>([])
    const [isLoading, setLoading] = useState(true)

    const router = useRouter()

    return <div className="h-dvh">
        <SessionProvider>
            <TitleBar />
            <ShowOnLogin>
                <Tabs defaultValue="quotes" className="flex flex-col w-[full] items-center overflow-hidden" onValueChange={(tab) => {
                    setLoading(true)
                    fetch(`/api/db/raw/${tab}`)
                        .then((res) => {
                            if (res.status >= 400) { router.push(`/unsuccessful?status=${res.status}`) }
                            return res.json()
                        })
                        .then((data) => {
                            setData(data)
                            setLoading(false)
                        })
                }}>
                    <TabsList className="w-fit">
                        <TabsTrigger value="all">Quotes</TabsTrigger>
                        <TabsTrigger value="authors">Authors</TabsTrigger>
                        <TabsTrigger value="tags">Tags</TabsTrigger>
                    </TabsList>
                    <TabsContent value="all" className="w-full">
                        <div className="">
                            <Suspense fallback={<SkeletonTable cols={8} />}>
                                {
                                    !isLoading ? <QuotesTable data={data as RichQuote[]} onTableInvalid={() => {
                                        setLoading(true)
                                        fetch('/api/db/raw/all')
                                            .then((res) => {
                                                if (res.status >= 400) { router.push(`/unsuccessful?status=${res.status}`) }
                                                return res.json()
                                            })
                                            .then((data) => {
                                                setData(data)
                                                setLoading(false)
                                            })
                                    }} /> : <SkeletonTable cols={8} />
                                }
                                <ScrollToTop />
                                <Reload onClick={() => {
                                    setLoading(true)
                                    fetch('/api/db/raw/all')
                                        .then((res) => {
                                            if (res.status >= 400) { router.push(`/unsuccessful?status=${res.status}`) }
                                            return res.json()
                                        })
                                        .then((data) => {
                                            setData(data)
                                            setLoading(false)
                                        })
                                }} />
                            </Suspense>
                        </div>
                    </TabsContent>
                    <TabsContent value="authors" className="w-full">
                        <div className="pl-2 pr-2">
                            <Suspense fallback={<SkeletonTable cols={4} />}>
                                {
                                    !isLoading ? <AuthorsTable data={data as Author[]} /> : <SkeletonTable cols={4} />
                                }
                                <ScrollToTop />
                                <Reload onClick={() => {
                                    setLoading(true)
                                    fetch('/api/db/raw/authors')
                                        .then((res) => {
                                            if (res.status >= 400) { router.push(`/unsuccessful?status=${res.status}`) }
                                            return res.json()
                                        })
                                        .then((data) => {
                                            setData(data)
                                            setLoading(false)
                                        })
                                }} />
                            </Suspense>
                        </div>
                    </TabsContent>
                    <TabsContent value="tags" className="w-full">
                        <div className="pl-2 pr-2">
                            <Suspense fallback={<SkeletonTable cols={3} />}>
                                {!isLoading ? <TagsTable data={data as Tag[]} /> : <SkeletonTable cols={3} />}
                                <ScrollToTop />
                                <Reload onClick={() => {
                                    setLoading(true)
                                    fetch('/api/db/raw/tags')
                                        .then((res) => {
                                            if (res.status >= 400) { router.push(`/unsuccessful?status=${res.status}`) }
                                            return res.json()
                                        })
                                        .then((data) => {
                                            setData(data)
                                            setLoading(false)
                                        })
                                }} />
                            </Suspense>
                        </div>
                    </TabsContent>
                </Tabs>
            </ShowOnLogin>
        </SessionProvider>
        <div className="flex items-center justify-center" style={{ height: "-webkit-fill-available" }}>
            <span className="text-gray-700">There's Nothing Here...</span>
        </div>

    </div>
}