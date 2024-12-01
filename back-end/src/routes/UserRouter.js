// routes/productRoutes.js
import { Router } from "express";
const UserRouter = Router();
import {
  register,
  login,
  getUser,
  getUserById,
  getCurrentUser,
  logout , blockUser , 
  updateUser
} from "../controllers/UserControllers.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { checkAuth } from "../middleware/checkAuth.js";

UserRouter.post("/register", register);
UserRouter.post("/login", login);
UserRouter.post('/logout', checkAuth, logout);
UserRouter.post('/users/block', checkAuth, blockUser);

// router.use(checkAuth, checkIsAdmin);
UserRouter.get("/users", getUser);
UserRouter.get("/users/:id", getUserById);
UserRouter.get("/me", verifyToken, getCurrentUser);
UserRouter.put("/users/:id", updateUser);

export default UserRouter;
