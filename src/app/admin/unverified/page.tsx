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
                    env_vars={{'server_id' : process.env.DISCORD_SOURCE_SERVER!, 'channel_id' : process.env.DISCORD_SOURCE_CHANNEL! }}
                    static_data={{'tags' : await api.get.tags(), 'authors' : await api.get.authors(), 'quotes' : await api.get.unverifiedquotes()}}
                />
            </ShowOnLogin>
        </SessionProvider>
    </>
}