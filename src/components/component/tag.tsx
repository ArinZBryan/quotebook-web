import type { Author, Tag } from "@/app/api/db/types"
import React from "react"
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
  } from "@/components/ui/hover-card"
import { PinIcon, PinOffIcon } from "lucide-react"

const colours = {
    'Person': "EF5B5B",
    'Topic': "20A39E",
    'Miscellaneous': "ffba49"
}

const tagCutoff = 18

export function TagStd({tag, overrideColor, className}: {tag: Tag, overrideColor? : string, className? : string}) : JSX.Element
{
    let tagText = `${tag.category}:${tag.title}`
    if (!(tag.title == undefined || tag.category == undefined)) {
    if (tagText.length > tagCutoff) {
        if (tag.category == "Miscellaneous") {
            tagText = `Misc.:${tag.title}`
            if (tagText.length > tagCutoff) {
                tagText = `Misc.:${tag.title.substring(0, tagCutoff - 8 - 1)}...`
            }
        } else {
            tagText = `${tag.category}:${tag.title.substring(0, tagCutoff - tag.category.length - 3 - 1)}...`
        }
    }
    }
    
    return (
        <HoverCard>
            <HoverCardTrigger className={`rounded-full w-fit p-1 pl-3 pr-3 text-black m-1 ${className}`} style={{backgroundColor:`#${overrideColor == undefined ? colours[tag.category as keyof typeof colours] : overrideColor}`}}>
                {tagText}
            </HoverCardTrigger>
            <HoverCardContent className="w-fit">
                <div className="pl-2 pr-2">
                    <div className="text-xl">{tag.title}</div>
                    <div style={{color:`#${colours[tag.category as keyof typeof colours]}`}}>{tag.category}</div>
                    <div className="h-3"></div>
                    <div className="text-gray-500">#{tag.id}</div>
                </div>
            </HoverCardContent>
        </HoverCard>
    )
}

export function TagAdmin({tag, onRemove, onAdd, overrideColor, startState, className }: {
    tag: Tag, 
    onRemove: (tagRemoved : Tag) => void, 
    onAdd: (tagAdded: Tag) => void, 
    overrideColor? : string, 
    startState?: "pin" | "unpin",
    className?: string
}) : JSX.Element
{   
    let title = tag.title;
    let category = tag.category
    let tagText = `${category}:${title}`
    if (tagText.length > tagCutoff) {
        if (tag.category == "Miscellaneous") {
            tagText = `Misc.:${title}`
            if (tagText.length > tagCutoff) {
                tagText = `Misc.:${title.substring(0, tagCutoff - 8 - 1)}...`
            }
        } else {
            tagText = `${category}:${title.substring(0, tagCutoff - category.length - 3 - 1)}...`
        }
    }

    const [controlHidden, setDeleteHidden] = React.useState(true);
    const [controlState, setControlState] = React.useState(startState)
    return (
        <HoverCard>
            <HoverCardTrigger className={`rounded-full p-1 pl-3 pr-3 text-black m-1 flex w-fit ${className}`} style={{backgroundColor:`#${overrideColor == undefined ? colours[tag.category as keyof typeof colours] : overrideColor}`}}>
            <span onMouseEnter={() => setDeleteHidden(false)} onMouseLeave={() => setDeleteHidden(true)} className="flex flex-row w-fit">
                {tagText}
                {
                    !controlHidden ? 
                        (controlState == "pin" ? 
                            <PinIcon onClick={() => {setControlState("unpin");onAdd(tag);}} /> : 
                            <PinOffIcon onClick={() => {setControlState("pin");onRemove(tag);}} />
                        ) : ""
                }
                </span>
            </HoverCardTrigger>
            
            <HoverCardContent className="w-fit">
                <div className="pl-2 w-fit">
                    <div className="text-xl">{tag.title}</div>
                    <div style={{color:`#${colours[tag.category as keyof typeof colours]}`}}>{tag.category}</div>
                    <div className="h-3"></div>
                    <div className="text-gray-500">#{tag.id}</div>
                    
                </div>
            </HoverCardContent>
        </HoverCard>
    )
}

export function AuthorTagStd({author, overrideColor, className}: {author?: Author, overrideColor? : string, className?: string}) : JSX.Element
{
    let tag : Tag | null = null;
    if (author == undefined) {
        tag = {'id': -1, 'category': 'Miscellaneous', 'title': '[SYSTEM] Unknown'} as Tag
        overrideColor = "555555"
    } else {
        tag = author.tag
    }
    let tagText = `${tag.category}:${tag.title}`
    if (!(tag.title == undefined || tag.category == undefined)) {
    if (tagText.length > tagCutoff) {
        if (tag.category == "Miscellaneous") {
            tagText = `Misc.:${tag.title}`
            if (tagText.length > tagCutoff) {
                tagText = `Misc.:${tag.title.substring(0, tagCutoff - 8 - 1)}...`
            }
        } else {
            tagText = `${tag.category}:${tag.title.substring(0, tagCutoff - tag.category.length - 3 - 1)}...`
        }
    }
    }
    
    return (
        <HoverCard>
            <HoverCardTrigger className={`rounded-full w-fit p-1 pl-3 pr-3 text-black m-1 ${className}`} style={{backgroundColor:`#${overrideColor == undefined ? colours[tag.category as keyof typeof colours] : overrideColor}`}}>
                {tagText}
            </HoverCardTrigger>
            <HoverCardContent className="w-fit">
                <div className="pl-2 pr-2">
                    <div className="text-xl">{tag.title}</div>
                    <div style={{color:`#${colours[tag.category as keyof typeof colours]}`}}>{tag.category}</div>
                    <div className="h-3"></div>
                    <div className="text-gray-500">#{tag.id}</div>
                </div>
            </HoverCardContent>
        </HoverCard>
    )
}

export function AuthorTagAdmin({author, onRemove, onAdd, overrideColor, startState, className }: {
    author: Author, 
    onRemove: (authorRemoved : Author) => void, 
    onAdd: (authorAdded: Author) => void, 
    overrideColor? : string, 
    startState?: "pin" | "unpin",
    className? : string
}) : JSX.Element {   
    const tag = author.tag;
    let title = tag.title;
    let category = "Author"
    let tagText = `${category}:${title}`
    if (tagText.length > tagCutoff) {
        tagText = `${category}:${title.substring(0, tagCutoff - category.length - 3 - 1)}...`
    }

    const [controlHidden, setDeleteHidden] = React.useState(true);
    const [controlState, setControlState] = React.useState(startState)
    return (
        <HoverCard>
            <HoverCardTrigger className={`rounded-full p-1 pl-3 pr-3 text-black m-1 flex w-fit ${className}`} style={{backgroundColor:`#${overrideColor == undefined ? colours[tag.category as keyof typeof colours] : overrideColor}`}}>
            <span onMouseEnter={() => setDeleteHidden(false)} onMouseLeave={() => setDeleteHidden(true)} className="flex flex-row w-fit">
                {tagText}
                {
                    !controlHidden ? 
                        (controlState == "pin" ? 
                            <PinIcon onClick={() => {setControlState("unpin"); onAdd(author)}} /> : 
                            <PinOffIcon onClick={() => {setControlState("pin"); onRemove(author)}} />
                        ) : ""
                }
                </span>
            </HoverCardTrigger>
            
            <HoverCardContent className="w-fit">
                <div className="pl-2 w-fit">
                    <div className="text-xl">{tag.title}</div>
                    <div style={{color:`#${colours[tag.category as keyof typeof colours]}`}}>{tag.category}</div>
                    <div className="h-3"></div>
                    <div className="text-gray-500">#{tag.id}</div>
                    
                </div>
            </HoverCardContent>
        </HoverCard>
    )
}

