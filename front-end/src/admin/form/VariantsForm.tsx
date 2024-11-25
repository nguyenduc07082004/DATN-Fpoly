import React, { useState, useEffect, useRef } from "react";
import { generateSlug } from "../../utils/slugUtils"; // Import hàm generateSlug từ slugUtils.js
import { baseURL } from "../../api";
import ins from "../../api";

const VariantsForm = () => {
  const [products, setProducts] = useState<any[]>([]); // Lưu danh sách sản phẩm
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null); // Lưu sản phẩm đã chọn
  const [color, setColor] = useState<string>(''); // Lưu màu sắc đã chọn
  const [storage, setStorage] = useState<string>(''); // Lưu bộ nhớ đã chọn
  const [sku, setSku] = useState<string>(''); // Lưu SKU tự động
  const [price, setPrice] = useState<number>(0); // Lưu giá
  const [quantity, setQuantity] = useState<number>(0); // Lưu số lượng
  const [images, setImages] = useState<File[] | null>(null); // Lưu mảng ảnh
const fileInputRef = useRef<HTMLInputElement | null>(null);
  // Lấy danh sách sản phẩm từ API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await ins.get(`${baseURL}/products`); // URL để lấy danh sách sản phẩm
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  // Hàm xử lý khi chọn sản phẩm
  const handleAddVariant = (productId: string) => {
    setSelectedProductId(productId); // Cập nhật ID sản phẩm đã chọn
  };

  // Hàm xử lý thay đổi màu sắc
  const handleColorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedColor = e.target.value;
    setColor(selectedColor);
    updateSku(selectedProductId, selectedColor, storage);
  };

  // Hàm xử lý thay đổi bộ nhớ
  const handleStorageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedStorage = e.target.value;
    setStorage(selectedStorage);
    updateSku(selectedProductId, color, selectedStorage);
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPrice = Number(e.target.value);
    setPrice(newPrice);
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = Number(e.target.value);
    setQuantity(newQuantity);
  };
  const updateSku = (productId: string | null, selectedColor: string, selectedStorage: string) => {
    if (productId && selectedColor && selectedStorage) {
      const product = products.find(p => p._id === productId);
      if (product) {
        const generatedSku = generateSlug(`${product.title}-${selectedColor}-${selectedStorage}`);
        setSku(generatedSku);
      }
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    const maxFiles = 3;

    if (files) {
      const newFiles = Array.from(files); 
      if (images && newFiles.length + images.length > maxFiles) {
        alert(`Chỉ nhận tối đa ${maxFiles} hình ảnh`);
        
        const filesToSave = newFiles.slice(0, maxFiles - (images?.length || 0));
      setImages((prevImages) => (prevImages ? [...prevImages, ...filesToSave] : [...filesToSave]));
    } else {
      setImages((prevImages) => (prevImages ? [...prevImages, ...newFiles] : [...newFiles]));
    }
      e.target.value = ''; 
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages((prevImages) => {
      if (prevImages && Array.isArray(prevImages)) {
        const updatedImages = [...prevImages];
        updatedImages.splice(index, 1);
        return updatedImages;
      }
      return prevImages; 
    });
  };
  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedProductId || !color || !storage || !sku || !price || !quantity || !images) {
      alert("Vui lòng chọn đầy đủ thông tin sản phẩm, màu sắc, bộ nhớ , SKU , giá , số lượng , hình ảnh.");
      return;
    }
  
    // Dữ liệu cần gửi
    const variantData = {
      productId: selectedProductId,
      color: color,
      storage: storage,
      sku: sku,
      price: price, 
      quantity: quantity, 
    };
  
    const formData = new FormData();
    formData.append('productId', selectedProductId); // Append productId
    formData.append('variantData', JSON.stringify(variantData)); // Append variant data
  
    // Append images to FormData
    if (images) {
      images.forEach((image) => {
        formData.append('images', image);
      });
    }
  
    try {
      const response = await ins.post(`${baseURL}/products/create/variants`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      if (response.status === 201) {
        // Thông báo thành công cho người dùng
        alert("Biến thể đã được tạo thành công");
  
        // Reset các giá trị form
        setSku('');
        setColor('');
        setStorage('');
        setPrice(0);
        setQuantity(1);
        setSelectedProductId('');
        setImages(null); // Reset ảnh
      }
    } catch (error: any) {
      console.error("Có lỗi khi tạo biến thể:", error);
      // Kiểm tra nếu lỗi có thông tin từ phía response
      if (error.response) {
        // Lỗi từ server với thông báo chi tiết
        const errorMessage = error.response.data.message || "Có lỗi khi tạo biến thể. Vui lòng thử lại.";
        alert(errorMessage);
      } else if (error.request) {
        // Lỗi khi không nhận được phản hồi từ server
        alert("Không nhận được phản hồi từ server. Vui lòng kiểm tra kết nối.");
      } else {
        // Các lỗi khác
        alert("Có lỗi không xác định. Vui lòng thử lại.");
      }
    }
  };
  
  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="mt-5">
      <h2 className="text-center mb-4">Tạo Biến thể cho Sản phẩm</h2>
      <form onSubmit={handleSubmit}>
  <div className="border p-4 mb-4 rounded shadow-sm">
    <label htmlFor="">Sản Phẩm</label>
    <br />
    <select
      value={selectedProductId} 
      onChange={(e) => handleAddVariant(e.target.value)}
      className="form-control"
    >
      <option value="">Chọn sản phẩm</option>
      {products.map((product) => (
        <option key={product._id} value={product._id}>
          {product.title}
        </option>
      ))}
    </select>

    {/* Nếu đã chọn sản phẩm, hiển thị các trường biến thể */}
      <>
        <div className="form-group">
          <label>Màu sắc</label>
          <select
            className="form-control"
            value={color} // Sử dụng state color để điều khiển giá trị
            onChange={handleColorChange}
          >
            <option value="">Chọn màu</option>
            <option value="Đen">Đen</option>
            <option value="Trắng">Trắng</option>
            <option value="Hồng">Hồng</option>
            <option value="Xanh">Xanh</option>
          </select>
        </div>

        <div className="form-group">
          <label>Bộ nhớ</label>
          <select
            className="form-control"
            value={storage} // Sử dụng state storage để điều khiển giá trị
            onChange={handleStorageChange}
          >
            <option value="">Chọn bộ nhớ</option>
            <option value="128GB">128GB</option>
            <option value="256GB">256GB</option>
            <option value="512GB">512GB</option>
            <option value="1TB">1TB</option>
          </select>
        </div>

        <div className="form-group">
          <label>SKU</label>
          <input
            type="text"
            className="form-control"
            value={sku} // Sử dụng state sku để điều khiển giá trị
            readOnly
          />
        </div>

        <div className="form-group">
          <label>Giá</label>
          <input
            type="number"
            className="form-control"
            value={price} // Sử dụng state price để điều khiển giá trị
            onChange={handlePriceChange}
            required
            min = "0"
          />
        </div>

        <div className="form-group">
          <label>Số lượng</label>
          <input
            type="number"
            className="form-control"
            value={quantity} // Sử dụng state quantity để điều khiển giá trị
            onChange={handleQuantityChange}
            required
            min = "1"
          />
        </div>
        <div className="form-group">
        <button
  type="button"
  className="btn btn-success btn-sm shadow-sm mt-2"
  onClick={handleClick}
>
  <i className="bi bi-upload"></i> Tải ảnh lên
</button>
      <input
        type="file"
        ref={fileInputRef}
        className="form-control"
        accept="image/*"
        multiple
        onChange={handleImageChange}
        style={{ display: "none" }} 
      />
      </div>

      {images &&  ( 
        <div className="mt-2">
<       p className="fw-bold">{images && images.length} tệp đã được chọn</p>
        </div>
      )}

      <div className="image-preview mt-2">
        <div className="row">
          {images && images.map((file, index) => (
            <div key={index} className="col-4 mb-3">
              <div className="card">
                <img
                  src={URL.createObjectURL(file)}
                  alt={`Preview ${index + 1}`}
                  className="card-img-top img-thumbnail"
                  style={{ objectFit: "cover", height: "150px" }}
                />
              <button
                type="button"
                className="btn btn-danger position-absolute top-0 end-0 m-2"
                onClick={() => handleRemoveImage(index)} 
              >
                <i className="bi bi-x-circle"></i> 
              </button>
              </div>
            </div>
            
          ))}
        </div>
      </div>

        <hr />
      </>
  </div>

  <div className="text-end me-2">
    <button type="submit" className="btn btn-success btn-lg">
      Tạo biến thể
    </button>
  </div>
</form>
    </div>
  );
};

export default VariantsForm;
