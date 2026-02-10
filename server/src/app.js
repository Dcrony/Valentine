import express from "express";
import cors from "cors";
import valentineRoutes from "./routes/valentineRoutes.js";
import path from "path";
import { fileURLToPath } from "url";

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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "../../valantine/dist")));

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get(/(.*)/, (req, res) => {
  res.sendFile(path.join(__dirname, "../../valantine/dist/index.html"));
});

export default app;