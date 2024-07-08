export type Tag = {
    id: number,
    category: "Person" | "Topic" | "Miscellaneous",
    title: string
}

export type Author = {
    id: number,
    preferred_name: string,
    search_text: string,
    tag: Tag
}

export type Quote = {
    id: number;
    preamble: string,
    quote: string,
    author: string,
    date: string,
    confirmed_date: string,
    message_id: string,
    message_date: string
}

export type RichQuote = {
    id: number,
    preamble: string,
    quote: string,
    author: Author,
    date: string,
    confirmed_date: string,
    message_id: string,
    message_date: string,
    tags: Tag[]
}