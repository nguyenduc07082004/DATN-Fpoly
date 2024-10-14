const express = require("express");
const productsRouter= require("./ProductsRouter.js");
const categoryRouter=require("./CategoryRouter.js");
const userRouter=require("./UserRouter");
const loginRouter=require("./Login");


const authRouter=(app)=>{
    app.use(express.json());
    app.use('/products',productsRouter);
    app.use('/categories',categoryRouter);
    app.use('/users',userRouter);
    app.use('/',loginRouter);

}
module.exports=authRouter;