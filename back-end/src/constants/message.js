const messages = Object.freeze({
  en: {
    success: {
      REGISTER_SUCCESS: "Register successfully!",
      LOGIN_SUCCESS: "Login successfully!",
      CREATE_SUCCESS: "Create successfully!",
      DELETE_SUCCESS: "Delete successfully!",
      UPDATE_SUCCESS: "Update successfully!",
      GET_SUCCESS: "Get successfully!",
      LOGOUT_SUCCESS: "Logout successfully!",
      REFRESH_TOKEN_SUCCESS: "Refresh token successfully!",
      VERIFY_EMAIL_SUCCESS: "Verify email successfully!",
      FORGOT_PASSWORD_SUCCESS: "Forgot password successfully!",
      RESET_PASSWORD_SUCCESS: "Reset password successfully!",
      CHANGE_PASSWORD_SUCCESS: "Change password successfully!",
      UPDATE_PROFILE_SUCCESS: "Update profile successfully!",
      GET_PROFILE_SUCCESS: "Get profile successfully!",
      GET_LIST_SUCCESS: "Get list successfully!",
      GET_DETAIL_SUCCESS: "Get detail successfully!",
      CONNECT_DB_SUCCESS: "Connect database successfully!",
      BLOCK_SUCCESS: "Block user successfully!",
      UNBLOCK_SUCCESS: "Unblock user successfully!",
      UPDATE_STATUS_SUCCESS: "Update status successfully!",
      UPDATE_PROFILE_IMAGE_SUCCESS: "Update profile image successfully!",
      USER_ACTIVATION_SUCCESS: "User activated successfully!",
      USER_DEACTIVATION_SUCCESS: "User deactivated successfully!",
      ROLE_UPDATE_SUCCESS: "Role updated successfully!",
      COMMENTS_FETCHED: "Comments fetched successfully!",
      ADD_CATEGORY_SUCCESS: "Category added successfully!",
      PRODUCT_NOT_FOUND: "Product not found!",
      ADD_TO_CART_SUCCESS: "Added to cart successfully!",
      GET_CART_SUCCESS: "Fetched cart successfully!",
      REMOVE_CART_ITEM_SUCCESS: "Removed item from cart successfully!",
      GET_CATEGORY_SUCCESS: "Successfully retrieved category list",
      GET_CATEGORY_BY_ID_SUCCESS: "Successfully retrieved category",
      ADD_CATEGORY_SUCCESS: "Category added successfully",
      UPDATE_CATEGORY_SUCCESS: "Category updated successfully",
      DELETE_CATEGORY_SUCCESS: "Category deleted successfully",
    },
    error: {
      TOKEN_INVALID: "Token invalid!",
      CONNECT_DB_FAIL: "Connect database fail!",
      NOT_FOUND: "NOT FOUND",
      CREATE_FAIL: "Create fail!",
      DELETE_FAIL: "Delete fail!",
      UPDATE_FAIL: "Update fail!",
      GET_FAIL: "Get fail!",
      LOGIN_FAIL: "Login fail!",
      REGISTER_FAIL: "Register fail!",
      UNAUTHORIZED: "Unauthorized!",
      SERVER_ERROR: "Server error!",
      EMAIL_EXIST: "Email already exists!",
      USERNAME_EXIST: "Username already exists!",
      EMAIL_NOT_FOUND: "Email not found!",
      PASSWORD_NOT_MATCH: "Password not match!",
      INVALID_EMAIL: "Invalid email!",
      INVALID_PASSWORD: "Invalid password!",
      PERMISSION_DENIED: "Permission denied!",
      ACCOUNT_BLOCKED: "Your account has been blocked.",
      ACCOUNT_NOT_ACTIVE: "Your account is not active. Please activate your account.",
      USER_NOT_FOUND: "User not found!",
      USER_ALREADY_BLOCKED: "User is already blocked!",
      USER_ALREADY_UNBLOCKED: "User is already unblocked!",
      USER_STATUS_UPDATE_FAIL: "Failed to update user status!",
      USER_PROFILE_IMAGE_UPDATE_FAIL: "Failed to update profile image!",
      ROLE_UPDATE_FAIL: "Failed to update role!",
      USER_ALREADY_ACTIVE: "User is already active!",
      USER_ALREADY_INACTIVE: "User is already inactive!",
      USER_ALREADY_RATED: "User has already rated this product!", 
      NO_COMMENTS_FOR_PRODUCT: "There are no comments for this product.",
      ADD_CATEGORY_FAIL: "Failed to add category!",
      SLUG_ALREADY_EXISTS: "The slug already exists!",
      IMAGE_REQUIRED: "Image is required!",
      PRODUCT_NOT_FOUND: "Product not found!",
      ADD_TO_CART_FAIL: "Failed to add product to cart!",
      USER_NOT_AUTHENTICATED: "User is not authenticated!",
      CART_NOT_FOUND: "Cart not found!",
      GET_CART_FAIL: "Failed to fetch cart!",
      VARIANT_ID_REQUIRED: "Variant ID is required!",
      VARIANT_NOT_FOUND_IN_CART: "Variant not found in cart!",
      REMOVE_CART_ITEM_FAIL: "Failed to remove item from cart!",
      GET_CATEGORY_FAIL: "Failed to retrieve category list",
      GET_CATEGORY_BY_ID_FAIL: "Failed to retrieve category by ID",
      CATEGORY_NOT_FOUND: "Category not found",
      ADD_CATEGORY_FAIL: "Failed to add category",
      SLUG_ALREADY_EXISTS: "Slug already exists",
      IMAGE_REQUIRED: "Please upload an image",
      UPDATE_CATEGORY_FAIL: "Failed to update category",
      DELETE_CATEGORY_FAIL: "Failed to delete category",
    },
  },
  vi: {
    success: {
      REGISTER_SUCCESS: "Đăng ký thành công!",
      LOGIN_SUCCESS: "Đăng nhập thành công!",
      CREATE_SUCCESS: "Tạo mới thành công!",
      DELETE_SUCCESS: "Xóa thành công!",
      UPDATE_SUCCESS: "Cập nhật thành công!",
      GET_SUCCESS: "Lấy dữ liệu thành công!",
      LOGOUT_SUCCESS: "Đăng xuất thành công!",
      REFRESH_TOKEN_SUCCESS: "Làm mới token thành công!",
      VERIFY_EMAIL_SUCCESS: "Xác thực email thành công!",
      FORGOT_PASSWORD_SUCCESS: "Quên mật khẩu thành công!",
      RESET_PASSWORD_SUCCESS: "Đặt lại mật khẩu thành công!",
      CHANGE_PASSWORD_SUCCESS: "Đổi mật khẩu thành công!",
      UPDATE_PROFILE_SUCCESS: "Cập nhật hồ sơ thành công!",
      GET_PROFILE_SUCCESS: "Lấy hồ sơ thành công!",
      GET_LIST_SUCCESS: "Lấy danh sách thành công!",
      GET_DETAIL_SUCCESS: "Lấy chi tiết thành công!",
      CONNECT_DB_SUCCESS: "Kết nối cơ sở dữ liệu thành công!",
      BLOCK_SUCCESS: "Khóa người dùng thành công!",
      UNBLOCK_SUCCESS: "Mở khóa người dùng thành công!",
      UPDATE_STATUS_SUCCESS: "Cập nhật trạng thái thành công!",
      UPDATE_PROFILE_IMAGE_SUCCESS: "Cập nhật hình ảnh hồ sơ thành công!",
      USER_ACTIVATION_SUCCESS: "Kích hoạt người dùng thành công!",
      USER_DEACTIVATION_SUCCESS: "Hủy kích hoạt người dùng thành công!",
      ROLE_UPDATE_SUCCESS: "Cập nhật vai trò thành công!",
      COMMENTS_FETCHED: "Lấy bình luận thành công!",
      ADD_CATEGORY_SUCCESS: "Thêm danh mục thành công!",
      PRODUCT_NOT_FOUND: "Không tìm thấy sản phẩm!",
      ADD_TO_CART_SUCCESS: "Thêm vào giỏ hàng thành công!",
      GET_CART_SUCCESS: "Lấy giỏ hàng thành công!",
      REMOVE_CART_ITEM_SUCCESS: "Xóa sản phẩm khỏi giỏ hàng thành công!",
      GET_CATEGORY_SUCCESS: "Lấy danh sách danh mục thành công",
      GET_CATEGORY_BY_ID_SUCCESS: "Lấy danh mục thành công",
      ADD_CATEGORY_SUCCESS: "Thêm danh mục thành công",
      UPDATE_CATEGORY_SUCCESS: "Cập nhật danh mục thành công",
      DELETE_CATEGORY_SUCCESS: "Xóa danh mục thành công",
    },
    error: {
      TOKEN_INVALID: "Token không hợp lệ!",
      CONNECT_DB_FAIL: "Kết nối cơ sở dữ liệu thất bại!",
      NOT_FOUND: "Không tìm thấy!",
      CREATE_FAIL: "Tạo mới thất bại!",
      DELETE_FAIL: "Xóa thất bại!",
      UPDATE_FAIL: "Cập nhật thất bại!",
      GET_FAIL: "Lấy dữ liệu thất bại!",
      LOGIN_FAIL: "Đăng nhập thất bại!",
      REGISTER_FAIL: "Đăng ký thất bại!",
      UNAUTHORIZED: "Không có quyền truy cập!",
      SERVER_ERROR: "Lỗi máy chủ!",
      EMAIL_EXIST: "Email đã tồn tại!",
      USERNAME_EXIST: "Tên người dùng đã tồn tại!",
      EMAIL_NOT_FOUND: "Không tìm thấy email!",
      PASSWORD_NOT_MATCH: "Mật khẩu không khớp!",
      INVALID_EMAIL: "Email không hợp lệ!",
      INVALID_PASSWORD: "Mật khẩu không hợp lệ!",
      PERMISSION_DENIED: "Không được phép!",
      ACCOUNT_BLOCKED: "Tài khoản của bạn đã bị khóa.",
      ACCOUNT_NOT_ACTIVE: "Tài khoản của bạn chưa được kích hoạt. Vui lòng kích hoạt tài khoản của bạn.",
      USER_NOT_FOUND: "Không tìm thấy người dùng!",
      USER_ALREADY_BLOCKED: "Tài khoản người dùng đã bị khóa!",
      USER_ALREADY_UNBLOCKED: "Tài khoản người dùng đã mở khóa!",
      USER_STATUS_UPDATE_FAIL: "Cập nhật trạng thái người dùng thất bại!",
      USER_PROFILE_IMAGE_UPDATE_FAIL: "Cập nhật hình ảnh hồ sơ thất bại!",
      ROLE_UPDATE_FAIL: "Cập nhật vai trò thất bại!",
      USER_ALREADY_ACTIVE: "Người dùng đã được kích hoạt!",
      USER_ALREADY_INACTIVE: "Người dùng đã bị hủy kích hoạt!",
      USER_ALREADY_RATED: "Người dùng đã đánh giá sản phẩm này!", 
      NO_COMMENTS_FOR_PRODUCT: "Không có bình luận nào cho sản phẩm này.",
      ADD_CATEGORY_FAIL: "Thêm danh mục thất bại!",
      SLUG_ALREADY_EXISTS: "Slug đã tồn tại!",
      IMAGE_REQUIRED: "Hình ảnh là bắt buộc!",
      PRODUCT_NOT_FOUND: "Không tìm thấy sản phẩm!",
      ADD_TO_CART_FAIL: "Thêm sản phẩm vào giỏ hàng thất bại!",
      USER_NOT_AUTHENTICATED: "Người dùng chưa được xác thực!",
      CART_NOT_FOUND: "Không tìm thấy giỏ hàng!",
      GET_CART_FAIL: "Lấy giỏ hàng thất bại!",
      VARIANT_ID_REQUIRED: "Mã phiên bản là bắt buộc!",
      VARIANT_NOT_FOUND_IN_CART: "Không tìm thấy phiên bản trong giỏ hàng!",
      REMOVE_CART_ITEM_FAIL: "Xóa sản phẩm khỏi giỏ hàng thất bại!",
      GET_CATEGORY_FAIL: "Lấy danh mục thất bại!",
      GET_CATEGORY_BY_ID_FAIL: "Lấy danh mục theo ID thất bại!",
      CATEGORY_NOT_FOUND: "Không tìm thấy danh mục!",
      ADD_CATEGORY_FAIL: "Thêm danh mục thất bại!",
      SLUG_ALREADY_EXISTS: "Slug đã tồn tại!",
      IMAGE_REQUIRED: "Vui lòng tải lên hình ảnh!",
      UPDATE_CATEGORY_FAIL: "Cập nhật danh mục thất bại!",
      DELETE_CATEGORY_FAIL: "Xóa danh mục thất bại!",
    },
  },
});
export default messages;
