import { redirect } from 'next/navigation'
import { Login } from '@/components/component/login'
import { ShowOnLogin } from '@/components/component/showonlogin'
import { TitleBar } from '@/components/component/titlebar'
import { SessionProvider, useSession } from 'next-auth/react'
import { Dashboard } from './dashboard/dashboard'


export default function Home() {

    if (process.env.DEV_REDIRECT != "") {
        redirect(process.env.DEV_REDIRECT!)
    }

    return (<div>
        <SessionProvider>
            <TitleBar />
            <ShowOnLogin fallback={
                <Login />
            }>
                <Dashboard/>
            </ShowOnLogin>
        </SessionProvider>
    </div>)
}

