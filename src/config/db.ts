import mongoose from "mongoose";
import config from ".";

export const connectDB = async () => {
  try {
    await mongoose.connect(config.mongodb_uri || "");
    console.log(`MongoDB Connected Successfully!`);
  } catch (error) {
    console.error(`Error: ${(error as Error).message}`);
    process.exit(1);
  }
};
