import Media from "../models/media.model.js";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";

export const getMedia = async (req, res, next) => {
  try {
    const currentUser = await User.findById(req.user.id).select("isAdmin");

    if (!currentUser?.isAdmin) {
      return next(errorHandler(403, "You are not allowed to view media"));
    }

    const limit = Math.min(parseInt(req.query.limit, 10) || 60, 100);
    const mediaType = req.query.type;
    const filter = ["image", "video"].includes(mediaType)
      ? { mediaType }
      : {};

    const media = await Media.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit);

    res.status(200).json({ media });
  } catch (error) {
    next(error);
  }
};
