"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuIndicator,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    NavigationMenuViewport,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import Image from "next/image"
import { useSession, signOut } from "next-auth/react"
import { BlocksIcon, LayoutDashboardIcon, LogOut, PieChartIcon, TableIcon, WrenchIcon } from "lucide-react"
import React from "react"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
export function TitleBar() {

    var hidePages = true;
    const { data: session } = useSession();
    if (session != null || session != undefined) {
        hidePages = false;
    }

    return (
        <div className="flex justify-between h-14 items-center px-4 border-b md:h-20 md:px-6">
            <Link className="flex items-center gap-2 font-semibold" href="/">
                <MessageCircleIcon className="h-5 w-5" />
                <span className="hidden sm:block">Quotebook</span>
            </Link>
            <div className="" />
            {!hidePages ?
                (<div className="flex flex-row overflow-visible pr-4 md:pr-0">
                    <div className="hidden md:pr-5 md:block">
                        <NavButtons userIsAdmin={session?.user.admin == "true" ? true : false} />
                    </div>
                    <div className="md:hidden">
                        <CondensedNavButtons userIsAdmin={session?.user.admin == "true" ? true : false} />
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Avatar className="ml-5 cursor-pointer hover:border-white border-transparent border-[3px] border-solid">
                                <AvatarImage src={session?.user.image ?? undefined}/>
                                <AvatarFallback>{session?.user.name?.split(" ").map((v) => v[0]).reduce((p, c) => p + c, "")}</AvatarFallback>
                            </Avatar>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="max-w-[13rem]">
                            <DropdownMenuLabel>Logged in as {session?.user?.name}</DropdownMenuLabel>
                            <DropdownMenuSeparator></DropdownMenuSeparator>
                            <DropdownMenuItem>
                                <Link href="/settings" className="w-full flex flex-row">
                                    <WrenchIcon className="mr-2 h-4 w-4" />Settings
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => { signOut({ callbackUrl: "/" }) }}>
                                <LogOut className="mr-2 h-4 w-4" />
                                <span>Log Out</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>)
                :
                (<Link href="/">Log In</Link>)
            }
        </div>
    )
}

function NavButtons({ userIsAdmin }: { userIsAdmin: boolean }) {
    return (<NavigationMenu>
        <NavigationMenuList>
            {!userIsAdmin ? null :
                <NavigationMenuItem>
                    <NavigationMenuTrigger>Admin Functions</NavigationMenuTrigger>
                    <NavigationMenuContent className="z-[20]">
                        <ul className="grid gap-3 p-6 w-72 lg:grid-rows-[.75fr_1fr]">
                            <ListItem href={"/admin/unverified"} title="Unverified Quotes">
                                Audit Unverified Quotes
                            </ListItem>
                            <ListItem href={"/admin/users"} title="Edit Users">
                                Edit Users
                            </ListItem>
                            <ListItem href={"/admin/whitelist"} title="Edit Whitelist">
                                Edit Whitelist For New Accounts
                            </ListItem>
                            <ListItem href={"/admin/delete"} title="Remove Tags / Authors">
                                Clean Up Unused Tags And Authors
                            </ListItem>
                        </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>
            }
            <NavigationMenuItem>
                <NavigationMenuTrigger>Table View</NavigationMenuTrigger>
                <NavigationMenuContent className="z-[20]">
                    <ul className="grid gap-3 p-6 w-72 lg:grid-rows-[.75fr_1fr]">
                        <ListItem href={userIsAdmin ? "/view/admin/authors" : "/view/standard/authors"} title="Authors">
                            {userIsAdmin ? "Edit and View" : "View"} All Authors
                        </ListItem>
                        <ListItem href={userIsAdmin ? "/view/admin/tags" : "/view/standard/tags"} title="Tags">
                            {userIsAdmin ? "Edit and View" : "View"} All Tags
                        </ListItem>
                        <ListItem href={userIsAdmin ? "/view/admin/quotes" : "/view/standard/quotes"} title="Quotes">
                            {userIsAdmin ? "Edit and View" : "View"} All Quotes
                        </ListItem>
                    </ul>
                </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
                <NavigationMenuTrigger>Statistics</NavigationMenuTrigger>
                <NavigationMenuContent className="z-[20]">
                    <ul className="grid gap-3 p-6 w-72 lg:grid-rows-[.75fr_1fr]">
                        <ListItem href="/stats/authors" title="Authors">
                            View Statitics for Authors
                        </ListItem>
                        <ListItem href="/stats/tags" title="Tags">
                            View Statistics for Tags
                        </ListItem>
                    </ul>
                </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
                <Link href="/" legacyBehavior passHref>
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                        Dashboard
                    </NavigationMenuLink>
                </Link>
            </NavigationMenuItem>
        </NavigationMenuList>
    </NavigationMenu>
    )
}


const condensedNavButtonStyle = "group inline-flex h-10 w-max items-center justify-center rounded-md bg-white px-2 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-gray-100/50 data-[state=open]:bg-gray-100/50 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus:bg-gray-800 dark:focus:text-gray-50 dark:data-[active]:bg-gray-800/50 dark:data-[state=open]:bg-gray-800/50"
function CondensedNavButtons({ userIsAdmin }: { userIsAdmin: boolean }) {
    return (<NavigationMenu>
        <NavigationMenuList>
            {!userIsAdmin ? null :
                <NavigationMenuItem>
                    <NavigationMenuTrigger className="px-2"><BlocksIcon className="w-4 sm:w-6"/></NavigationMenuTrigger>
                    <NavigationMenuContent className="z-[20]">
                        <ul className="grid gap-3 p-6 w-72 lg:grid-rows-[.75fr_1fr]">
                            <ListItem href={"/admin/unverified"} title="Unverified Quotes">
                                Audit Unverified Quotes
                            </ListItem>
                            <ListItem href={"/admin/users"} title="Edit Users">
                                Edit Users
                            </ListItem>
                            <ListItem href={"/admin/whitelist"} title="Edit Whitelist">
                                Edit Whitelist For New Accounts
                            </ListItem>
                            <ListItem href={"/admin/delete"} title="Remove Tags/Authors">
                                Remove Tags / Authors
                            </ListItem>
                        </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>
            }
            <NavigationMenuItem>
                <NavigationMenuTrigger className="px-2"><TableIcon className="w-4 sm:w-6"/></NavigationMenuTrigger>
                <NavigationMenuContent className="z-[20]">
                    <ul className="grid gap-3 p-6 w-72 lg:grid-rows-[.75fr_1fr]">
                        <ListItem href={userIsAdmin ? "/view/admin/authors" : "/view/standard/authors"} title="Authors">
                            {userIsAdmin ? "Edit and View" : "View"} All Authors
                        </ListItem>
                        <ListItem href={userIsAdmin ? "/view/admin/tags" : "/view/standard/tags"} title="Tags">
                            {userIsAdmin ? "Edit and View" : "View"} All Tags
                        </ListItem>
                        <ListItem href={userIsAdmin ? "/view/admin/quotes" : "/view/standard/quotes"} title="Quotes">
                            {userIsAdmin ? "Edit and View" : "View"} All Quotes
                        </ListItem>
                    </ul>
                </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
                <NavigationMenuTrigger className="px-2"><PieChartIcon className="w-4 sm:w-6"/></NavigationMenuTrigger>
                <NavigationMenuContent className="z-[20]">
                    <ul className="grid gap-3 p-6 w-72 lg:grid-rows-[.75fr_1fr]">
                        <ListItem href="/stats/authors" title="Authors">
                            View Statitics for Authors
                        </ListItem>
                        <ListItem href="/stats/tags" title="Tags">
                            View Statistics for Tags
                        </ListItem>
                    </ul>
                </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
                <Link href="/" legacyBehavior passHref>
                    <NavigationMenuLink className={condensedNavButtonStyle}>
                        <LayoutDashboardIcon className="w-4 sm:w-6"/>
                    </NavigationMenuLink>
                </Link>
            </NavigationMenuItem>
        </NavigationMenuList>
    </NavigationMenu>
    )
}


const ListItem = React.forwardRef<
    React.ElementRef<"a">,
    React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
    return (
        <li>
            <NavigationMenuLink asChild>
                <a
                    ref={ref}
                    className={
                        "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gradient-to-br dark:from-gray-900 dark:to-gray-950 from-gray-300 to-gray-200"
                    }
                    {...props}
                >
                    <div className="text-sm font-medium leading-none">{title}</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        {children}
                    </p>
                </a>
            </NavigationMenuLink>
        </li>
    )
})

function LayoutIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
            <line x1="3" x2="21" y1="9" y2="9" />
            <line x1="9" x2="9" y1="21" y2="9" />
        </svg>
    )
}


function MessageCircleIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z" />
        </svg>
    )
}


function SearchIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
        </svg>
    )
}


function UsersIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
    )
}
