import { pgTable, text, serial, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const moods = pgTable("moods", {
  id: serial("id").primaryKey(),
  mood: text("mood").notNull(),
  recommendations: jsonb("recommendations").notNull(), // Stores array of { type, name, description }
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertMoodSchema = createInsertSchema(moods).omit({ 
  id: true, 
  createdAt: true 
});

export type Mood = typeof moods.$inferSelect;
export type InsertMood = z.infer<typeof insertMoodSchema>;

export type RecommendationItem = {
  type: 'song' | 'artist' | 'genre';
  name: string;
  description: string;
};

export type RecommendResponse = {
  mood: string;
  recommendations: RecommendationItem[];
};
