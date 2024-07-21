"use client"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TagAdmin, AuthorTagStd, AuthorTagAdmin } from "@/components/component/tag";
import { Tag, Author } from "@/app/api/db/types";
import Fuse from 'fuse.js'
import React, { useEffect } from "react";

export function TagSelector(props : { 
    showLabel : boolean,
    includeAuthor? : Author,
    sourceTags : Tag[],
    onSelectedTagsChanged : (currentTags : Tag[]) => void
}) {
    const [sortedTags, setSortedTags] = React.useState<Tag[]>([])
    const [selectedTags, setSelectedTags] = React.useState<Tag[]>([])

    useEffect(() => { props.onSelectedTagsChanged(selectedTags); }, [selectedTags])

    return (<>
        {
            props.showLabel ? <Label htmlFor="tags" className="p-2">Tags</Label> : ""
        }
        <Input type="search" id="tags" onInput={(e) => {
            const fuse = new Fuse(props.sourceTags, { keys: ['title'], threshold: 0.1, ignoreLocation: true, isCaseSensitive: false });
            setSortedTags(fuse.search(e.currentTarget.value).map((r) => r.item))
        }} />
        {
            sortedTags.length > 1 || selectedTags.length > 0 ?
                <ScrollArea className="max-h-40 min-h-10 border-gray-800 border-2 rounded-md p-1 mt-2 overflow-y-scroll">
                    {
                        props.includeAuthor !== undefined ? <div className="m-1"><AuthorTagStd author={props.includeAuthor} /></div> : ""
                    }
                    {
                        (selectedTags.filter((t) => !(props.includeAuthor?.tag == t)))
                            .map((tag, i) =>
                                <div className="m-1" key={i}>
                                    <TagAdmin
                                        tag={tag}
                                        onAdd={(t) => { setSelectedTags(selectedTags.concat([t])); }}
                                        onRemove={() => { setSelectedTags(selectedTags.toSpliced(selectedTags.indexOf(tag))); }}
                                        startState="unpin"
                                    />
                                </div>
                            )
                    }
                    {
                        sortedTags
                            .filter((t, i) => !selectedTags.includes(t))
                            .slice(0, 6)
                            .map((tag, i) =>
                                <div className="m-1" key={i}>
                                    <TagAdmin
                                        tag={tag}
                                        onAdd={(t) => { setSelectedTags( selectedTags.concat([t])); }}
                                        onRemove={() => { setSelectedTags( selectedTags.toSpliced(selectedTags.indexOf(tag))); }}
                                        startState="pin"
                                    />
                                </div>
                            )
                    }
                </ScrollArea> : ""
        }
    </>)
}

export function TagSelectorSingle(props : { 
    showLabel : boolean,
    sourceTags : Tag[],
    onSelectedTagChanged : (currentTag : Tag | null) => void
}) {
    const [sortedTags, setSortedTags] = React.useState<Tag[]>([])
    const [selectedTag, setSelectedTag] = React.useState<Tag|null>(null)

    useEffect(() => { props.onSelectedTagChanged(selectedTag); }, [selectedTag])

    return (<>
        {
            props.showLabel ? <Label htmlFor="tag" className="p-2">Tag</Label> : ""
        }
        <Input type="search" id="tag" onInput={(e) => {
            const fuse = new Fuse(props.sourceTags, { keys: ['title'], threshold: 0.1, ignoreLocation: true, isCaseSensitive: false });
            setSortedTags(fuse.search(e.currentTarget.value).map((r) => r.item))
        }} />
        {
            sortedTags.length > 1 || selectedTag != null ?
                <ScrollArea className="max-h-40 min-h-10 border-gray-800 border-2 rounded-md p-1 mt-2 overflow-y-scroll">
                    {
                        selectedTag != null ? 
                        <TagAdmin 
                            tag={selectedTag}
                            onRemove={(t) => {setSelectedTag(null)}}
                            onAdd={(t) => {setSelectedTag(t)}}
                            startState="unpin"
                        /> : ""
                    }
                    {
                        sortedTags
                            .filter((a) => a != selectedTag)
                            .slice(0, 6)
                            .map((tag, i) =>
                                <div className="m-1" key={i}>
                                    <TagAdmin
                                        tag={tag}
                                        onAdd={(t) => { setSelectedTag(t); }}
                                        onRemove={() => { setSelectedTag(null); }}
                                        startState="pin"
                                    />
                                </div>
                            )
                    }
                </ScrollArea> : ""
        }
    </>)
}

export function AuthorSelector(props : { 
    showLabel : boolean,
    sourceAuthors : Author[],
    onSelectedAuthorChanged : (currentAuthor : Author | null) => void
}) {
    const [sortedAuthors, setSortedAuthors] = React.useState<Author[]>([])
    const [selectedAuthor, setSelectedAuthor] = React.useState<Author|null>(null)

    useEffect(() => { props.onSelectedAuthorChanged(selectedAuthor); }, [selectedAuthor])

    return (<>
        {
            props.showLabel ? <Label htmlFor="author" className="p-2">Author</Label> : ""
        }
        <Input type="search" id="author" onInput={(e) => {
            const fuse = new Fuse(props.sourceAuthors, { keys: ['preferred_name', 'search_text'], threshold: 0.1, ignoreLocation: true, isCaseSensitive: false });
            setSortedAuthors(fuse.search(e.currentTarget.value).map((r) => r.item))
        }} />
        {
            sortedAuthors.length > 1 || selectedAuthor != null ?
                <ScrollArea className="max-h-40 min-h-10 border-gray-800 border-2 rounded-md p-1 mt-2 overflow-y-scroll">
                    {
                        selectedAuthor != null ? 
                        <AuthorTagAdmin 
                            author={selectedAuthor}
                            onRemove={(a) => {setSelectedAuthor(null)}}
                            onAdd={(a) => {setSelectedAuthor(a)}}
                            startState="unpin"
                        /> : ""
                    }
                    {
                        sortedAuthors
                            .filter((a) => a != selectedAuthor)
                            .slice(0, 6)
                            .map((author, i) =>
                                <div className="m-1" key={i}>
                                    <AuthorTagAdmin
                                        author={author}
                                        onAdd={(a) => { setSelectedAuthor(a); }}
                                        onRemove={() => { setSelectedAuthor(null); }}
                                        startState="pin"
                                    />
                                </div>
                            )
                    }
                </ScrollArea> : ""
        }
    </>)
}