import { integer, sqliteTable, text, primaryKey } from "drizzle-orm/sqlite-core"
import { createClient } from "@libsql/client"
import { drizzle } from "drizzle-orm/libsql"
import type { AdapterAccountType } from "@auth/core/adapters"

if (false) {
  console.log(process.env.SQLITE_URL);
  console.log(process.env.SQLITE_TOKEN);
}


export const connection = createClient({
  url: process.env.SQLITE_URL!,
  authToken: process.env.SQLITE_TOKEN!,
})
export const db = drizzle(connection)
 
export const users = sqliteTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").notNull(),
  emailVerified: integer("emailVerified", { mode: "timestamp_ms" }),
  image: text("image"),
  admin: text("admin").notNull().default("false"),
  linked_author: integer("linked_author")
    .references(() => authors.id)
})
 
export const accounts = sqliteTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
)
 
export const sessions = sqliteTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
})
 
export const verificationTokens = sqliteTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
  },
  (verficationToken) => ({
    compositePk: primaryKey({
      columns: [verficationToken.identifier, verficationToken.token],
    }),
  })
)
 
export const authenticators = sqliteTable(
  "authenticator",
  {
    credentialID: text("credentialID").notNull().unique(),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    providerAccountId: text("providerAccountId").notNull(),
    credentialPublicKey: text("credentialPublicKey").notNull(),
    counter: integer("counter").notNull(),
    credentialDeviceType: text("credentialDeviceType").notNull(),
    credentialBackedUp: integer("credentialBackedUp", {
      mode: "boolean",
    }).notNull(),
    transports: text("transports"),
  },
  (authenticator) => ({
    compositePK: primaryKey({
      columns: [authenticator.userId, authenticator.credentialID],
    }),
  })
)

export const tags = sqliteTable("tags" , {
    id: integer("id")
        .primaryKey(),
    category: text("category", { enum: [ "Person", "Topic", "Miscellaneous"]})
        .notNull(),
    title: text("title")
        .notNull()
})

export const authors = sqliteTable("authors", {
    id: integer("id")
        .primaryKey(),
    preferred_name: text("preferred_name")
        .notNull(),
    search_text: text("search_text"),
    tag: integer("tag")
        .references(() => tags.id, { onDelete: "restrict" })
})

export const quotes = sqliteTable("quotes", {
    id: integer("id")
        .primaryKey(),
    preamble: text("preamble"),
    quote: text("quote"),
    author: integer("author")
        .references(() => authors.id, { onDelete: "restrict" }),
    date: text("date"),
    confirmed_date: text("confirmed_date"),
    message_id: text("message_id")

})

export const tag_instances = sqliteTable("tag_instances", {
    tag: integer("tag")
        .references(() => tags.id, { onDelete: "restrict" }),
    quote: integer("quote")
        .references(() => quotes.id)
})

export const unverified_quotes = sqliteTable("unverified_quotes", {
    id: integer("id")
        .primaryKey(),
    content: text("content"),
    message_id: text("message_id")
})

export const db_tables = {
  users: users,
  accounts: accounts,
  sessions: sessions,
  verificationTokens: verificationTokens,
  authenticators: authenticators,
  tags: tags,
  authors: authors,
  quotes: quotes,
  tag_instances: tag_instances,
  unverified_quotes: unverified_quotes
}