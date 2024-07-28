"use client"
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { AuthorSelector } from "@/components/component/tag-selector";
import { AuthorTagStd } from "@/components/component/tag";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckCircle2Icon, CircleXIcon } from "lucide-react";
import { Table } from "./table";
import { api } from "@/api";
import { Author, RichUser } from "@/app/api/db/types";
import clearCachesByServerAction from "@/lib/revalidate";



export function InteractivePage({ static_data }: {
    static_data: { 'users': RichUser[], 'authors': Author[] }
}) {
    const users = static_data.users;
    const [selectedUser, setSelectedUser] = useState<RichUser | null>(null)
    const [formData, setFormData] = useState<Omit<RichUser, 'id' | 'emailVerified' | 'image'>>({
        'name': null,
        'email': "",
        'admin': false,
        'linked_author': null
    })

    const [showWarnings, setShowWarnings] = useState(false)

    return (<div className="flex flex-row flex-wrap lg:flex-nowrap h-full overflow-visible">
        <Card className="2xl:min-w-[786px] xl:min-w-[580px] lg:min-w-[400px] min-w-full">
            <CardHeader className="p-4">
                <CardTitle className="text-4xl">Update User Accounts</CardTitle>
                {selectedUser == null ? "" : <>
                    <h2 className="flex flex-row gap-4 items-center text-2xl pb-1">
                        <Avatar className="h-16 w-16">
                            <AvatarImage src={selectedUser.image ?? undefined} />
                            <AvatarFallback>{selectedUser.name?.split(" ").map((v) => v[0]).reduce((p, c) => p + c, "")}</AvatarFallback>
                        </Avatar>
                        {selectedUser.name}
                        <AuthorTagStd author={selectedUser.linked_author ?? undefined} />
                    </h2>
                    <p>#{selectedUser.id}</p>
                    <p className="flex flex-row gap-2">Email: {selectedUser.email}
                        <span>
                            {selectedUser.emailVerified != undefined && selectedUser.emailVerified != null ?
                                <CheckCircle2Icon /> : <CircleXIcon />
                            }
                        </span>
                    </p>
                    <p>Administrator: {(selectedUser.admin ?? "false") + ""}</p>
                    <form onSubmit={(e) => {
                        e.preventDefault()
                        api.delete.user({'id': selectedUser.id})
                        clearCachesByServerAction("/admin/users")
                    }}>
                        <Button variant={'destructive'}>Delete This User</Button>
                    </form>
                </>
                }
            </CardHeader>
            <CardContent>
                <form className="p-4 w-full">
                    <Label htmlFor="name" className="p-2">Username</Label>
                    <Input id="name" defaultValue={formData?.name ?? undefined} onInput={(value) => setFormData({ ...formData!, 'name': value.currentTarget.value })} />
                    <Label htmlFor="email" className="flex flex-row justify-between p-2 pr-4">Email {showWarnings ? <span className="text-red-500 ml-4">Users must have a valid email</span> : ""}</Label>
                    <Input id="email" defaultValue={formData?.email ?? undefined} onInput={(value) => setFormData({ ...formData!, 'email': value.currentTarget.value })} />
                    <Label htmlFor="admin" className="p-2">Administrator</Label>
                    <Checkbox id="admin" className="mt-2" checked={formData.admin} onCheckedChange={(v) => setFormData({ ...formData, 'admin': v == 'indeterminate' ? false : v })} />
                    <Label htmlFor="author" className="flex flex-row justify-between p-2 pr-4">Linked Author</Label>
                    <AuthorSelector showLabel={false} onSelectedAuthorChanged={(a) => { setFormData({ ...formData, 'linked_author': a }) }} sourceAuthors={static_data.authors} />

                    <Button className="!bg-gray-800 !text-white hover:!bg-[#1f2937CC] mt-2" onClick={(e) => {
                        e.preventDefault()
                        const re = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
                        if (formData.name == null || !re.test(formData.email)) { setShowWarnings(true); return; }
                        if (selectedUser == undefined) { return; }
                        api.modify.user({ ...formData, 'id': selectedUser.id })
                        clearCachesByServerAction("/admin/users")
                    }} type="submit">Submit</Button>
                </form>
            </CardContent>
        </Card>
        <div className="flex-shrink w-full">
            <Table data={users} onItemSelected={(q) => {
                setSelectedUser(q); setFormData({
                    'admin': q.admin,
                    'email': q.email,
                    'linked_author': q.linked_author,
                    'name': q.name
                })
            }} />
        </div>
    </div>)
}