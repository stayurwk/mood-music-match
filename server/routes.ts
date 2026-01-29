import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import OpenAI from "openai";
import { type RecommendationItem } from "@shared/schema";

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.post(api.recommend.create.path, async (req, res) => {
    try {
      const { mood } = api.recommend.create.input.parse(req.body);

      const response = await openai.chat.completions.create({
        model: "gpt-5.2",
        messages: [
          {
            role: "system",
            content: `You are a music connoisseur. Based on the user's mood, recommend 5 items (songs, artists, or genres).
            Return a JSON object with a "recommendations" array. Each item must have:
            - type: "song", "artist", or "genre"
            - name: string
            - description: string (why it matches the mood)
            
            Example JSON:
            {
              "recommendations": [
                { "type": "song", "name": "Weightless by Marconi Union", "description": "Perfect for high stress." }
              ]
            }
            Only return JSON.`,
          },
          {
            role: "user",
            content: `I am feeling: ${mood}`,
          },
        ],
        response_format: { type: "json_object" },
      });

      const content = response.choices[0].message.content || "{}";
      const result = JSON.parse(content);
      const recommendations: RecommendationItem[] = result.recommendations || [];

      // Store in DB
      await storage.createMood({
        mood,
        recommendations,
      });

      res.json({ mood, recommendations });
    } catch (err) {
      console.error(err);
      if (err instanceof z.ZodError) {
        res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      } else {
        res.status(500).json({ message: "Failed to generate recommendations" });
      }
    }
  });

  app.get(api.history.list.path, async (req, res) => {
    const history = await storage.getMoods();
    res.json(history);
  });

  return httpServer;
}
