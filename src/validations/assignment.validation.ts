import { z } from "zod";

export const assignSchema = {
  body: z.object({
    analystId: z.string().uuid(),
    userId: z.string().uuid(),
  }),
};

export const removeSchema = {
  params: z.object({
    id: z.string().uuid(), 
  }),
};