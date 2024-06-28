import winston from "winston";
import "winston-daily-rotate-file";
import path from "path";

const logDir = "logs";

const dailyRotateFileFormat = winston.format.printf(
  ({ level, message, timestamp, service }) => {
    return `${timestamp} [${service}] ${level}: ${message}`;
  },
);

const dailyRotateFileTransport = new winston.transports.DailyRotateFile({
  filename: path.join(logDir, "%DATE%-results.log"),
  datePattern: "YYYY-MM-DD",
  zippedArchive: true,
  maxSize: "20m",
  maxFiles: "14d",
  format: winston.format.combine(
    winston.format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    dailyRotateFileFormat,
  ),
});

const consoleFormat = winston.format.printf(
  ({ level, message, timestamp, service }) => {
    return `${timestamp} [${service}] ${level}: ${message}`;
  },
);

const createLogger = (serviceName = "default-service") => {
  return winston.createLogger({
    level: "info",
    format: winston.format.combine(
      winston.format.timestamp({
        format: "YYYY-MM-DD HH:mm:ss",
      }),
      winston.format.errors({ stack: true }),
      winston.format.splat(),
      winston.format.json(),
    ),
    defaultMeta: { service: serviceName },
    transports: [
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.timestamp({
            format: "YYYY-MM-DD HH:mm:ss",
          }),
          consoleFormat,
        ),
      }),
      dailyRotateFileTransport,
    ],
  });
};

export default createLogger;
