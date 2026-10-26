import "dotenv/config";
import mongoose from "mongoose";
import { connectDatabase } from "./config/database";
import { Product } from "./models/Product";
import { Promotion } from "./models/Promotion";

const seedDemo = async (): Promise<void> => {
  await connectDatabase();

  try {
    const [productCount, promotionCount] = await Promise.all([
      Product.countDocuments(),
      Promotion.countDocuments(),
    ]);

    if (productCount > 0 || promotionCount > 0) {
      throw new Error(
        "La carga de demostración solo se permite en una base de datos vacía.",
      );
    }

    const products = await Product.insertMany([
      { name: "Café de origen 340 g", category: "Alimentos" },
      { name: "Botella térmica 750 ml", category: "Hogar" },
      { name: "Kit de cuidado facial", category: "Belleza" },
    ]);

    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    const endOfCampaign = new Date(today);
    endOfCampaign.setUTCDate(endOfCampaign.getUTCDate() + 14);
    const scheduledStart = new Date(today);
    scheduledStart.setUTCDate(scheduledStart.getUTCDate() + 7);
    const scheduledEnd = new Date(scheduledStart);
    scheduledEnd.setUTCDate(scheduledEnd.getUTCDate() + 14);

    await Promotion.insertMany([
      {
        name: "Semana del café",
        targetType: "product",
        product: products[0]._id,
        discountType: "percentage",
        discountValue: 15,
        startDate: today,
        endDate: endOfCampaign,
        status: "activa",
      },
      {
        name: "Renueva tu espacio",
        targetType: "product",
        product: products[1]._id,
        discountType: "fixed",
        discountValue: 12000,
        startDate: scheduledStart,
        endDate: scheduledEnd,
        status: "programada",
      },
    ]);

    console.info("Demo data created: 3 products and 2 promotions.");
  } finally {
    await mongoose.disconnect();
  }
};

seedDemo().catch((error: unknown) => {
  console.error("Unable to seed demo data:", error);
  process.exitCode = 1;
});
