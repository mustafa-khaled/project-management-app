import dotenv from "dotenv";
import app from "./app";
import logger from "./utils/logger";
import connectDB from "./config/database";
import { config } from "./config/app.config";
import "./config/passport.config";

dotenv.config();

const port = config.PORT;

// Connect to Database
connectDB();

const server = app.listen(port, () => {
  logger.info(`Listening to port ${port}`);
});

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info("Server closed");
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error: unknown) => {
  logger.error(error);
  exitHandler();
};

process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);

process.on("SIGTERM", () => {
  logger.info("SIGTERM received");
  if (server) {
    server.close();
  }
});
