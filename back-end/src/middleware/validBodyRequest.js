import { errorMessages } from "../constants/message.js";

export const validBodyRequest = (schema) => async (req, res, next) => {
  try {
    const { error } = await schema.validateAsync(req.body, {
      abortEarly: false,
    });

    if (error) {
      const erorrs = error.details.map((item) => item.message);
      return res.status(400).json({
        message: errorMessages.INVALID_BODY_REQUEST,
        erorrs,
      });
    }
    next();
  } catch (error) {
    next(error);
  }
};
