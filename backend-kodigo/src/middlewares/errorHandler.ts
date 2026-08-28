import type { Request, Response, NextFunction } from "express";

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  console.error(error);

  if (res.headersSent) {
    next(error);
    return;
  }

  res.status(500).json({
    message: "Error interno del servidor",
  });
};
