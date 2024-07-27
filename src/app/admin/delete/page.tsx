import { TitleBar } from "@/components/component/titlebar"
import { SessionProvider } from "next-auth/react"
import { api } from "@/api"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Toaster } from "@/components/ui/sonner"
import { Authors, Tags } from "./client"

export default async function Page() {

    const tags = await api.get.tags()
    const authors = await api.get.authors()

    return <>
        <SessionProvider>
            <TitleBar />
            <Tabs className="p-2 pt-3">
                <TabsList>
                    <TabsTrigger value="tags">Tags</TabsTrigger>
                    <TabsTrigger value="authors">Authors</TabsTrigger>
                </TabsList>
                <TabsContent value="tags">
                    <Tags static_data={{tags:tags}}/>
                </TabsContent>
                <TabsContent value="authors">
                    <Authors static_data={{authors:authors,tags:tags}} />
                </TabsContent>
            </Tabs>
        </SessionProvider>
        <Toaster />
    </>
}