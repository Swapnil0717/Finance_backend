import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

export const errorMiddleware = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";
  let errors = null;

  // ✅ ZOD ERROR
  if (err instanceof ZodError) {
    statusCode = 400;
    message = "Validation failed";

    errors = err.errors?.map((e) => ({
      field: e.path.join("."),
      message: e.message,
    })) || [];
  }

  // ✅ CUSTOM ERROR WITH errors FIELD
  else if (err.errors) {
    errors = Array.isArray(err.errors)
      ? err.errors
      : [{ message: err.errors }];
  }

  // ✅ GENERIC ERROR (VERY IMPORTANT FIX)
  else {
    errors = null; // DO NOT try to map
  }

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