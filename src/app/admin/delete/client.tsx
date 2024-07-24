"use client"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { AuthorTagStd, TagStd } from "@/components/component/tag"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Author, Tag } from "@/app/api/db/types"
import { SaveIcon, UserIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { TagSelectorSingle } from "@/components/component/tag-selector"
import { Label } from "@/components/ui/label"
import { api } from "@/api"

export function Tags({ static_data }: {
    static_data: {
        tags: Tag[]
    }
}) {
    const [selectedTag, setSelectedTag] = useState<Tag>({ 'category': "Miscellaneous", 'title': "Placeholder", 'id': -1 })
    const [modifiedTags, setModifedTags] = useState<{ type: "new" | "modify" | "delete", target: Tag }[]>([])

    return <div className="flex flex-col">
        <div className="flex flex-row ">
            <Card className="p-4 min-w-96 h-fit">
                <CardTitle>
                    Modify Tag
                </CardTitle>
                <CardContent className="pt-4 flex flex-col items-center">
                    <ToggleGroup type="single" onValueChange={(v: "Person" | "Topic" | "Miscellaneous") => {
                        setSelectedTag({ ...selectedTag, 'category': v });
                    }} defaultValue="Miscellaneous">
                        <ToggleGroupItem value="Person">
                            <strong className="text-xl">Person</strong>
                        </ToggleGroupItem>
                        <ToggleGroupItem value="Topic">
                            <strong className="text-xl">Topic</strong>
                        </ToggleGroupItem>
                        <ToggleGroupItem value="Miscellaneous">
                            <strong className="text-xl">Misc.</strong>
                        </ToggleGroupItem>
                    </ToggleGroup>
                    <Input placeholder={selectedTag.title} className="m-2" onChange={(e) => {
                        setSelectedTag({ ...selectedTag, 'title': e.currentTarget.value });
                    }} />
                    <TagStd tag={selectedTag} />
                    <div className="p-1 flex flex-row gap-2">
                        <Button variant={"secondary"} onClick={() => {
                            setModifedTags(modifiedTags.concat([{ 'type': 'new', 'target': selectedTag }]))
                        }}>New</Button>
                        <Button variant={"secondary"} onClick={() => {
                            setModifedTags(modifiedTags.concat([{ 'type': 'modify', 'target': selectedTag }]))
                        }}>Apply</Button>
                        <Button variant={"destructive"} onClick={() => {
                            setModifedTags(modifiedTags.concat([{ 'type': 'delete', 'target': selectedTag }]))
                        }}>Delete</Button>
                    </div>
                </CardContent>
            </Card>
            <ScrollArea className="h-[80vh]">
                <div className="flex flex-row flex-wrap">
                    {
                        static_data.tags.map((t, i) =>
                            <div className="m-2" onClick={() => { setSelectedTag(t) }}>
                                <TagStd tag={t} key={i} className="border-0 hover:border-white hover:border-[1px] " />
                            </div>)
                    }
                </div>
            </ScrollArea>
        </div>
        {modifiedTags.length <= 0 ? "" :
            <div className="fixed bottom-0 pr-4 pb-2">
                <Alert className="flex flex-row gap-2">
                    <SaveIcon className="min-w-16 min-h-16" />
                    <div className="flex flex-col translate-x-12 pt-1">
                        <AlertTitle className="text-2xl">Heads up!</AlertTitle>
                        <AlertDescription className="text-lg">
                            You have {modifiedTags.length} unsaved change(s)
                        </AlertDescription>
                    </div>
                    <form onSubmit={() => { 
                        modifiedTags.forEach((v) => {
                            if (v.type === "new") {
                                api.add.tag({
                                    'category' : v.target.category,
                                    'title' : v.target.title
                                })
                            } else if (v.type === "modify") {
                                api.modify.tag({
                                    'id' : v.target.id,
                                    'category' : v.target.category,
                                    'title' : v.target.title
                                })
                            } else if (v.type === "delete") {
                                api.delete.tag({
                                    'id' : v.target.id
                                })
                            }
                        })
                    }}>
                        <Button type="submit" className="translate-x-8 w-fit p-4 mt-4 mr-10">Save Changes</Button>
                        <Button type="button" variant="ghost" onClick={() => { setModifedTags([]) }}>Discard Changes</Button>
                    </form>
                </Alert>
            </div>
        }
    </div>
}

export function Authors({ static_data }: {
    static_data: {
        authors: Author[],
        tags: Tag[]
    }
}) {
    const [selectedAuthor, setSelectedAuthor] = useState<Author>({ 'id': -1, 'preferred_name': "Preferred Name", 'search_text': "", 'tag': { 'category': "Miscellaneous", 'title': "Tag Title", 'id': -1 } })
    const [modifiedAuthors, setModifedAuthors] = useState<{ type: "new" | "modify" | "delete", target: Author }[]>([])

    return <div className="flex flex-col">
        <div className="flex flex-row ">
            <Card className="p-4 min-w-96 h-fit">
                <CardTitle>
                    Modify Author
                </CardTitle>
                <CardContent className="pt-4 flex flex-col items-center">
                    <Input placeholder={selectedAuthor.preferred_name} className="m-2" onChange={(e) => {
                        setSelectedAuthor({ ...selectedAuthor, 'preferred_name': e.currentTarget.value });
                    }} />
                    <Label htmlFor="tag">Search Text</Label>
                    <Input className={"mt-2"} type="text" id="tag" onKeyDown={(e) => {
                        if (e.key == 'Enter') setSelectedAuthor({ ...selectedAuthor, 'search_text': selectedAuthor.search_text.concat(`, ${e.currentTarget.value}`) })
                    }} />
                    { selectedAuthor.search_text.split(",").length != 0 ?
                        <ScrollArea className="max-h-40 min-h-10 w-full border-gray-800 border-2 rounded-md p-1 mt-4">
                            {
                                selectedAuthor.search_text.split(",").map((v, i) => 
                                    <div key={i} className="hover:line-through" onClick={() => { 
                                        setSelectedAuthor({ ...selectedAuthor, 
                                            'search_text': selectedAuthor.search_text.split(",")
                                                                                    .splice(selectedAuthor.search_text.split(",").map((v) => v.trim()).indexOf(v))
                                                                                    .reduce((v, i) => `${v}, ${i}`, "")
                                        }) }}
                                    >
                                        {v}
                                    </div>
                                )
                            }
                        </ScrollArea> : ""
                    }
                    <TagSelectorSingle
                        showLabel={true}
                        sourceTags={static_data.tags}
                        onSelectedTagChanged={(t) => {
                            setSelectedAuthor({ ...selectedAuthor, tag: t ?? { 'category': "Miscellaneous", 'title': "Placeholder", 'id': -1 } })
                        }}
                    />
                    <div className="p-1 flex flex-row gap-2">
                        <Button variant={"secondary"} onClick={() => {
                            setModifedAuthors(modifiedAuthors.concat([{ 'type': 'new', 'target': selectedAuthor }]))
                        }}>New</Button>
                        <Button variant={"secondary"} onClick={() => {
                            setModifedAuthors(modifiedAuthors.concat([{ 'type': 'modify', 'target': selectedAuthor }]))
                        }}>Apply</Button>
                        <Button variant={"destructive"} onClick={() => {
                            setModifedAuthors(modifiedAuthors.concat([{ 'type': 'delete', 'target': selectedAuthor }]))
                        }}>Delete</Button>
                    </div>
                </CardContent>
            </Card>
            <ScrollArea className="h-[80vh]">
                <div className="flex flex-row flex-wrap">
                    {
                        static_data.authors.map((a, i) =>
                            <div className="m-2" onClick={() => { setSelectedAuthor(a) }}>
                                <AuthorTagStd author={a} key={i} className="border-0 hover:border-white hover:border-[1px] " />
                            </div>)
                    }
                </div>
            </ScrollArea>
        </div>
        {modifiedAuthors.length <= 0 ? "" :
            <div className="fixed bottom-0 pr-4 pb-2">
                <Alert className="flex flex-row gap-2">
                    <SaveIcon className="min-w-16 min-h-16" />
                    <div className="flex flex-col translate-x-12 pt-1">
                        <AlertTitle className="text-2xl">Heads up!</AlertTitle>
                        <AlertDescription className="text-lg">
                            You have {modifiedAuthors.length} unsaved change(s)
                        </AlertDescription>
                    </div>
                    <form onSubmit={() => {
                        modifiedAuthors.forEach((v) => {
                            if (v.type === "new") {
                                api.add.author({
                                    'preferred_name' : v.target.preferred_name,
                                    'search_text' : v.target.search_text,
                                    'tag' : v.target.tag
                                })
                            } else if (v.type === "modify") {
                                api.modify.author({
                                    'id' : v.target.id,
                                    'preferred_name' : v.target.preferred_name,
                                    'search_text' : v.target.search_text.split(",").map((v) => v.trim()),
                                    'tag' : v.target.tag
                                })
                            } else if (v.type === "delete") {
                                api.delete.author({
                                    'id' : v.target.id
                                })
                            }
                        })
                    }}>
                        <Button type="submit" className="translate-x-8 w-fit p-4 mt-4 mr-10">Save Changes</Button>
                        <Button type="button" variant="ghost" onClick={() => { setModifedAuthors([]) }}>Discard Changes</Button>
                    </form>
                </Alert>
            </div>
        }
    </div>
}