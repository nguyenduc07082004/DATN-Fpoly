import { Router } from "express";
import ProductRouter from "./ProductsRouter.js";
import CategoryRouter from "./CategoryRouter.js";
import userRouter from "./userRouter.js";
import { checkAuth } from "../middleware/checkAuth.js";
import cartRouter from "./CartRouter.js";
import OrderRouter from "./OrderRouter.js"; 
import CommentRouter from "./CommentRouter.js"
import ReplyRouter from "./ReplyRouter.js"
import router from "./Payment.js";
import DashboardRouter from "./DashboardRouter.js";
const authRouter = Router();

authRouter.use("/products", ProductRouter);
authRouter.use("/categories", CategoryRouter);
authRouter.use("/", userRouter);
authRouter.use("/carts", checkAuth, cartRouter);
authRouter.use("/orders", checkAuth, OrderRouter);
authRouter.use("/vnpay", checkAuth, router);
authRouter.use("/comments" , CommentRouter)
authRouter.use("/replies" , ReplyRouter)
authRouter.use('/dashboard' , DashboardRouter)

export default authRouter;
