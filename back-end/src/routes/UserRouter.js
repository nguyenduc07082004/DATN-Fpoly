// routes/productRoutes.js
import { Router } from "express";
const UserRouter = Router();
import {
  register,
  login,
  getUser,
  getUserById,
  getCurrentUser,
} from "../controllers/UserControllers.js";
import { verifyToken } from "../middleware/authMiddleware.js";

UserRouter.post("/register", register);
UserRouter.post("/login", login);

// router.use(checkAuth, checkIsAdmin);
UserRouter.get("/users", getUser);
UserRouter.get("/users/:id", getUserById);

UserRouter.get("/me", verifyToken, getCurrentUser);

export default UserRouter;
