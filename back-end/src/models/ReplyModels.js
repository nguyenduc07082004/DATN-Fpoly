import { Schema, model } from "mongoose";

const ReplySchema = new Schema(
  {
    commentId: { 
      type: Schema.Types.ObjectId, 
      ref: "Comment", 
      required: true 
    },
    userId: { 
      type: Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    reply: { 
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

export default model("Reply", ReplySchema);
