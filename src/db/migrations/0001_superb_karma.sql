ALTER TABLE "leads" ALTER COLUMN "clicked_links" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "leads" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "leads" ALTER COLUMN "created_at" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "leads" ALTER COLUMN "updated_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "leads" ALTER COLUMN "updated_at" DROP NOT NULL;