import { errorHandler } from "../utils/error.js";
import Media from "../models/media.model.js";
import { createObjectKey, uploadObjectToR2 } from "../utils/r2.js";

const MAX_UPLOAD_SIZE_BYTES = 100 * 1024 * 1024;

const fallbackContentTypes = {
  avif: { contentType: "image/avif", mediaType: "image" },
  gif: { contentType: "image/gif", mediaType: "image" },
  jpeg: { contentType: "image/jpeg", mediaType: "image" },
  jpg: { contentType: "image/jpeg", mediaType: "image" },
  mov: { contentType: "video/quicktime", mediaType: "video" },
  mp4: { contentType: "video/mp4", mediaType: "video" },
  png: { contentType: "image/png", mediaType: "image" },
  svg: { contentType: "image/svg+xml", mediaType: "image" },
  webm: { contentType: "video/webm", mediaType: "video" },
  webp: { contentType: "image/webp", mediaType: "image" },
};

const getMediaMetadata = ({ contentType = "", fileName = "" }) => {
  const normalizedContentType = contentType.split(";")[0].trim().toLowerCase();

  if (normalizedContentType.startsWith("image/")) {
    return {
      contentType: normalizedContentType,
      mediaType: "image",
    };
  }

  if (normalizedContentType.startsWith("video/")) {
    return {
      contentType: normalizedContentType,
      mediaType: "video",
    };
  }

  const extension = fileName.split(".").pop()?.toLowerCase();
  return fallbackContentTypes[extension];
};

export const uploadMedia = async (req, res, next) => {
  const fileName = req.headers["x-file-name"];
  const folder = req.headers["x-upload-folder"] || "uploads";
  const contentType = req.headers["content-type"];

  if (!fileName || !contentType) {
    return next(errorHandler(400, "fileName and contentType are required"));
  }

  const mediaMetadata = getMediaMetadata({ contentType, fileName });

  if (!mediaMetadata) {
    return next(errorHandler(400, "Only image and video uploads are allowed"));
  }

  if (!req.body || !Buffer.isBuffer(req.body) || req.body.length === 0) {
    return next(errorHandler(400, "Media file is required"));
  }

  if (req.body.length > MAX_UPLOAD_SIZE_BYTES) {
    return next(errorHandler(413, "Each upload must be 100MB or smaller"));
  }

  try {
    const key = createObjectKey({
      folder,
      fileName,
    });
    const publicUrl = await uploadObjectToR2({
      key,
      contentType: mediaMetadata.contentType,
      body: req.body,
    });
    const media = await Media.create({
      url: publicUrl,
      key,
      name: fileName,
      contentType: mediaMetadata.contentType,
      mediaType: mediaMetadata.mediaType,
      folder,
      size: req.body.length,
      uploadedBy: req.user.id,
    });

    res.status(200).json({
      publicUrl,
      key,
      media,
    });
  } catch (error) {
    next(error);
  }
};

export const uploadImage = uploadMedia;
