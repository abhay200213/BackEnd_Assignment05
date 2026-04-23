import express from "express";
import cors from "cors";
import eventRoutes from "./api/v1/routes/eventRoutes";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/v1/health", (_req, res) => {
  res.status(200).json({
    status: "OK",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  });
});

app.use("/api/v1/events", eventRoutes);

export default app;
