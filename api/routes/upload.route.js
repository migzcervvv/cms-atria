import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import { uploadImage, uploadMedia } from "../controllers/upload.controller.js";

const router = express.Router();

router.post(
  "/image",
  verifyToken,
  express.raw({ type: "image/*", limit: "100mb" }),
  uploadImage
);
router.post(
  "/media",
  verifyToken,
  express.raw({
    type: ["image/*", "video/*", "application/octet-stream"],
    limit: "100mb",
  }),
  uploadMedia
);

export default router;
