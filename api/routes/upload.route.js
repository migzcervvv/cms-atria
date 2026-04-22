import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import { uploadImage } from "../controllers/upload.controller.js";

const router = express.Router();

router.post("/image", verifyToken, express.raw({ type: "image/*", limit: "10mb" }), uploadImage);

export default router;
