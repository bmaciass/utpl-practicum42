CREATE TABLE "Actor" (
	"id" serial PRIMARY KEY NOT NULL,
	"uid" varchar(64) NOT NULL,
	CONSTRAINT "Actor_uid_unique" UNIQUE("uid")
);
--> statement-breakpoint
CREATE TABLE "Doctor" (
	"id" serial PRIMARY KEY NOT NULL,
	"personUid" varchar NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	CONSTRAINT "Doctor_personUid_unique" UNIQUE("personUid")
);
--> statement-breakpoint
CREATE TABLE "Nurse" (
	"id" serial PRIMARY KEY NOT NULL,
	"personUid" varchar NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	CONSTRAINT "Nurse_personUid_unique" UNIQUE("personUid")
);
--> statement-breakpoint
CREATE TABLE "Patient" (
	"id" serial PRIMARY KEY NOT NULL,
	"personUid" varchar NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	CONSTRAINT "Patient_personUid_unique" UNIQUE("personUid")
);
--> statement-breakpoint
CREATE TABLE "Person" (
	"id" serial PRIMARY KEY NOT NULL,
	"uid" varchar NOT NULL,
	"dni" varchar(15) NOT NULL,
	"firstName" varchar(64) NOT NULL,
	"lastName" varchar(64) NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	CONSTRAINT "Person_uid_unique" UNIQUE("uid"),
	CONSTRAINT "Person_dni_unique" UNIQUE("dni")
);
--> statement-breakpoint
CREATE TABLE "User" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(64) NOT NULL,
	"uid" varchar(64) NOT NULL,
	"personUid" varchar NOT NULL,
	"password" varchar(512) NOT NULL,
	"salt" varchar(512) NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	CONSTRAINT "User_name_unique" UNIQUE("name"),
	CONSTRAINT "User_uid_unique" UNIQUE("uid")
);
--> statement-breakpoint
ALTER TABLE "Doctor" ADD CONSTRAINT "Doctor_personUid_Person_uid_fk" FOREIGN KEY ("personUid") REFERENCES "public"."Person"("uid") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Nurse" ADD CONSTRAINT "Nurse_personUid_Person_uid_fk" FOREIGN KEY ("personUid") REFERENCES "public"."Person"("uid") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Patient" ADD CONSTRAINT "Patient_personUid_Person_uid_fk" FOREIGN KEY ("personUid") REFERENCES "public"."Person"("uid") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Person" ADD CONSTRAINT "Person_uid_Actor_uid_fk" FOREIGN KEY ("uid") REFERENCES "public"."Actor"("uid") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "User" ADD CONSTRAINT "User_personUid_Person_uid_fk" FOREIGN KEY ("personUid") REFERENCES "public"."Person"("uid") ON DELETE no action ON UPDATE no action;