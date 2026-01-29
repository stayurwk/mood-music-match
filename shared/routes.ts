import { z } from 'zod';
import { insertMoodSchema, moods } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  recommend: {
    create: {
      method: 'POST' as const,
      path: '/api/recommend',
      input: z.object({
        mood: z.string().min(1, "Mood cannot be empty"),
      }),
      responses: {
        200: z.object({
          mood: z.string(),
          recommendations: z.array(z.object({
            type: z.enum(['song', 'artist', 'genre']),
            name: z.string(),
            description: z.string(),
          })),
        }),
        400: errorSchemas.validation,
        500: errorSchemas.internal,
      },
    },
  },
  history: {
    list: {
      method: 'GET' as const,
      path: '/api/history',
      responses: {
        200: z.array(z.custom<typeof moods.$inferSelect>()),
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}

export type RecommendInput = z.infer<typeof api.recommend.create.input>;
export type RecommendResponse = z.infer<typeof api.recommend.create.responses[200]>;
