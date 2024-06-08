"use client"
import { Login } from '@/components/component/login'
import { TitleBar } from '@/components/component/titlebar'
import { SessionProvider, useSession } from 'next-auth/react'

export default function Home() {

    return (<div>
        <SessionProvider>
            <TitleBar/>
            <Login/>
        </SessionProvider>
    </div>)
}