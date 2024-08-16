import { TitleBar } from "@/components/component/titlebar"
import { SessionProvider } from "next-auth/react"
import { ShowOnLogin } from "@/components/component/showonlogin"
import { InteractivePage } from "./client"

export default async function Page() {
    return <div className="h-dvh">
        <SessionProvider>
            <TitleBar />
            <ShowOnLogin adminOnly={true}>
                <div className="w-full">
                    <InteractivePage/>
                </div>
            </ShowOnLogin>
        </SessionProvider>
    </div>
}