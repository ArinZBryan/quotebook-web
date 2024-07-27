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
import { api, triggerServerSideReload } from "@/api";
import { Author, RichUser } from "@/app/api/db/types";
import clearCachesByServerAction from "@/lib/revalidate"

type ArrayElement<ArrayType extends readonly unknown[]> =
    ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

type WhitelistUser = ArrayElement<Awaited<ReturnType<typeof api.get.whitelistedusers>>>

export function InteractivePage({ static_data }: {
    static_data: { 'users': WhitelistUser[], 'authors': Author[] }
}) {
    const users = static_data.users;
    const [selectedUser, setSelectedUser] = useState<WhitelistUser | null>(null)
    const [formData, setFormData] = useState<Omit<WhitelistUser, 'id'>>({
        'discord_id': "",
        'linked_author': null,
        'make_admin': false
    })

    const [showWarnings, setShowWarnings] = useState(false)

    return (<div className="flex flex-row flex-wrap lg:flex-nowrap h-full overflow-visible">
        <Card className="2xl:min-w-[786px] xl:min-w-[580px] lg:min-w-[400px] min-w-full">
            <CardHeader className="p-4">
                <CardTitle className="text-4xl">Update User Accounts</CardTitle>
                {selectedUser == null ? "" : <>
                    <h2 className="flex flex-row gap-4 items-center text-2xl pb-1">
                        {selectedUser.discord_id}
                        <AuthorTagStd author={selectedUser.linked_author ?? undefined} />
                    </h2>
                    <p>#{selectedUser.id}</p>
                    <p>Administrator: {(selectedUser.make_admin ?? "false") + ""}</p>
                    <form className="pl-2 w-full">
                        <Button variant="destructive" className="ml-2 mt-2" onClick={(e) => {
                            if (selectedUser == undefined) { e.preventDefault(); return; }
                            api.delete.whitelisteduser(selectedUser.id)
                            setSelectedUser(null)
                            e.preventDefault();
                            clearCachesByServerAction("/admin/whitelist")
                        }} type="submit">Remove User From Whitelist</Button>
                    </form>
                </>
                }
            </CardHeader>
            <CardContent>
                <form className="pl-4 pt-4 pr-4 w-full">
                    <Label htmlFor="name" className="p-2">Discord User ID {showWarnings ? <span className="text-red-500 ml-4">Users must contain a discord account ID</span> : ""}</Label>
                    <Input id="name" defaultValue={formData?.discord_id ?? undefined} onInput={(value) => setFormData({ ...formData!, 'discord_id': value.currentTarget.value })} />
                    <Label htmlFor="admin" className="p-2">Give Administrator</Label>
                    <Checkbox id="admin" className="mt-2" checked={formData.make_admin} onCheckedChange={(v) => setFormData({ ...formData, 'make_admin': v == 'indeterminate' ? false : v })} />
                    <Label htmlFor="author" className="flex flex-row justify-between p-2 pr-4">Linked Author</Label>
                    <AuthorSelector showLabel={false} onSelectedAuthorChanged={(a) => { setFormData({ ...formData, 'linked_author': a }) }} sourceAuthors={static_data.authors} />
                    <Button className="mt-2" onClick={(e) => {
                        if (formData.discord_id == "") { e.preventDefault(); setShowWarnings(true); return; }
                        api.add.whitelisteduser(
                            {
                                'discord_id': formData.discord_id,
                                'linked_author': formData.linked_author?.id,
                                'make_admin': formData.make_admin ? "true" : "false"
                            },
                        )
                        clearCachesByServerAction("/admin/whitelist")
                        e.preventDefault();
                    }} type="submit">Add User To Whitelist</Button>
                </form>
            </CardContent>
        </Card>
        <div className="flex-shrink w-full">
            <Table data={users} onItemSelected={(q) => {
                setSelectedUser(q); setFormData({
                    'discord_id': q.discord_id,
                    'make_admin': q.make_admin,
                    'linked_author': q.linked_author,
                })
            }} />
        </div>
    </div>)
}