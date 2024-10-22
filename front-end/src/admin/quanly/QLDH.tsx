import React, { useState } from "react";
import axios from "axios";

interface Props {}

const QLDH = (props: Props) => {
  const [file, setFile] = useState<File | null>(null);
  const [imageURL, setImageURL] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const uploadImageToCloudinary = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "imagefordatn"); // Replace with your Cloudinary upload preset

    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dvak1zyvj/image/upload", // Replace with your Cloudinary URL
        formData
      );
      setImageURL(response.data.secure_url);
    } catch (error) {
      console.error("Error uploading image to Cloudinary:", error);
    }
  };

  return (
    <div>
      <h1>QLDH</h1>
      <input type="file" onChange={handleFileChange} />
      <button onClick={uploadImageToCloudinary}>Upload Image</button>
      {imageURL && (
        <div>
          <p>Image uploaded successfully:</p>
          <img src={imageURL} alt="Uploaded" style={{ width: "300px" }} />
        </div>
      )}
    </div>
  );
};

export default QLDH;
