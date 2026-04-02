import { ZodObject, ZodError, AnyZodObject } from "zod";
import { Request, Response, NextFunction } from "express";

type Schema = {
  body?: AnyZodObject;
  query?: AnyZodObject;
  params?: AnyZodObject;
};

export const validate =
  (schema: Schema) =>
  (req: Request, _res: Response, next: NextFunction) => {
    try {
      // Parse and overwrite request safely
      if (schema.body) {
        req.body = schema.body.parse(req.body);
      }

      if (schema.query) {
        req.query = schema.query.parse(req.query);
      }

      if (schema.params) {
        req.params = schema.params.parse(req.params);
      }

      next();
    } catch (err) {
      if (err instanceof ZodError) {
        return next({
          statusCode: 400,
          message: "Validation failed",
          errors: err.errors.map((e) => ({
            field: e.path.join("."),
            message: e.message,
          })),
        });
      }

      next(err);
    }
  };