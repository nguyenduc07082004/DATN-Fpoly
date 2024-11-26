import { errorMessages } from "../constants/errorMessages.js";

export const checkIsAdmin = async (req, res, next) => {
  try {
    if (req?.user?.role !== "admin") {
      return res.status(400).json({
        message: errorMessages.PERMISSION_DENIED || "Permission denied",
      });
    }
    next();
  } catch (error) {
    next(error);
  }
};
