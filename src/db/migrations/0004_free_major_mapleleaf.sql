ALTER TABLE "lead_magnets" DROP CONSTRAINT "lead_magnets_project_id_projects_id_fk";
--> statement-breakpoint
DROP INDEX "lead_magnets_project_id_idx";--> statement-breakpoint
ALTER TABLE "lead_magnets" DROP COLUMN "project_id";