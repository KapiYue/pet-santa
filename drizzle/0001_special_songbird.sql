CREATE TABLE "payment" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"stripeSessionId" text NOT NULL,
	"stripePaymentIntentId" text,
	"amount" integer NOT NULL,
	"currency" text DEFAULT 'usd' NOT NULL,
	"credits" integer NOT NULL,
	"status" text DEFAULT 'completed' NOT NULL,
	"createdAt" timestamp DEFAULT now(),
	CONSTRAINT "payment_stripeSessionId_unique" UNIQUE("stripeSessionId")
);
--> statement-breakpoint
ALTER TABLE "payment" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "credit_transaction" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"type" text NOT NULL,
	"amount" integer NOT NULL,
	"balanceAfter" integer NOT NULL,
	"description" text,
	"paymentId" text,
	"createdAt" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "credit_transaction" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "credits" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "payment" ADD CONSTRAINT "payment_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "credit_transaction" ADD CONSTRAINT "credit_transaction_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;