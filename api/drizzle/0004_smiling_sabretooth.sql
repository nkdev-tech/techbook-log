CREATE TABLE `memos` (
	`id` integer PRIMARY KEY NOT NULL,
	`book_id` integer NOT NULL,
	`content` text NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`book_id`) REFERENCES `books`(`id`) ON UPDATE no action ON DELETE cascade
);
