import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

type ErrorResponse = {
  statusCode?: number;
  message?: string;
  errors?: any;
};

export const errorMiddleware = (
  err: ErrorResponse,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";
  let errors = err.errors || null;

  //  Zod Validation Error
  if (err instanceof ZodError) {
    statusCode = 400;
    message = "Validation failed";
    errors = err.errors.map((e) => ({
      field: e.path.join("."),
      message: e.message,
    }));
  }

  // Prisma Errors (basic handling)
  if ((err as any).code) {
    const prismaError = err as any;

    // Unique constraint
    if (prismaError.code === "P2002") {
      statusCode = 409;
      message = "Duplicate field value";
      errors = prismaError.meta;
    }

    // Record not found
    if (prismaError.code === "P2025") {
      statusCode = 404;
      message = "Record not found";
    }
  }

  // Fallback logging (you can replace with Winston later)
  console.error("ERROR:", {
    message,
    statusCode,
    errors,
  });

  return res.status(statusCode).json({
    success: false,
    message,
    ...(errors && { errors }),
  });
};