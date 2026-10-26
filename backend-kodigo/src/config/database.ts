import mongoose from "mongoose";

let connectionPromise: Promise<typeof mongoose> | null = null;

export const connectDatabase = async (): Promise<void> => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error("MONGO_URI environment variable is required");
  }

  if (mongoose.connection.readyState === 1) {
    return;
  }

  try {
    connectionPromise ??= mongoose
      .connect(mongoUri)
      .then((connection) => {
        console.log("MongoDB connected successfully");
        return connection;
      })
      .catch((error: unknown) => {
        connectionPromise = null;
        throw error;
      });
    await connectionPromise;
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
};
