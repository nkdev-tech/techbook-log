PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_taggings` (
	`book_id` integer NOT NULL,
	`tag_id` integer NOT NULL,
	PRIMARY KEY(`book_id`, `tag_id`),
	FOREIGN KEY (`book_id`) REFERENCES `books`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`tag_id`) REFERENCES `tags`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_taggings`("book_id", "tag_id") SELECT "book_id", "tag_id" FROM `taggings`;--> statement-breakpoint
DROP TABLE `taggings`;--> statement-breakpoint
ALTER TABLE `__new_taggings` RENAME TO `taggings`;--> statement-breakpoint
PRAGMA foreign_keys=ON;