import { Router } from "express";
import ProductRouter from "../routes/ProductsRouter.js";
import CategoryRouter from "../routes/CategoryRouter.js";
import userRouter from "../routes/userRouter.js";
import { checkAuth } from "../middleware/checkAuth.js";
import cartRouter from "../routes/CartRouter.js";
import express from "express";

const authRouter = Router();

authRouter.use("/products", ProductRouter);
authRouter.use("/categories", CategoryRouter);
authRouter.use("/", userRouter);
authRouter.use("/carts", checkAuth, cartRouter);

export default authRouter;
