CREATE TABLE `whitelistedUsers` (
	`id` integer PRIMARY KEY NOT NULL,
	`discordID` text NOT NULL,
	`makeAdmin` text DEFAULT 'false' NOT NULL,
	`linkedAuthor` integer,
	FOREIGN KEY (`linkedAuthor`) REFERENCES `authors`(`id`) ON UPDATE no action ON DELETE no action
);
