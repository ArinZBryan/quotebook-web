import { TitleBar } from '@/components/component/titlebar'
import { SessionProvider } from 'next-auth/react'
import { auth } from '@/auth'
import { api } from '@/api'
import { InteractivePage } from './client';

export default async function page() {

    const session = await auth();

    const rich_quotes = await api.get.richquotes();
    const authors = await api.get.authors();
    const tags = await api.get.tags();

    return (<div>
        <SessionProvider>
            <TitleBar />
            <InteractivePage rich_quotes={rich_quotes} authors={authors} tags={tags} />
        </SessionProvider>
    </div>)
}