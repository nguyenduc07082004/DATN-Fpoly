const express = require("express");
const productsRouter= require("../routes/ProductsRouter.js");
const categoryRouter=require("../routes/CategoryRouter.js");
const userRouter=require("../routes/UserRouter.js");
const loginRouter=require("../routes/Login.js");


const authRouter=(app)=>{
    app.use(express.json());
    app.use('/products',productsRouter);
    app.use('/categories',categoryRouter);
    app.use('/users',userRouter);
    app.use('/',loginRouter);

}
module.exports=authRouter;