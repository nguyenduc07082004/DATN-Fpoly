const express = require("express");
const productsRouter = require("../routes/ProductsRouter.js");
const categoryRouter = require("../routes/CategoryRouter.js");
const userRouter = require("../routes/UserRouter.js");
const cartRouter = require("../routes/CartRouter");

const authRouter = (app) => {
  app.use(express.json());
  app.use("/images", express.static("uploads"));
  app.use("/products", productsRouter);
  app.use("/categories", categoryRouter);
  app.use("/", userRouter);
  app.use("/carts", cartRouter);
};
module.exports = authRouter;
