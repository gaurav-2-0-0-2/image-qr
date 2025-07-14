import React, { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import "./App.css";
import axios from "axios";

// Replace with your Cloudinary credentials
const CLOUD_NAME = "disfr1adu";
const UPLOAD_PRESET = "visiting_card";

function App() {
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files?.[0] || null);
  };

  const handleReset = () => {
    setFile(null);
    setImageUrl("");
    setShowModal(false);
  };

  const createTinyUrl = async (url) => {
    try {
      const tinyUrl = await axios.post("https://api.tinyurl.com/create",
        {url: url},
        {
          headers: {
            "Authorization":`Bearer ${import.meta.env.VITE_TINY_URL_TOKEN}`
          }
        }
      )
      return tinyUrl;
    } catch(err) {
      console.error("error creating tiny url",err)
    }
    
  }

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
        let res = await createTinyUrl(data.secure_url);
        const tinyUrl = res.data.data.tiny_url;
        setImageUrl(tinyUrl);
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
    <div className="page">
      <div className="logo-container">
        <img src="/logo.png" alt="logo" />
      </div>

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

          <button onClick={handleUpload} disabled={loading}>
            {loading ? "Uploading..." : "Upload & Generate QR"}
          </button>
        </div>

        {file && <p className="file-name">Selected: {file.name}</p>}

        {(file || imageUrl) && (
          <button className="reset-btn" onClick={handleReset}>
            🔄 Reset
          </button>
        )}

        {imageUrl && (
          <div className="output">
            <div className="preview">
              <QRCodeSVG value={imageUrl} size={200} />
            </div>
            <p>
              <button className="view-link" onClick={() => setShowModal(true)}>
                View Image
              </button>
            </p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <img src={imageUrl} alt="Full Size" />
            <button className="close-modal" onClick={() => setShowModal(false)}>
              ✖
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
