import { Schema, model } from "mongoose";

const voucherSchema = new Schema({
  code: { type: String, required: true, unique: true },  // Mã voucher
  discount: { type: Number, required: true },  // Giá trị giảm giá (ví dụ: 20%)
  expiration_date: { type: Date, required: true },  // Hạn sử dụng
  is_used: { type: Boolean, default: false },  // Trạng thái sử dụng
  user_id: { type: Schema.Types.ObjectId, ref: 'User' },  // Người dùng nhận voucher, nếu cần
  created_at: { type: Date, default: Date.now },  // Thời gian tạo voucher
  updated_at: { type: Date, default: Date.now },  // Thời gian cập nhật voucher
});

voucherSchema.pre('save', function(next) {
  this.updated_at = Date.now();
  next();
});

voucherSchema.set('timestamps', true);  // Sử dụng timestamps tự động

export default model("Voucher", voucherSchema);
