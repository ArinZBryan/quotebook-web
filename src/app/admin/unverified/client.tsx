"use client"
import { useState, useEffect, useMemo } from "react";
import Fuse from 'fuse.js'
import { Table } from "./table";
import { UnverifedQuote, Tag, Author, RichQuote } from "@/app/api/db/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { AuthorTagAdmin, AuthorTagStd, TagAdmin, TagStd } from "@/components/component/tag";
import { api } from "@/api";
import { AuthorSelector, TagSelector } from "@/components/component/tag-selector";


export function InteractivePage({ env_vars, static_data } : {
    env_vars: { server_id: string, channel_id: string },
    static_data: {'tags' : Tag[], 'authors' : Author[], 'quotes' : UnverifedQuote[]}
}) {
    const quotes = static_data.quotes;
    const [selectedQuote, setSelectedQuote] = useState<UnverifedQuote | null>(null)
    const [formData, setFormData] = useState<{
        'id':number,
        'preamble': string,
        'quote': string,
        'date': string,
        'author': Author | null,
        'tags': Tag[]
    }>({
        'id':-1,
        'preamble': "",
        'quote': "",
        'date': "",
        'author': null,
        'tags': []
    })

    const [sortedAuthor, setSortedAuthor] = useState<Author[]>([])
    const [sortedTags, setSortedTags] = useState<Tag[]>([])
    const [showWarnings, setShowWarnings] = useState(false)

    return (<div className="flex flex-row flex-wrap lg:flex-nowrap h-full overflow-visible">
        <div className="2xl:min-w-[786px] xl:min-w-[580px] lg:min-w-[400px] min-w-full">
            <div className="p-4">
                <h1 className="text-4xl"><strong>Verify Quotes</strong></h1>
                <h2 className="text-2xl pt-2">{selectedQuote == null ? "" : "#"}{selectedQuote?.id}</h2>
                <p className="text-xl">{selectedQuote?.content}</p>
                <p>
                    {selectedQuote == null ? "" : "Posted: "}
                    {selectedQuote?.message_date.substring(0, 10)}
                    {selectedQuote == null ? "" : " @ "}
                    {selectedQuote?.message_date.substring(11, 16)}
                </p>
                <p className="text-[#5662f6] underline">
                    <a href={`https://discord.com/channels/${env_vars.server_id}/${env_vars.channel_id}/${selectedQuote?.message_id}`}>
                        {selectedQuote == null ? "" : "Link To Original Message"}
                    </a>
                </p>
                <form onSubmit={(e) => {
                    if (selectedQuote == undefined) { e.preventDefault(); return; }
                    api.delete.unverifiedquote({'id':selectedQuote!.id})}
                }>
                    <Button className="!bg-gray-800 !text-white hover:!bg-[#1f2937CC] mt-2">Delete Quote</Button>
                </form>
            </div>
            <form className="p-4 w-full">
                <Label htmlFor="preamble" className="p-2">Preamble</Label>
                <Textarea id="preamble" defaultValue={formData?.preamble} onInput={(value) => setFormData({...formData!, 'preamble': value.currentTarget.value})}></Textarea>
                <Label htmlFor="quote" className="flex flex-row justify-between p-2 pr-4">Quote {showWarnings ? <span className="text-red-500 ml-4">Quotes must contain some text</span> : ""}</Label>
                <Textarea id="quote" defaultValue={formData?.quote} onInput={(value) => setFormData({ ...formData!, 'quote': value.currentTarget.value })}></Textarea>
                <Label htmlFor="date" className="flex flex-row justify-between p-2 pr-4">Date {showWarnings ? <span className="text-red-500 ml-4">Quotes must have a date attributed</span> : ""}</Label>
                <Input type="number" id="date" placeholder={formData?.date} onInput={(value) => setFormData({ ...formData!, 'date': value.currentTarget.value })} />
                <Label htmlFor="author" className="flex flex-row justify-between p-2 pr-4">Author {showWarnings ? <span className="text-red-500 ml-4">Quotes must have an author</span> : ""}</Label>
                <AuthorSelector showLabel={false} onSelectedAuthorChanged={(a) => {setFormData({...formData, 'author' : a})}} sourceAuthors={static_data.authors}/>
                <TagSelector showLabel={true} onSelectedTagsChanged={(t) => {setFormData({...formData, 'tags' : t})}} sourceTags={static_data.tags} includeAuthor={formData.author ?? undefined}/>
                
                <Button className="!bg-gray-800 !text-white hover:!bg-[#1f2937CC] mt-2" onClick={(e) => {
                    if (formData.author == null || formData.quote == "" || formData.date == "") { e.preventDefault(); setShowWarnings(true); return; }
                    if ( selectedQuote == undefined ) { return; }
                    console.log(JSON.stringify(formData))

                    //TODO: For the purposes of testing, this call to api.add.quote has been replaced with a console.log (see /src/app/api/db/add/quote)
                    //      This needs to be undone, when testing is over.
                    api.add.quote({
                        'id': -1,
                        'preamble': formData.preamble,
                        'quote': formData.quote,
                        'author': formData.author,
                        'date': formData.date,
                        'confirmed_date': "true",
                        'message_date': selectedQuote.message_date,
                        'message_id': selectedQuote.message_id,
                        'tags': formData.tags
                    });
                    api.delete.unverifiedquote({'id' : selectedQuote.id});
                }} type="submit">Submit</Button>
            </form>
        </div>
        <div className="flex-shrink">
            <Table data={quotes} onItemSelected={setSelectedQuote} />
        </div>
    </div>)
}