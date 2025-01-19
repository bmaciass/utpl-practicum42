CREATE TYPE "public"."staffType" AS ENUM('doctor', 'nurse');--> statement-breakpoint
CREATE TABLE "Staff" (
	"id" serial PRIMARY KEY NOT NULL,
	"type" "staffType" NOT NULL,
	"personUid" varchar NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	CONSTRAINT "Staff_personUid_unique" UNIQUE("personUid")
);
--> statement-breakpoint
ALTER TABLE "Staff" ADD CONSTRAINT "Staff_personUid_Person_uid_fk" FOREIGN KEY ("personUid") REFERENCES "public"."Person"("uid") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "type_idx" ON "Staff" USING btree ("type");