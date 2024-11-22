import { Router } from "express";
import ProductRouter from "./ProductsRouter.js";
import CategoryRouter from "./CategoryRouter.js";
import userRouter from "./userRouter.js";
import { checkAuth } from "../middleware/checkAuth.js";
import cartRouter from "./CartRouter.js";
import OrderRouter from "./OrderRouter.js"; // Import OrderRouter
import express from "express";
import router from "./Payment.js";

const authRouter = Router();

authRouter.use("/products", ProductRouter);
authRouter.use("/categories", CategoryRouter);
authRouter.use("/", userRouter);
authRouter.use("/carts", checkAuth, cartRouter);
authRouter.use("/orders", checkAuth, OrderRouter);
authRouter.use("/vnpay", checkAuth, router);

export default authRouter;
