import { Response } from "express";

type Meta = {
  total?: number;
  page?: number;
  limit?: number;
};

type ResponseOptions<T> = {
  statusCode: number;
  success: boolean;
  message: string;
  data?: T | null;
  meta?: Meta;
};

export function sendResponse<T>(
  res: Response,
  options: ResponseOptions<T>
) {
  const { statusCode, success, message, data, meta } = options;

  return res.status(statusCode).json({
    success,
    message,
    ...(meta && { meta }),
    ...(data !== undefined && { data }),
  });
}