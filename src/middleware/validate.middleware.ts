import { Request, Response, NextFunction } from "express";
import { ZodError, AnyZodObject } from "zod";

type Schema = {
  body?: AnyZodObject;
  query?: AnyZodObject;
  params?: AnyZodObject;
};

export const validate =
  (schema: Schema) =>
  (req: Request, _res: Response, next: NextFunction) => {
    try {
      // ✅ BODY (safe to override)
      if (schema.body) {
        req.body = schema.body.parse(req.body);
      }

      // ❗ QUERY (DO NOT REASSIGN)
      if (schema.query) {
        const parsedQuery = schema.query.parse(req.query);

        // mutate instead of replace
        Object.assign(req.query, parsedQuery);
      }

      // ❗ PARAMS (better to mutate too)
      if (schema.params) {
        const parsedParams = schema.params.parse(req.params);

        Object.assign(req.params, parsedParams);
      }

      next();
    } catch (err) {
      if (err instanceof ZodError) {
        return next({
          statusCode: 400,
          message: "Validation failed",
          errors:
            err.errors?.map((e) => ({
              field: e.path.join("."),
              message: e.message,
            })) || [],
        });
      }

      next(err);
    }
  };