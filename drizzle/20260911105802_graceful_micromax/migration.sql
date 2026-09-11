CREATE TYPE "user_role" AS ENUM('admin', 'customer');--> statement-breakpoint
CREATE TABLE "users" (
	"user_id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"username" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL UNIQUE,
	"password" varchar(255) NOT NULL,
	"role" "user_role" DEFAULT 'customer'::"user_role" NOT NULL,
	"is_verified" boolean DEFAULT false,
	"hashedEmailVerificationToken" varchar,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
