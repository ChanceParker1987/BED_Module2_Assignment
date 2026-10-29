import express, { Express } from "express";
import morgan from "morgan";
import ticketRoutes from "./api/v1/routes/ticketRoutes"

const app: Express = express();

// Interface for health check response - defines the structure of our response object
interface HealthCheckResponse {
  status: string;
  uptime: number;
  timestamp: string;
  version: string;
}

// Middleware for logging HTTP requests
app.use(morgan("combined"));

// Middleware for parsing JSON
app.use(express.json());

// Basic routes
app.get("/", (req, res) => {
  res.send("Hello World!");
});

/**
 * Health check endpoint that returns server status information
 * @returns JSON response with server health metrics
 */
app.get("/api/v1/health", (req, res) => {
  const healthData: HealthCheckResponse = {
    status: "OK",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  };

  res.json(healthData);
});

// Modular route for tickets
app.use("/api/v1/tickets", ticketRoutes);

export default app;

