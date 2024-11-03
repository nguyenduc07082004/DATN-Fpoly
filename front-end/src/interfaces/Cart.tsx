export interface Cart {
  _id: string; // ID của giỏ hàng
  userId: string; // ID của người dùng
  items: CartItem[]; // Danh sách các sản phẩm trong giỏ hàng
  totalPrice: number; // Tổng giá của giỏ hàng
  createdAt: Date; // Ngày tạo giỏ hàng
  updatedAt: Date; // Ngày cập nhật giỏ hàng
}

export interface CartItem {
  productId: string; // ID của sản phẩm
  title: string; // Tên sản phẩm
  price: number; // Giá sản phẩm
  image: string; // Hình ảnh sản phẩm
  quantity: number; // Số lượng sản phẩm trong giỏ
  storage: string; // Thông tin lưu trữ
  color: string; // Màu sắc sản phẩm
}
