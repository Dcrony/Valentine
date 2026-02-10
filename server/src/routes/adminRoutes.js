import express from "express";
import Valentine from "../models/valentine.js";

const router = express.Router();

// Middleware to check for basic authentication or secret key if needed
router.use((req, res, next) => {
  const adminKey = req.headers['x-admin-key'];
  if (!adminKey || adminKey !== (process.env.ADMIN_KEY || 'mysecretadminpass')) {
    return res.status(403).json({ error: "Unauthorized" });
  }
  next();
});

router.get("/users", async (req, res) => {
  try {
    const users = await Valentine.find({}, "senderName receiverName response respondedAt createdAt linkId");
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

export default router;
