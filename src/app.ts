import express from "express";
import { errorHandler } from "./middleware/error_handler";
import { router } from "./routes";
import { uploadsDirectory } from "./middleware/upload_middleware";

const app = express();

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,POST,PATCH,PUT,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, x-user-id");

  if (req.method === "OPTIONS") {
    res.sendStatus(204);
    return;
  }

  next();
});

app.use(express.json());
app.use("/uploads", express.static(uploadsDirectory));

app.get("/health", (_req, res) => {
  res.json({
    status: "ok"
  });
});

app.use("/api", router);
app.use(errorHandler);

export { app };
