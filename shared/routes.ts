
import { z } from 'zod';
import { insertMessageSchema, chatRequestSchema, chatResponseSchema, messages } from './schema';

export const api = {
  chat: {
    send: {
      method: 'POST' as const,
      path: '/api/chat' as const,
      input: chatRequestSchema,
      responses: {
        200: chatResponseSchema,
        500: z.object({ message: z.string() }),
      },
    },
    history: {
      method: 'GET' as const,
      path: '/api/history' as const,
      responses: {
        200: z.array(z.custom<typeof messages.$inferSelect>()),
      },
    },
  },
};

// Only keeping the required buildUrl helper
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
