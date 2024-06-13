import { auth } from "@/auth";

export async function ShowOnLogin({children, adminOnly, fallback} : { 
        children : React.ReactElement<any,any> | React.ReactElement<any,any>[], 
        adminOnly?: boolean, 
        fallback? : React.ReactElement<any,any> | React.ReactElement<any,any>[]
}) {
    const session = await auth()
    if (!session) return fallback ?? <></>
    if ((adminOnly == true && session.user.admin == "true") || (adminOnly == false || adminOnly == undefined)) {
        return children
    }
    return (fallback ?? <></>)
}