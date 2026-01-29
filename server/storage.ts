import { db } from "./db";
import { moods, type InsertMood, type Mood } from "@shared/schema";
import { desc } from "drizzle-orm";

export interface IStorage {
  createMood(mood: InsertMood): Promise<Mood>;
  getMoods(): Promise<Mood[]>;
}

export class DatabaseStorage implements IStorage {
  async createMood(insertMood: InsertMood): Promise<Mood> {
    const [mood] = await db.insert(moods).values(insertMood).returning();
    return mood;
  }

  async getMoods(): Promise<Mood[]> {
    return db.select().from(moods).orderBy(desc(moods.createdAt));
  }
}

export const storage = new DatabaseStorage();
