import { errorHandler } from "../utils/error.js";
import { createObjectKey, uploadObjectToR2 } from "../utils/r2.js";

export const uploadImage = async (req, res, next) => {
  const fileName = req.headers["x-file-name"];
  const folder = req.headers["x-upload-folder"] || "uploads";
  const contentType = req.headers["content-type"];

  if (!fileName || !contentType) {
    return next(errorHandler(400, "fileName and contentType are required"));
  }

  if (!contentType.startsWith("image/")) {
    return next(errorHandler(400, "Only image uploads are allowed"));
  }

  if (!req.body || !Buffer.isBuffer(req.body) || req.body.length === 0) {
    return next(errorHandler(400, "Image file is required"));
  }

  try {
    const key = createObjectKey({
      folder,
      fileName,
    });
    const publicUrl = await uploadObjectToR2({
      key,
      contentType,
      body: req.body,
    });

    res.status(200).json({
      publicUrl,
      key,
    });
  } catch (error) {
    next(error);
  }
};
