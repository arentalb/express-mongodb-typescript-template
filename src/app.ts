import express from "express";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";
import routes from "./routes";
import GlobalErrorHandler from "./utils/AppErrorHandler";
import morgan from "morgan";

dotenv.config();

const app = express();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: "10kb" }));

const imagesPath = path.join(__dirname, "public", "images");
app.use(
  "/public/images",
  (req, res, next) => {
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    next();
  },
  express.static(imagesPath),
);

app.get("/test", (req, res, next) => {
  res.send("server is running");
});

app.use("/api/v1", routes);

app.use(GlobalErrorHandler);

export default app;
