import { Suspense } from "react"
import { Tag } from "@/app/api/db/types"
import { TitleBar } from "@/components/component/titlebar"
import { SessionProvider } from "next-auth/react"
import { ShowOnLogin } from "@/components/component/showonlogin"
import { ScrollToTop } from "@/components/component/scroll-to-top"
import { Table as TagsTable } from "./table"
import { SkeletonTable } from "./skeleton-table"
import { Reload } from "@/components/component/reload"
import { api, triggerServerSideReload } from "@/api"
export default async function Page() {

    let data: Tag[] = []

    data = await api.get.tags()


    return <div className="h-dvh">
        <SessionProvider>
            <TitleBar />
            <ShowOnLogin adminOnly={true}>
                <div className="w-full">
                    <div className="pl-2 pr-2">
                        <Suspense fallback={<SkeletonTable cols={3} />}>
                            <TagsTable data={data as Tag[]} />
                            <ScrollToTop />
                            <Reload onClick={async () => {
                                "use server"
                                api.get.tags()
                                    .then((res) => { data = res; triggerServerSideReload("/view/standard/tags")})
                            }} />
                        </Suspense>
                    </div>
                </div>
            </ShowOnLogin>
        </SessionProvider>
        <div className="flex items-center justify-center" style={{ height: "-webkit-fill-available" }}>
            <span className="text-gray-700">There's Nothing Here...</span>
        </div>

    </div>
}