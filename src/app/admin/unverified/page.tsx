import { TitleBar } from "@/components/component/titlebar"
import { SessionProvider } from "next-auth/react"

export default async function Page() {
    return <>
        <SessionProvider>
            <TitleBar/>
            
        </SessionProvider>
    </>
}