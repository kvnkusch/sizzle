CREATE TABLE IF NOT EXISTS "tag" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"name" text NOT NULL
);

CREATE TABLE IF NOT EXISTS "tag_to_todo" (
	"todo_id" uuid NOT NULL,
	"tag_id" uuid NOT NULL
);
--> statement-breakpoint
ALTER TABLE "tag_to_todo" ADD CONSTRAINT "tag_to_todo_todo_id_tag_id" PRIMARY KEY("todo_id","tag_id");

CREATE TABLE IF NOT EXISTS "todo" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"text" text NOT NULL,
	"is_done" boolean DEFAULT false NOT NULL,
	"group_id" uuid
);

CREATE TABLE IF NOT EXISTS "todo_group" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"name" text NOT NULL
);

DO $$ BEGIN
 ALTER TABLE "tag_to_todo" ADD CONSTRAINT "tag_to_todo_todo_id_todo_id_fk" FOREIGN KEY ("todo_id") REFERENCES "todo"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "tag_to_todo" ADD CONSTRAINT "tag_to_todo_tag_id_tag_id_fk" FOREIGN KEY ("tag_id") REFERENCES "tag"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "todo" ADD CONSTRAINT "todo_group_id_todo_group_id_fk" FOREIGN KEY ("group_id") REFERENCES "todo_group"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
