"use client"
import { Author, RichQuote, Tag } from "@/app/api/db/types";
import { AuthorTagStd, TagStd } from "@/components/component/tag";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardTitle } from "@/components/ui/card";
import useWindowDimensions from '@/lib/useWindowDimensions';
import { CheckCircle2Icon } from "lucide-react";
import { useState, useEffect } from 'react';

export function InteractivePage(props: { rich_quotes: RichQuote[], authors: Author[], tags: Tag[] }) {

    const { width: windowWidth, height: windowHeight } = useWindowDimensions()

    const [selectedQuote, setSelectedQuote] = useState<RichQuote>({
        'author': {
            'id': -1, 
            'preferred_name': "No Author", 
            'search_text': "", 
            'tag': {
                'category': 'Person', 
                'id': -1, 
                'title': "No Author"
            }
        },
        'confirmed_date': "",
        'date': "",
        'id': -1,
        'message_date': "",
        'message_id': "",
        'preamble': "No Preamble",
        'quote': "No Quote",
        'tags': [{
            'category': 'Person', 
            'id': -1, 
            'title': "No Author"
        }]
    })

    const [rerender, setRerender] = useState(0)

    useEffect(() => { setRerender(rerender + 1) }, [windowWidth])

    return <>
        <button onClick={(e) => {
            e.preventDefault();
            setSelectedQuote(props.rich_quotes[Math.floor(Math.random() * (props.rich_quotes.length - 1))])
        }}>
            Get Quote
        </button>
        <div>
            <Card>
                <Accordion type="multiple">
                    <AccordionItem value="item-1">
                        <AccordionTrigger>Quote</AccordionTrigger>
                        <AccordionContent>
                        {selectedQuote.quote}
                        </AccordionContent>
                    </AccordionItem>
                    { selectedQuote.preamble == "" ? "" :  
                    <AccordionItem value="item-2">
                        <AccordionTrigger>Preamble</AccordionTrigger>
                        <AccordionContent>
                        {selectedQuote.preamble}
                        </AccordionContent>
                    </AccordionItem>
                    }
                    <AccordionItem value="item-3">
                        <AccordionTrigger>Author</AccordionTrigger>
                        <AccordionContent>
                            <AuthorTagStd author={selectedQuote.author}/>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-4">
                        <AccordionTrigger>Date</AccordionTrigger>
                        <AccordionContent className="flex flex-row gap-2 items-center">
                            {selectedQuote.date}
                            {selectedQuote.confirmed_date == "true" ? <CheckCircle2Icon/> : ""}
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-5">
                        <AccordionTrigger>Message Date</AccordionTrigger>
                        <AccordionContent>
                            {selectedQuote.message_date.substring(0, 10)}
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-6">
                        <AccordionTrigger>Tags</AccordionTrigger>
                        <AccordionContent className="min-h-fit min-w-fit">
                            {
                                selectedQuote.tags.map((t) => <TagStd tag={t}/>)
                            }
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </Card>
        </div>
    </>
}
