import type { Request, Response, NextFunction } from "express";

export const errorLogger = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  console.error(`[ERROR] ${req.method} ${req.originalUrl}`, {
    message: error.message,
    stack: error.stack,
  });

  next(error);
};
