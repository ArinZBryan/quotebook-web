import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Discord from "next-auth/providers/discord"
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import { db, db_tables } from "@/schema"
import { eq, like } from "drizzle-orm"

export const { handlers, signIn, signOut, auth } = NextAuth({
    debug: false,
    session: {
        strategy: "database"
    },
    adapter: DrizzleAdapter(db, {
        usersTable: db_tables.users,
        accountsTable: db_tables.accounts,
        sessionsTable: db_tables.sessions,
        verificationTokensTable: db_tables.verificationTokens,
    }),
    providers: [Google, Discord],
    callbacks: {
        async signIn({ user, account, profile, email, credentials }) {
            if (process.env.DEV_NOLOGIN == "true") { return true; }
            //pre-existing account
            const rows = await db.select()
                .from(db_tables.users)
                .where(eq(db_tables.users.id, user.id ?? ""))
            if (rows.length >= 1) { return true; }

            if (account?.provider != "discord") {
                //linking other accounts
                const rows = await db.select()
                    .from(db_tables.users)
                    .where(like(db_tables.users.email, user.email ?? ""))
                if (rows.length >= 1) { return true; }
            }

            //check if account is on whitelist to make
            const whitelist = await db.select()
                .from(db_tables.whitelisted_users)

            if (whitelist.filter((v) => v.discord_id == account?.providerAccountId).length >= 1 ) {
                return true
            }
            

            return false
        },

        async session({ session, token, user }) {
            session.user.admin = user.admin;
            session.user.linked_author = user.linked_author;

            return session;
        }

    }
})