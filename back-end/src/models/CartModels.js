import { Schema, model } from "mongoose";

const cartSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    products: [
      {
        product: { type: Schema.Types.ObjectId, ref: "Product" },
        quantity: Number,
      },
    ],
    totalPrice: Number,
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default model("Cart", cartSchema);
