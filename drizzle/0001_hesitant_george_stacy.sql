CREATE TABLE `whitelistedUsers` (
	`id` integer NOT NULL,
	`discordID` text NOT NULL,
	`makeAdmin` text DEFAULT 'false' NOT NULL,
	`linkedAuthor` integer,
	FOREIGN KEY (`linkedAuthor`) REFERENCES `authors`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
ALTER TABLE `quotes` ADD `message_date` text;--> statement-breakpoint
ALTER TABLE `unverified_quotes` ADD `message_date` text;