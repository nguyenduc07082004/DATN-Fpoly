import React, { useState, useEffect, useRef } from "react";
import { generateSlug } from "../../utils/slugUtils"; // Import hàm generateSlug từ slugUtils.js
import { baseURL } from "../../api";
import ins from "../../api";
import { useParams } from "react-router-dom";

const VariantsForm = () => {
  const { id } = useParams();
  const [products, setProducts] = useState<any[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    id as string
  );
  const [color, setColor] = useState<string>("");
  const [storage, setStorage] = useState<string>("");
  const [sku, setSku] = useState<string>("");
  const [price, setPrice] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(0);
  const [images, setImages] = useState<File[] | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await ins.get(`${baseURL}/products`);
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  const handleAddVariant = (productId: string) => {
    setSelectedProductId(productId);
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedColor = e.target.value;
    setColor(selectedColor);
    updateSku(selectedProductId, selectedColor, storage);
  };

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
  const updateSku = (
    productId: string | null,
    selectedColor: string,
    selectedStorage: string
  ) => {
    if (productId && selectedColor && selectedStorage) {
      const product = products.find((p) => p._id === productId);
      if (product) {
        const generatedSku = generateSlug(
          `${product.title}-${selectedColor}-${selectedStorage}`
        );
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
        setImages((prevImages) =>
          prevImages ? [...prevImages, ...filesToSave] : [...filesToSave]
        );
      } else {
        setImages((prevImages) =>
          prevImages ? [...prevImages, ...newFiles] : [...newFiles]
        );
      }
      e.target.value = "";
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
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !selectedProductId ||
      !color ||
      !storage ||
      !sku ||
      !price ||
      !quantity ||
      !images
    ) {
      alert(
        "Vui lòng chọn đầy đủ thông tin sản phẩm, màu sắc, bộ nhớ , SKU , giá , số lượng , hình ảnh."
      );
      return;
    }

    const variantData = {
      productId: selectedProductId,
      color: color,
      storage: storage,
      sku: sku,
      price: price,
      quantity: quantity,
    };

    const formData = new FormData();
    formData.append("productId", selectedProductId);
    formData.append("variantData", JSON.stringify(variantData)); 

    if (images) {
      images.forEach((image) => {
        formData.append("images", image);
      });
    }

    try {
      const response = await ins.post(
        `${baseURL}/products/create/variants`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 201) {
        alert("Biến thể đã được tạo thành công");

        setSku("");
        setColor("");
        setStorage("");
        setPrice(0);
        setQuantity(1);
        setSelectedProductId("");
        setImages(null); 
      }
    } catch (error: any) {
      console.error("Có lỗi khi tạo biến thể:", error);
      if (error.response) {
        const errorMessage =
          error.response.data.message ||
          "Có lỗi khi tạo biến thể. Vui lòng thử lại.";
        alert(errorMessage);
      } else if (error.request) {
        alert("Không nhận được phản hồi từ server. Vui lòng kiểm tra kết nối.");
      } else {
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

          <>
            <div className="form-group">
              <label>Màu sắc</label>
              <select
                className="form-control"
                value={color}
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
                value={storage}
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
                value={sku}
                readOnly
              />
            </div>

            <div className="form-group">
              <label>Giá</label>
              <input
                type="number"
                className="form-control"
                value={price}
                onChange={handlePriceChange}
                required
                min="0"
              />
            </div>

            <div className="form-group">
              <label>Số lượng</label>
              <input
                type="number"
                className="form-control"
                value={quantity}
                onChange={handleQuantityChange}
                required
                min="1"
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

            {images && (
              <div className="mt-2">
                <p className="fw-bold">
                  {images && images.length} tệp đã được chọn
                </p>
              </div>
            )}

            <div className="image-preview mt-2">
              <div className="row">
                {images &&
                  images.map((file, index) => (
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
