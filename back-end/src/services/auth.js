const express = require("express");
const productsRouter = require("../routes/ProductsRouter.js");
const categoryRouter = require("../routes/CategoryRouter.js");
const userRouter = require("../routes/UserRouter.js");

const authRouter = (app) => {
  app.use(express.json());
  app.use("/products", productsRouter);
  app.use("/categories", categoryRouter);
  app.use("/users", userRouter);
};
module.exports = authRouter;
