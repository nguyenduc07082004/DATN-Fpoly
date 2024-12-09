import { Schema, model } from "mongoose";

const voucherSchema = new Schema({
  code: { type: String, required: true, unique: true },
  discount: { type: Number, required: true },
  expiration_date: { type: Date, required: true },
  is_used: { type: Boolean, default: false },
  user_id: { type: Schema.Types.ObjectId, ref: 'User' },
  min_order_value: { type: Number, required: true }, // Đơn tối thiểu
  max_discount_amount: { type: Number, required: true }, // Giới hạn giảm tối đa
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

voucherSchema.pre('save', function(next) {
  this.updated_at = Date.now();
  next();
});

voucherSchema.set('timestamps', true);  // Sử dụng timestamps tự động

export default model("Voucher", voucherSchema);
