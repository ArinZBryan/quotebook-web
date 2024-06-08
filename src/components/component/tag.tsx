import type { Tag } from "@/pages/api/db/raw/types"
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

const tagCutoff = 25

export function TagStd({tag, overrideColor}: {tag: Tag, overrideColor? : string}) : JSX.Element
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
            <HoverCardTrigger className="rounded-full w-fit p-1 pl-3 pr-3 text-black m-1" style={{backgroundColor:`#${overrideColor == undefined ? colours[tag.category as keyof typeof colours] : overrideColor}`}}>
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

export function TagAdmin({tag, onRemove, onAdd, overrideColor, startState }: {tag: Tag, onRemove: (tagRemoved : Tag) => void, onAdd: (tagAdded: Tag) => void, overrideColor? : string, startState?: "pin" | "unpin" }) : JSX.Element
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
            <HoverCardTrigger className="rounded-full p-1 pl-3 pr-3 text-black m-1 flex w-fit" style={{backgroundColor:`#${overrideColor == undefined ? colours[tag.category as keyof typeof colours] : overrideColor}`}}>
            <span onMouseEnter={() => setDeleteHidden(true)} onMouseLeave={() => setDeleteHidden(false)} className="flex flex-row w-fit">
                {tagText}
                {
                    controlHidden ? 
                        (controlState == "pin" ? 
                            <PinIcon onClick={() => {setControlState("unpin"); onAdd(tag)}} /> : 
                            <PinOffIcon onClick={() => {setControlState("pin"); onRemove(tag)}} />
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
/*
<HoverCardTrigger className="rounded-full w-fit p-1 pl-3 pr-3 text-black m-1" style={{backgroundColor:`#${overrideColor == undefined ? colours[tag.category as keyof typeof colours] : overrideColor}`}}>
                <div onMouseEnter={() => setDeleteHidden(true)} onMouseLeave={() => setDeleteHidden(false)} className="flex flex-row">
                {tagText}
                {
                    controlHidden ? 
                        (controlState == "unpin" ? 
                            <PinIcon onClick={() => {setControlState("pin"); onAdd(tag)}} /> : 
                            <PinOffIcon onClick={() => {setControlState("unpin"); onRemove(tag)}} />
                        ) : ""
                }
                </div>
            </HoverCardTrigger>
*/