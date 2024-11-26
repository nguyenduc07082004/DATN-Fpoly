import { errorMessages } from "../constants/errorMessages.js";

export const checkPermission = (roles) => (req, res, next) => {
  // roles: ["admin", "user"];
  const hashPermission = roles.some((role) => req.user.role.includes(role));
  if (!hashPermission) {
    return res.status(403).json({
      message: errorMessages.PERMISSION_DENIED,
    });
  }
  next();
};
