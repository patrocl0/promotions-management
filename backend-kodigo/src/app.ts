import express from "express";
import cors from "cors";

import productRouter from "./routes/product.routes";
import promotionRouter from "./routes/promotion.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/products", productRouter);
app.use("/api/promotions", promotionRouter);

app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
  });
});

export default app;
