
import { Login } from '@/components/component/login'
import { ShowOnLogin } from '@/components/component/showonlogin'
import { TitleBar } from '@/components/component/titlebar'
import { SessionProvider, useSession } from 'next-auth/react'


export default function Home() {

    return (<div>
        <SessionProvider>
            <TitleBar/>
            <ShowOnLogin fallback={
                <Login/>
            }>
                <>Logged In</>
                
            </ShowOnLogin>
        </SessionProvider>
    </div>)
}