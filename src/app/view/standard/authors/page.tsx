import { Suspense } from "react"
import { Author } from "@/app/api/db/types"
import { TitleBar } from "@/components/component/titlebar"
import { SessionProvider } from "next-auth/react"
import { ShowOnLogin } from "@/components/component/showonlogin"
import { ScrollToTop } from "@/components/component/scroll-to-top"
import { Table as AuthorsTable } from "./table"
import { SkeletonTable } from "./skeleton-table"
import { Reload } from "@/components/component/reload"
import { api, triggerServerSideReload } from "@/api"
export default async function Page() {

    let data: Author[] = []

    data = await api.get.authors()

    return <div className="h-dvh">
        <SessionProvider>
            <TitleBar />
            <ShowOnLogin adminOnly={true}>
                <div className="w-full">
                    <div className="pl-2 pr-2">
                        <Suspense fallback={<SkeletonTable cols={4} />}>
                            <AuthorsTable data={data as Author[]} />
                            <ScrollToTop />
                            <Reload onClick={async () => {
                                "use server"
                                api.get.authors()
                                    .then((res) => { data = res; triggerServerSideReload("/view/standard/authors")})
                            }} />
                        </Suspense>
                    </div>
                </div>
            </ShowOnLogin>
        </SessionProvider>
    </div>
}