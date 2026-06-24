-- Generation tasks for Kie.ai portrait pipeline
CREATE TABLE "generation_task" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"kieTaskId" text,
	"status" text DEFAULT 'pending' NOT NULL,
	"prompt" text NOT NULL,
	"outfitId" text,
	"backgroundId" text,
	"originalImageUrl" text NOT NULL,
	"generatedImageUrl" text,
	"creditsCost" integer DEFAULT 20 NOT NULL,
	"creditsDeducted" boolean DEFAULT false NOT NULL,
	"creditTransactionId" text,
	"failCode" text,
	"failMsg" text,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now(),
	"completedAt" timestamp
);
--> statement-breakpoint
ALTER TABLE "generation_task" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "generation_task" ADD CONSTRAINT "generation_task_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "credit_transaction" ADD COLUMN "generationTaskId" text;
