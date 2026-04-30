import express from "express";
import { getMedia } from "../controllers/media.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.get("/", verifyToken, getMedia);

export default router;
