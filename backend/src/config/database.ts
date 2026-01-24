import mongoose from "mongoose";
import logger from "../utils/logger";

const connectDB = async () => {
  try {
    const mongoURI =
      process.env.DATABASE_URL || "mongodb://localhost:27017/management-app";

    await mongoose.connect(mongoURI);

    logger.info("MongoDB Connected Successfully");
  } catch (error) {
    logger.error(`Error: ${(error as Error).message}`);
    process.exit(1);
  }
};

export default connectDB;
