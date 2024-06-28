import dotenv from "dotenv";
import app from "./app";
import mongoose from "mongoose";
import createLogger from "./utils/logger"; // Import the logger factory

dotenv.config();

const logger = createLogger("server"); // Create a logger instance for the server

process.on("uncaughtException", (err: Error) => {
  logger.error("Uncaught Exception, Shutting down ...", err);
  process.exit(1);
});

const DB = process.env.DATABASE_URL!.replace(
  "<password>",
  process.env.DATABASE_PASSWORD!,
);

mongoose
  .connect(DB, {})
  .then(() => {
    logger.info("Connected to MongoDB");
  })
  .catch((err) => {
    logger.error("Error connecting to MongoDB:", err);
  });

const port = process.env.PORT || 6060;
const server = app.listen(port, () => {
  logger.info(`Server is running on port ${port}`);
});

process.on("unhandledRejection", (err: any) => {
  logger.error("Unhandled Rejection, Shutting down ...", err);
  server.close(() => {
    process.exit(1);
  });
});
