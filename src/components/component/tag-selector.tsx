"use client"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TagAdmin, AuthorTagStd, AuthorTagAdmin } from "@/components/component/tag";
import { Tag, Author } from "@/app/api/db/types";
import Fuse from 'fuse.js'
import React, { useEffect } from "react";
import { Button } from "../ui/button";

export function TagSelector(props: {
    showLabel: boolean,
    includeAuthor?: Author,
    sourceTags: Tag[],
    defaultTags?: Tag[],
    onSelectedTagsChanged?: (currentTags: Tag[]) => void,
    onSelectedTagsIncreased?: (tagAdded: Tag) => void,
    onSelectedTagsDecreased?: (tagRemoved: Tag) => void,
}) {
    const [sortedTags, setSortedTags] = React.useState<Tag[]>([])
    const [selectedTags, setSelectedTags] = React.useState<Tag[]>(props.includeAuthor != undefined ? [props.includeAuthor.tag] : [])

    useEffect(() => {
        if (props.includeAuthor?.tag == undefined) { return; }
        const tagAlreadyThere = selectedTags.includes(props.includeAuthor?.tag)
        setSelectedTags(tagAlreadyThere ? selectedTags : selectedTags.concat([props.includeAuthor?.tag]))
    }, [props.includeAuthor])

    return (<>
        {
            props.showLabel ? <Label htmlFor="tags" className="p-2">Tags</Label> : ""
        }
        <Input type="search" id="tags" onInput={(e) => {
            const fuse = new Fuse(props.sourceTags, { keys: ['title'], threshold: 0.1, ignoreLocation: true, isCaseSensitive: false });
            setSortedTags(fuse.search(e.currentTarget.value).map((r) => r.item))
        }} />
        {
            sortedTags.length > 1 || selectedTags.length > 0 || props.includeAuthor != undefined ?
                <ScrollArea className="max-h-40 min-h-10 border-gray-800 border-2 rounded-md p-1 mt-2 overflow-y-scroll">
                    {
                        props.includeAuthor != undefined ? <div className="m-1"><AuthorTagStd author={props.includeAuthor} /></div> : ""
                    }
                    {
                        (selectedTags.filter((t) => !(props.includeAuthor?.tag == t)))
                            .map((tag, i) =>
                                <TagAdmin
                                    tag={tag}
                                    onAdd={(t) => {
                                        setSelectedTags(selectedTags.concat([t]));
                                        props.onSelectedTagsChanged?.call({}, selectedTags);
                                        props.onSelectedTagsIncreased?.call({}, t);
                                    }}
                                    onRemove={(t) => {
                                        setSelectedTags(selectedTags.filter((tag) => tag.id != t.id));
                                        props.onSelectedTagsChanged?.call({}, selectedTags);
                                        props.onSelectedTagsDecreased?.call({}, t);
                                    }}
                                    startState="unpin"
                                    className="m-1" key={i}
                                />
                            )
                    }
                    {
                        sortedTags
                            .filter((t, i) => !selectedTags.includes(t))
                            .slice(0, 6)
                            .map((tag, i) =>
                                <TagAdmin
                                    tag={tag}
                                    onAdd={(t) => {
                                        setSelectedTags(selectedTags.concat([t]));
                                        props.onSelectedTagsChanged?.call({}, selectedTags)
                                        props.onSelectedTagsIncreased?.call({}, t)
                                    }}
                                    onRemove={(t) => {
                                        setSelectedTags(selectedTags.filter((tag) => tag.id != t.id));
                                        props.onSelectedTagsChanged?.call({}, selectedTags)
                                        props.onSelectedTagsDecreased?.call({}, t)
                                    }}
                                    startState="pin"
                                    className="m-1" key={i}
                                />
                            )
                    }
                </ScrollArea> : ""
        }
    </>)
}

export function TagSelectorSingle(props: {
    showLabel: boolean,
    sourceTags: Tag[],
    defaultTag?: Tag,
    onSelectedTagChanged: (currentTag: Tag | null) => void
}) {
    const [sortedTags, setSortedTags] = React.useState<Tag[]>([])
    const [selectedTag, setSelectedTag] = React.useState<Tag | null>(props.defaultTag ?? null)

    useEffect(() => { props.onSelectedTagChanged(selectedTag); }, [selectedTag])

    return (<>
        {
            props.showLabel ? <Label htmlFor="tag" className="p-2">Tag</Label> : ""
        }
        {
            selectedTag != null ?
                <TagAdmin
                    tag={selectedTag}
                    onRemove={(t) => { setSelectedTag(null) }}
                    onAdd={(t) => { setSelectedTag(t) }}
                    startState="unpin"
                /> : <Input type="search" id="tag" onInput={(e) => {
                    const fuse = new Fuse(props.sourceTags, { keys: ['title'], threshold: 0.1, ignoreLocation: true, isCaseSensitive: false });
                    setSortedTags(fuse.search(e.currentTarget.value).map((r) => r.item))
                }} />
        }
        {
            sortedTags.length > 1 && selectedTag == null ?
                <ScrollArea className="h-30 min-h-10 w-full border-gray-800 border-2 rounded-md p-1 mt-2">
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

export function AuthorSelector(props: {
    showLabel: boolean,
    sourceAuthors: Author[],
    defaultAuthor?: Author,
    onSelectedAuthorChanged?: (currentAuthor: Author | null) => void,
    onSelectedAuthorAdded?: (authorAdded: Author) => void,
    onSelectedAuthorRemoved?: (authorRemoved: Author) => void,
}) {
    const [sortedAuthors, setSortedAuthors] = React.useState<Author[]>([])
    const [selectedAuthor, setSelectedAuthor] = React.useState<Author | null>(props.defaultAuthor ?? null)

    return (<>
        {
            props.showLabel ? <Label htmlFor="author" className="p-2">Author</Label> : ""
        }
        {
            selectedAuthor != null ?
                <AuthorTagAdmin
                    author={selectedAuthor}
                    onRemove={(a) => {
                        setSelectedAuthor(null);
                        props.onSelectedAuthorChanged?.call({}, null)
                        props.onSelectedAuthorRemoved?.call({}, a)
                    }}
                    onAdd={(a) => {
                        setSelectedAuthor(a);
                        props.onSelectedAuthorChanged?.call({}, a)
                        props.onSelectedAuthorAdded?.call({}, a)
                    }}
                    startState="unpin"
                /> : <Input type="search" id="author" onInput={(e) => {
                    const fuse = new Fuse(props.sourceAuthors, { keys: ['preferred_name', 'search_text'], threshold: 0.1, ignoreLocation: true, isCaseSensitive: false });
                    setSortedAuthors(fuse.search(e.currentTarget.value).map((r) => r.item))
                }} />
        }

        {
            sortedAuthors.length > 1 && selectedAuthor == null ?
                <ScrollArea className="h-32 min-h-10 border-gray-800 border-2 rounded-md p-1 mt-2">
                    <div>
                        {selectedAuthor != null ? "" :
                            sortedAuthors
                                .slice(0, 6)
                                .map((author, i) =>
                                    <div className="m-1" key={i}>
                                        <AuthorTagAdmin
                                            author={author}
                                            onRemove={(a) => {
                                                setSelectedAuthor(null);
                                                props.onSelectedAuthorChanged?.call({}, null)
                                                props.onSelectedAuthorRemoved?.call({}, a)
                                            }}
                                            onAdd={(a) => {
                                                setSelectedAuthor(a);
                                                props.onSelectedAuthorChanged?.call({}, a)
                                                props.onSelectedAuthorAdded?.call({}, a)
                                            }}
                                            startState="pin"
                                        />
                                    </div>
                                )
                        }
                    </div>
                </ScrollArea> : ""
        }
    </>)
}