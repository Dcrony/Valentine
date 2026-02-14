import Valentine from "../models/valentine.js";
import { generateLinkId } from "../utils/generateId.js";

export const createValentine = async (req, res) => {
  try {
    const {
      senderName,
      receiverName,
      message,
      theme = "rose",
      music = "love.mp3",
      noButtonMode = "move",
      anonymous = false
    } = req.body;

    // Generate unique link ID
    const linkId = generateLinkId();

    // Set expiration date (7 days from now)
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    // Create the Valentine
    const valentine = await Valentine.create({
      linkId,
      senderName,
      receiverName,
      message: message || "Will you be my Valentine?",
      theme,
      music,
      noButtonMode,
      anonymous,
      expiresAt
    });

    // Return the response in the format your frontend expects
    res.status(201).json({
      success: true, // Frontend doesn't expect this
      publicLink: `${(process.env.FRONTEND_URL || 'http://localhost:3000').replace(/\/$/, '')}/val/${linkId}`,
      dashboardLink: `${(process.env.FRONTEND_URL || 'http://localhost:3000').replace(/\/$/, '')}/dashboard/${linkId}`
    });
  } catch (err) {
    console.error("Create Valentine Error:", err);
    res.status(500).json({
      error: "Failed to create valentine",
      details: err.message
    });
  }
};

export const getValentine = async (req, res) => {
  const { id } = req.params;

  const valentine = await Valentine.findOne({ linkId: id });

  if (!valentine) {
    return res.status(404).json({ error: "Link not found" });
  }

  if (valentine.expiresAt && valentine.expiresAt < new Date()) {
    return res.status(410).json({ error: "Link expired" });
  }

  res.json(valentine);
};

export const respondValentine = async (req, res) => {
  const { id, response } = req.body;

  if (!["yes", "no"].includes(response)) {
    return res.status(400).json({ error: "Invalid response" });
  }

  const valentine = await Valentine.findOne({ linkId: id });

  if (!valentine) {
    return res.status(404).json({ error: "Link not found" });
  }

  if (valentine.response !== "pending") {
    return res.status(409).json({ error: "Already answered" });
  }

  valentine.response = response;
  valentine.respondedAt = new Date();
  await valentine.save();

  res.json({ success: true, response });
};

export const dashboard = async (req, res) => {
  const { id } = req.params;

  const valentine = await Valentine.findOne({ linkId: id });

  if (!valentine) {
    return res.status(404).json({ error: "Not found" });
  }

  res.json({
    senderName: valentine.senderName,
    receiverName: valentine.receiverName,
    response: valentine.response,
    respondedAt: valentine.respondedAt
  });
};
