import type { VercelRequest, VercelResponse } from "@vercel/node";
import type { Request, Response } from "express";
import app from "../src/app";
import { connectDatabase } from "../src/config/database";

const handleExpressRequest = (req: VercelRequest, res: VercelResponse): void => {
  app(req as VercelRequest & Request, res as VercelResponse & Response);
};

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
): Promise<void> {
  if (req.method === "OPTIONS") {
    handleExpressRequest(req, res);
    return;
  }

  try {
    await connectDatabase();
    handleExpressRequest(req, res);
  } catch (error) {
    console.error("Serverless API initialization failed:", error);
    res.status(503).json({ message: "Servicio temporalmente no disponible." });
  }
}
