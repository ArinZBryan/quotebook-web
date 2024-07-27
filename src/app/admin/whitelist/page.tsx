import { TitleBar } from "@/components/component/titlebar"
import { SessionProvider } from "next-auth/react"
import { InteractivePage } from "./client"
import { api } from "@/api"
import { ShowOnLogin } from "@/components/component/showonlogin"

export default async function Page() {
    return <>
        <SessionProvider>
            <TitleBar/>
            <ShowOnLogin adminOnly={true}>
                <InteractivePage 
                    static_data={{'users' : await api.get.whitelistedusers(), 'authors' : await api.get.authors()}}
                />
            </ShowOnLogin>
        </SessionProvider>
    </>
}