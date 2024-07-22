export type Quote = {
    preamble: string,
    quote: string,
    author: {
        text: string,
        id?: string,
        tid?: string
    }
    date: string,
    confirmed_date: boolean,
    message_id: string,
    message_date: string,
}

export type UnverifiedQuote = {
    id?: number,
    content: string,
    message_id: string,
    message_date: string
}

export type Tag = {
    id?: string,
    category: "Person" | "Subject" | "Miscellaneous",
    title: string
}

export type Author = {
    id?: number,
    preferred_name: string,
    names: string,
    tag_id?: string 
}