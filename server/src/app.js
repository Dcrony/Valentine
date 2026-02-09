import express from "express";
import cors from "cors";
import valentineRoutes from "./routes/valentineRoutes.js";

const app = express();

// Allow all origins (use only for development/testing)
app.use(cors({
  origin: true, // Allow any origin
  credentials: true, // Allow cookies
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

app.use(express.json());
app.use("/api/valentine", valentineRoutes);

export default app;