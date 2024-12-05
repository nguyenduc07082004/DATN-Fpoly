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
import InvoiceRouter from "./InvoiceRouter.js";
import VoucherRouter from "./VoucherRouter.js"
const authRouter = Router();

authRouter.use("/products", ProductRouter);
authRouter.use("/categories", CategoryRouter);
authRouter.use("/", userRouter);
authRouter.use("/carts", checkAuth, cartRouter);
authRouter.use("/orders", checkAuth, OrderRouter);
authRouter.use("/vnpay", router);
authRouter.use("/comments" , CommentRouter) 
authRouter.use("/replies" , ReplyRouter)
authRouter.use('/dashboard' , DashboardRouter)
authRouter.use('/invoice' , InvoiceRouter)
authRouter.use('/vouchers' , VoucherRouter)

export default authRouter;
