"use client"
import { useSession } from "next-auth/react"

export function ShowOnLogin({children, adminOnly} : { children : React.ReactElement<any,any>, adminOnly?: boolean}) : JSX.Element
{
    const {data: session, status} = useSession();
    if (status === "authenticated") {
        if ((adminOnly == true && session.user.admin == "true") || (adminOnly == false || adminOnly == undefined)) {
            return children
        }
    }
    return (<></>)
}