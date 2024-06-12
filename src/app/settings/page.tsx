import { TitleBar } from "@/components/component/titlebar";
import { SessionProvider } from "next-auth/react";
import { SettingsContainer } from "./settings_container";

export default function page() {
    return <div>
        <SessionProvider>
            <TitleBar/>
            <div className="p-5">
                <h1 className="text-4xl pb-5">Settings</h1>
                <SettingsContainer/>
            </div>
        </SessionProvider>
    </div>
}
