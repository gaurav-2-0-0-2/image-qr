import React, { useState } from "react";
import {QRCodeSVG} from "qrcode.react";
import "./App.css";

// Replace with your Cloudinary credentials
const CLOUD_NAME = "disfr1adu";
const UPLOAD_PRESET = "visiting_card";

function App() {
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files?.[0] || null);
  };

  const handleReset = () => {
  setFile(null);
  setImageUrl("");
  };

  const handleUpload = async () => {
    if (!file) return alert("Please choose an image");

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await res.json();

      if (res.ok) {
        setImageUrl(data.secure_url);
      } else {
        console.error("Upload error", data);
        alert(`Upload failed: ${data.error.message}`);
      }
    } catch (err) {
      console.error("Network error", err);
      alert("Upload failed – network error");
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="container">
    <h1>Visiting Card</h1>

    <div className="upload-section">
      <input
        type="file"
        accept="image/*"
        id="fileUpload"
        onChange={handleFileChange}
        hidden
      />
      <label htmlFor="fileUpload" className="upload-label">
        📤 Choose Image
      </label>
      {file && <p className="file-name">Selected: {file.name}</p>}

      <button onClick={handleUpload} disabled={loading}>
        {loading ? "Uploading..." : "Upload & Generate QR"}
      </button>

      {file || imageUrl ? (
    <button className="reset-btn" onClick={handleReset}>
      🔄 Reset
    </button>
  ) : null}
    </div>

    {imageUrl && (
      <div className="output">
        <p>📇 Your Visiting Card:</p>
        <img
          src={imageUrl}
          alt="Visiting Card"
          style={{ maxWidth: "300px", border: "1px solid #ccc" }}
        />
        <p>📱 Scan this QR:</p>
        <QRCodeSVG value={imageUrl} size={200} />
        <p>
          <a href={imageUrl} target="_blank" rel="noopener noreferrer">
            View Image
          </a>
        </p>
      </div>
    )}
  </div>
);

}

export default App;
