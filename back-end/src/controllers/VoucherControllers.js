import Voucher from "../models/VoucherModels.js"

export const getAllVouchers = async (req, res) => {
    try {
        const { search, is_used, discount, expiration_date, page = 1, sortBy = 'expiration_date', sortOrder = 'asc' } = req.query;
        
        // Tạo đối tượng filter từ các query parameters
        let filter = {};
        
        // Tìm kiếm theo mã voucher hoặc tên voucher
        if (search) {
            filter.code = { $regex: search, $options: 'i' }; // Tìm kiếm không phân biệt chữ hoa/thường
        }

        // Lọc theo trạng thái sử dụng voucher
        if (is_used !== undefined) {
            filter.is_used = is_used === 'true';
        }

        // Lọc theo phần trăm giảm giá
        if (discount) {
            filter.discount = discount;
        }

        // Lọc theo ngày hết hạn
        if (expiration_date) {
            filter.expiration_date = { $lte: new Date(expiration_date) };  // Lọc voucher có ngày hết hạn trước ngày được chỉ định
        }

        // Tính toán phân trang
        const limit = 6;  // Số lượng voucher trên mỗi trang
        const skip = (page - 1) * limit;

        // Lấy danh sách voucher theo filter và phân trang
        const vouchers = await Voucher.find(filter)
            .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })  // Sắp xếp theo trường và thứ tự
            .skip(skip)
            .limit(limit);

        // Tính tổng số trang
        const totalVouchers = await Voucher.countDocuments(filter);
        const totalPages = Math.ceil(totalVouchers / limit);

        if (!vouchers.length) {
            return res.status(404).json({ error: 'Không tìm thấy voucher' });
        }

        res.status(200).json({
            vouchers,
            totalPages,
        });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getVoucherByCode = async (req, res) => {
    const { code } = req.params;
    try {
        const voucher = await Voucher.findOne({ code });
        if (!voucher) {
            return res.status(404).json({ error: 'Voucher not found' });
        }
        res.status(200).json(voucher);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const createVoucher = async (req, res) => {
    const { code, discount , expiration_date } = req.body; // Giả sử bạn kiểm tra theo code voucher
    try {

        // Kiểm tra xem voucher đã tồn tại chưa
        const existingVoucher = await Voucher.findOne({ code });

        if (existingVoucher) {
            return res.status(400).json({ error: 'Mã giảm giá đã tồn tại' });
        }
        if (discount > 30) {
            return res.status(400).json({ error: 'Không được quá 30%' });
        }
        if (discount < 0) {
            return res.status(400).json({ error: 'Giảm giá phải lớn hơn 0%' });
        }
        if (new Date(expiration_date) < new Date()) {
            return res.status(400).json({ error: 'Ngày hết hạn phải lớn hơn ngày hiện tại' });
        }
    

        // Nếu chưa tồn tại, tạo voucher mới
        const voucher = new Voucher(req.body);
        await voucher.save();

        res.status(201).json(voucher);
    } catch (error) {
        console.error(error); // In lỗi ra console để dễ dàng debug
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const updateVoucher = async (req, res) => {
    const { id } = req.params;
    try {
        const voucher = await Voucher.findByIdAndUpdate(id, req.body, { new: true });
        if (!voucher) {
            return res.status(404).json({ error: 'Mã giảm giá không tồn tại' });
        }
        res.status(200).json(voucher);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

export const deleteVoucher = async (req, res) => {
    const { voucherCode } = req.params;
    try {
        const voucher = await Voucher.findOneAndDelete(voucherCode);
        if (!voucher) {
            return res.status(404).json({ error: 'Mã giảm giá không tồn tại' });
        }
        res.status(200).json({ message: 'Xoá mã giảm giá thành công' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

export const checkVoucher = async (req, res) => {
    const { discountCode } = req.body;

    try {
        // Tìm mã giảm giá trong cơ sở dữ liệu
        const voucher = await Voucher.findOne({ code: discountCode });

        // Nếu không tìm thấy voucher
        if (!voucher) {
            return res.status(404).json({ error: 'Mã giảm giá không tồn tại' });
        }

        // Kiểm tra xem voucher có hết hạn không
        const currentDate = new Date();
        if (new Date(voucher.expiry_date) < currentDate) {
            return res.status(400).json({ error: 'Mã giảm giá hết hạn' });
        }

        if (voucher.is_used) {
            return res.status(400).json({ error: 'Mã giảm giá được sử dụng rồi' });
        }

        // Nếu voucher hợp lệ, trả về thông tin voucher
        res.status(200).json({
            code: voucher.code,
            discount: voucher.discount, // Giảm giá mà voucher mang lại
            message: 'Áp dụng mã giảm giá thành công',
        });
    } catch (error) {
        // Xử lý lỗi khi truy vấn cơ sở dữ liệu hoặc lỗi hệ thống
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const useVoucher = async (req, res) => {
    const { voucher_code, user_id } = req.body;
    try {
        // Tìm voucher dựa trên voucher_code
        const voucher = await Voucher.findOne({ code: voucher_code });

        // Kiểm tra nếu voucher không tồn tại
        if (!voucher) {
            return res.status(404).json({ error: 'Voucher không tồn tại' });
        }

        // Kiểm tra xem voucher đã được sử dụng chưa
        if (voucher.is_used) {
            return res.status(400).json({ error: 'Voucher đã được sử dụng' });
        }

        // Kiểm tra xem voucher còn hiệu lực không (kiểm tra ngày hết hạn)
        const currentDate = new Date();
        if (currentDate > new Date(voucher.expiration_date)) {
            return res.status(400).json({ error: 'Voucher đã hết hạn' });
        }

        // Cập nhật trạng thái is_used thành true khi voucher được sử dụng
        voucher.is_used = true;
        voucher.user_id = user_id;  // Gán người dùng đã sử dụng voucher
        await voucher.save();

        res.status(200).json({ message: 'Voucher đã được sử dụng thành công', voucher });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};


export const getVoucherUsed = async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;  
      const limit = parseInt(req.query.limit) || 6; 
      const skip = (page - 1) * limit; 
  
      const vouchers = await Voucher.find({
        expiration_date: { $gte: new Date() },
        is_used: false,
      })
        .sort({ expiration_date: -1 }) 
        .skip(skip)
        .limit(limit);
  
      const totalVouchers = await Voucher.countDocuments({
        expiration_date: { $gte: new Date() },
        is_used: false,
      });
  
      res.status(200).json({
        vouchers,
        totalVouchers,
        totalPages: Math.ceil(totalVouchers / limit),
        currentPage: page,
      });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  };