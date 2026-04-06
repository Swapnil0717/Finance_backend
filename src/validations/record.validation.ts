import { z } from "zod";

// CREATE
export const createRecordSchema = {
  body: z.object({
    userId: z.string().uuid().optional(), //  admin only

    amount: z
      .number({ invalid_type_error: "Amount must be a number" })
      .positive("Amount must be greater than 0"),

    type: z.enum(["INCOME", "EXPENSE"]),

    category: z.string().min(1).max(100),

    note: z.string().max(500).optional(),

    date: z.coerce.date(),
  }),
};

// UPDATE
export const updateRecordSchema = {
  params: z.object({
    id: z.string().uuid(),
  }),
  body: z.object({
    amount: z.number().positive().optional(),
    type: z.enum(["INCOME", "EXPENSE"]).optional(),
    category: z.string().min(1).max(100).optional(),
    note: z.string().max(500).optional(),
    date: z.coerce.date().optional(),
  }),
};

// GET ALL
export const getRecordsSchema = {
  query: z.object({
    userId: z.string().uuid().optional(), 
    type: z.enum(["INCOME", "EXPENSE"]).optional(),
    category: z.string().optional(),
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),

    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(10),
  }),
};

// GET ONE / DELETE
export const recordIdSchema = {
  params: z.object({
    id: z.string().uuid(),
  }),
};