import "server-only"
import { migrate } from "drizzle-orm/libsql/migrator"
import { eq, } from 'drizzle-orm'
import { db, connection } from '@/schema'
import { db_tables } from "@/schema"
import { Quote, UnverifiedQuote } from "@/app/api/discord/types";
import Fuse from 'fuse.js'
import * as Discord from 'discord.js'

export class DiscordBot {
    readonly options : Readonly<{
        run_migrations: boolean
        migrations_folder: string,   // "./drizzle"
        discord_options: {
            token: string,
            source_channel: string,
            application_id: string,
        },
        automatically_update_search_text: boolean,
        clear_tables: boolean
    }> 

    

    runtime_log : string

    constructor(options : typeof this.options) {
        this.options = options
        this.runtime_log = ""
    }

    log(input : string) { this.runtime_log + "[Log] " + input + "\n"; }
    error(input : string) { this.runtime_log + "[Error] " + input + "\n"; }

    async gatherQuotes() {
        this.runtime_log = ""
        if (this.options.run_migrations) { //Default false
            // This will run migrations on the database, skipping the ones already applied
            await migrate(db, { migrationsFolder: this.options.migrations_folder })
        }
        
        const discord_client = new Discord.Client({ intents: [Discord.GatewayIntentBits.Guilds] });
        this.log("Connecting to Discord");
        await discord_client.login(this.options.discord_options.token).catch(e => this.error(e));
        this.log("Connected to Discord");
        this.log('logged in as ' + discord_client.user?.tag);
        
        const all_quotes = await this.get_quotes_from_source(await this.get_latest_quote(), discord_client);
        const authored_quotes = await this.match_quotes_to_authors(all_quotes.verified)
        
        const quotes = { verified: authored_quotes, unverified: all_quotes.unverified }
        if (quotes.verified.length == 0 && quotes.unverified.length == 0) {
            this.log("No new quotes found");
            this.cleanup_connections(discord_client)
            return { verified: 0, unverified: 0, log: this.runtime_log };
        } else {
            const vq_ids = await db.insert(db_tables.quotes)
                .values(quotes.verified as (typeof db_tables.quotes.$inferInsert)[])
                .returning({ id: db_tables.quotes.id })
        
            const uvq = await db.insert(db_tables.unverified_quotes)
                .values(quotes.unverified)
        
            const ti = quotes.verified.map((v, i) => { return { tag: v.author_tag_id, quote: vq_ids[i].id } as typeof db_tables.tag_instances.$inferInsert })
        
            await db.insert(db_tables.tag_instances)
                .values(ti)
        
            // Don't forget to close the connection, otherwise the script will hang
            await this.cleanup_connections(discord_client)

            return { verified: quotes.verified.length, unverified: quotes.unverified.length, log: this.runtime_log }
        }
    }
    
    private async cleanup_connections(discord_client: Discord.Client) {
        await connection.close();
        this.log("Disconnected from database");
        await discord_client.destroy().catch(e => this.error(e));
        this.log("Disconnected from Discord");
    }
    private async get_quotes_from_source(latest_quote_id: string, discord_client: Discord.Client): Promise<{ verified: Quote[], unverified: (typeof db_tables.unverified_quotes.$inferInsert)[] }> {
        this.log("Getting quotes from source channel")
    
        const channel: Discord.TextChannel = discord_client.channels.cache.get(process.env.SOURCE_CHANNEL!) as Discord.TextChannel;
        const quotes: Quote[] = [];
        const not_quotes: (typeof db_tables.unverified_quotes.$inferInsert)[] = [];
    
        const messages = await this.fetch_all_messages(channel, latest_quote_id);
    
        for (var i = 0; i < messages.length; i++) {
            if (messages[i].id == latest_quote_id) { break; }
    
            const msg = this.try_parse_message(messages[i]);
            if (msg == undefined) {
                not_quotes.push({ content: messages[i].content, message_id: messages[i].id, message_date: messages[i].createdAt.toISOString()} as UnverifiedQuote);
            } else {
                quotes.push(msg);
            }
        }
    
        this.log(quotes.length + " verified quotes found");
        this.log(not_quotes.length + " unverified quotes found");
    
        return { verified: quotes, unverified: not_quotes };
    }
    private try_parse_message(message: Discord.Message): Quote | undefined {
        const regex = /(.*?)\s*[\"|\'|\“]\s*(.*)\s*[\"|\'|\”]\s*[-|~| ]\s*(.*?)\b ?([0-9]*?)$/gm;
    
        let matches;
    
        while ((matches = regex.exec(message.content)) !== null) {
            // This is necessary to avoid infinite loops with zero-width matches
            if (matches.index === regex.lastIndex) {
                regex.lastIndex++;
            }
    
            let confirmed_date = true;
    
            if (matches[4] == "") {
                const date = new Date(message.createdTimestamp);
                matches[4] = date.toISOString().substring(0, 4);
                confirmed_date = false;
            }
    
    
            // The result can be accessed through the `matches`-variable.
            return {
                "preamble": matches[1],
                "quote": matches[2],
                "author": {
                    text: matches[3],
                },
                "date": matches[4],
                "confirmed_date": confirmed_date,
                "message_id": message.id,
                "message_date": message.createdAt.toISOString()
            }
        }
    }
    private async fetch_all_messages(channel: Discord.TextChannel, latest_quote_id: string): Promise<Discord.Message[]> {
        let messages: Discord.Message[] = [];
    
        // Create message pointer (get first message)
        let message = await channel.messages
            .fetch({ limit: 1 })
            .then(messagePage => (messagePage.size === 1 && messagePage.at(0)!.id != latest_quote_id ? messagePage.at(0) : null))
            .catch(e => this.error(e));
        if (message != null) {
            messages.push(message);
        }
        let done = false;
        while (message && !done) {
            await channel.messages
                .fetch({ limit: 100, before: message.id })
                .then(messagePage => {
                    for (var i = 0; i < messagePage.size; i++) {
                        if (messagePage.at(i)!.id == latest_quote_id) {
                            done = true;
                            break;
                        } else {
                            messages.push(messagePage.at(i)!);
                        }
                    }
                    // Update our message pointer to be the last message on the page of messages
                    message = 0 < messagePage.size ? messagePage.at(messagePage.size - 1) : null;
                })
                .catch(e => this.error(e));
        }
        return messages;
    }
    async get_latest_quote() {
        const latest_quote = await db.select()
            .from(db_tables.quotes)
            .orderBy(db_tables.quotes.message_date)
            .limit(1)
    
        let latest_quote_id = "";
        if (latest_quote.length == 0) {
            this.log("No quotes found in the database");
        } else {
            latest_quote_id = latest_quote[0].message_id!;
            this.log("Latest quote id: " + latest_quote_id)
        }
        return latest_quote_id
    }
    private async match_quotes_to_authors(quotes: Quote[]): Promise<(typeof db_tables.quotes.$inferInsert & { author_tag_id: number | null })[]> {
    
    
        let authors = await db.select({
            author_id: db_tables.authors.id,
            author_name: db_tables.authors.preferred_name,
            author_search_text: db_tables.authors.search_text,
            author_tag_id: db_tables.authors.tag,
        })
            .from(db_tables.authors)
    
        let resultQuotes: (typeof db_tables.quotes.$inferInsert & { author_tag_id: number | null })[] = []
    
        for (let i = 0; i < quotes.length; i++) {
            const fuse = new Fuse(authors, { keys: ["author_name", "author_search_text"], includeScore: true, shouldSort: true, threshold: 0.25, ignoreLocation: true })
            let foundAuthor = fuse.search(quotes[i].author.text);
            if (foundAuthor.length >= 1) { // found a matching author
                const exact_match = foundAuthor[0].score! < 0.001 // sometimes exact matches don't give zero, so this should hopefully be a small enough epsilon
                if (!exact_match) {
                    this.log(`Matched to author: ${foundAuthor[0].item.author_name} with a high degree of uncertainty.`)
                    if (process.env.AUTOMATICALLY_UPDATE_SEARCH_TEXT! = "true") {
                        const new_search_text = foundAuthor[0].item.author_search_text + "," + quotes[i].author.text
                        await db.update(db_tables.authors)
                            .set({ search_text: new_search_text.replace(/'/g, "''") })
                            .where(eq(db_tables.authors.id, foundAuthor[0].item.author_id))
                        this.log(`Updated search text of author: ${foundAuthor[0].item.author_name}`)
                    }
                    else {
                        this.log(`Consider adding ${quotes[i].author.text} as an item to the search text of author: ${foundAuthor[0].item.author_name} `)
                    }
                }
                const obj = {
                    'preamble': quotes[i].preamble,
                    'quote': quotes[i].quote,
                    'author': foundAuthor[0].item.author_id,
                    'date': quotes[i].date,
                    'confirmed_date': quotes[i].confirmed_date + "",
                    'message_id': quotes[i].message_id,
                    'message_date': quotes[i].message_date,
                    'author_tag_id': foundAuthor[0].item.author_tag_id
                };
                resultQuotes.push(obj)
    
            } else {
                this.log(`No matching author in database for text: ${quotes[i].author.text}`)
    
                const tag_id = (await db.insert(db_tables.tags)
                    .values({ category: "Person", title: quotes[i].author.text })
                    .returning({ id: db_tables.tags.id }))[0].id
                this.log(`Added new tag -> Person:${quotes[i].author.text}`)
    
                const auth_id = (await db.insert(db_tables.authors)
                    .values({ preferred_name: quotes[i].author.text, search_text: quotes[i].author.text, tag: tag_id })
                    .returning({ id: db_tables.authors.id }))[0].id
                this.log(`Added new author -> ${quotes[i].author.text}`)
    
                const obj = {
                    'preamble': quotes[i].preamble,
                    'quote': quotes[i].quote,
                    'author': auth_id,
                    'date': quotes[i].date,
                    'confirmed_date': quotes[i].confirmed_date + "",
                    'message_id': quotes[i].message_id,
                    'message_date': quotes[i].message_date,
                    'author_tag_id': tag_id
                };
    
                resultQuotes.push(obj)
                authors = await db.select({
                    author_id: db_tables.authors.id,
                    author_name: db_tables.authors.preferred_name,
                    author_search_text: db_tables.authors.search_text,
                    author_tag_id: db_tables.authors.tag,
                })
                    .from(db_tables.authors)
            }
    
        }
    
        return resultQuotes
    
    }
    
}


