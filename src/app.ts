import express from "express";
import cors from "cors";
import helmet from "helmet";
import eventRoutes from "./api/v1/routes/eventRoutes";

const app = express();

/**
 * Helmet Security Configuration (custom for API)
 */
app.use(
  helmet({
    contentSecurityPolicy: false, // API doesn't serve HTML
    crossOriginEmbedderPolicy: false, // avoids issues with tools like Swagger later
    frameguard: { action: "deny" }, // prevents clickjacking
    referrerPolicy: { policy: "no-referrer" }, // hides referrer info
    hsts: {
      maxAge: 31536000, // 1 year
      includeSubDomains: true,
    },
    noSniff: true, // prevents MIME sniffing
    hidePoweredBy: true, // removes X-Powered-By
  })
);

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