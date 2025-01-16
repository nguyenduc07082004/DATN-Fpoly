import { Schema, model } from "mongoose";

const invoiceSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User", 
      required: true,
    },
    orderId: {
      type: Schema.Types.ObjectId,
      ref: "Order", 
      required: true,
    },
    orderItems: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product", 
        },
        variantId: {
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        storage: {
          type: String,
          required: true,
        },
        color: {
          type: String,
          required: true,
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default model("Invoice", invoiceSchema);
