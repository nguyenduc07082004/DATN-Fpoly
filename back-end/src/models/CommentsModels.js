import {Schema , model} from "mongoose";
const CommentSchema = new Schema(
  {
    productId: { 
      type: Schema.Types.ObjectId, 
      ref: "Product", 
      required: true 
    },
    userId: { 
      type: Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    rating: { 
      type: Number, 
      required: false, 
      min: 1, 
      max: 5 
    }, 
    comment: { 
      type: String, 
      required: true 
    },
    createdAt: { 
      type: Date, 
      default: Date.now 
    },
  },
  { timestamps: true }
);

export default model("Comments", CommentSchema);