CREATE TABLE `books` (
	`id` integer PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`author` text NOT NULL,
	`status` text DEFAULT 'unread' NOT NULL,
	`rating` integer,
	`finished_at` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
