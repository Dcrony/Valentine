import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import app from "./src/app.js";

dotenv.config();

const startServer = async () => {
  try {
    const PORT = process.env.PORT || 5001;

    // Start listening immediately
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Test URL: http://localhost:${PORT}/health`);
    });

    // Connect to DB in background
    console.log("Attempting to connect to MongoDB...");
    await connectDB();
    console.log("MongoDB connected successfully");

  } catch (error) {
    console.error("Failed to start server/DB:", error);
    // Don't exit process so server stays alive for debugging
  }
};

startServer();
