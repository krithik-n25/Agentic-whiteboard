import { boolean, integer, jsonb, pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { FREE_AI_CREDITS } from "../lib/plans";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  clerkId: text("clerk_id").notNull().unique(),
  name: text("name"),
  email: text("email"),
  // Monthly AI credits (1 per AI generation), see lib/plans.ts
  credits: integer('credits').default(FREE_AI_CREDITS),
  // When credits were last refilled. null = never, so the first check refills them.
  creditsResetAt: timestamp("credits_reset_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const Projects= pgTable("Projects",{
  id:serial("id").primaryKey(),
  projectId:varchar('project_id',).notNull().unique(),
 userEmail: varchar("email").notNull(),
 projectName:varchar('project_name',).notNull(),
  // Soft delete: archived projects stay in the DB but are hidden from the dashboard
  isDeleted:boolean('is_deleted').default(false).notNull(),
  createdAt:timestamp("created_at").defaultNow().notNull(),
  updatedAt:timestamp("updated_at").defaultNow().notNull(),
})

export const WhiteBoardContent= pgTable("WhiteBoardContent",{
  id:serial("id").primaryKey(),
  projectId:varchar('project_id',).references(()=>Projects.projectId).notNull().unique(),
  elements:jsonb('elements').notNull(),
  appState:jsonb('appState').notNull(),
  files:jsonb('files').notNull(),
  // Small low quality JPEG (base64 data URL) shown on the dashboard card
  previewImage:text('preview_image'),
  createdAt:timestamp("created_at").defaultNow().notNull(),
  updatedAt:timestamp("updated_at").defaultNow().notNull(),
  
 
})
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
