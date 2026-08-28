import express from "express";
import cors from "cors";

import productRouter from "./routes/product.routes";
import promotionRouter from "./routes/promotion.routes";
import { requestLogger } from "./middlewares/requestLogger";
import { errorLogger } from "./middlewares/errorLogger";
import { errorHandler } from "./middlewares/errorHandler";

const app = express();

app.use(cors());
app.use(express.json());

app.use(requestLogger);

app.use("/api/products", productRouter);
app.use("/api/promotions", promotionRouter);

app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
  });
});

app.use(errorLogger);
app.use(errorHandler);

export default app;
