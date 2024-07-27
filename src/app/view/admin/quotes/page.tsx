import { Suspense, } from "react"
import { RichQuote } from "@/app/api/db/types"
import { TitleBar } from "@/components/component/titlebar"
import { SessionProvider } from "next-auth/react"
import { ShowOnLogin } from "@/components/component/showonlogin"
import { ScrollToTop } from "@/components/component/scroll-to-top"
import { Table as QuotesTable } from "./table"
import { SkeletonTable } from "./skeleton-table"
import { Reload } from "@/components/component/reload"
import { api, triggerServerSideReload } from "@/api"
import { InteractivePage } from "./client"
export default async function Page() {

    let data: RichQuote[] = []

    data = await api.get.richquotes()


    return <div className="h-dvh">
        <SessionProvider>
            <TitleBar />
            <ShowOnLogin adminOnly={true}>
                <div className="w-full">
                    <InteractivePage/>
                </div>
            </ShowOnLogin>

        </SessionProvider>
        <div className="flex items-center justify-center" style={{ height: "-webkit-fill-available" }}>
            <span className="text-gray-700">There's Nothing Here...</span>
        </div>

    </div>
}