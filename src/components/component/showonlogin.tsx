import { auth } from "@/auth";

export async function ShowOnLogin({children, adminOnly, fallback} : { 
        children : React.ReactElement<any,any> | React.ReactElement<any,any>[], 
        adminOnly?: boolean, 
        fallback? : React.ReactElement<any,any> | React.ReactElement<any,any>[]
}) {
    const dev_nologin = process.env.DEV_NOLOGIN == "true"
    if (dev_nologin) {
        return children
    }
    const session = await auth()
    if (!session) return fallback ?? <></>
    if ((adminOnly == true && session.user.admin == "true") || (adminOnly == false || adminOnly == undefined)) {
        return children
    }
    return (fallback ?? <></>)
}