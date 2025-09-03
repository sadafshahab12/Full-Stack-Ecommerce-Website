import express from "express";
import { verifyToken } from "../middleware/authMiddlerware.js";
const protectedRouter = express.Router();

protectedRouter.get("/dashboard", verifyToken, (req, res) => {
  res.json({ message: "Welcome to Dashboard", user: req.user });
});
export { protectedRouter };
