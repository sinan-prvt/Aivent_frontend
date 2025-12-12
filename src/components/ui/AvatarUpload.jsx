// src/components/AvatarUploader.jsx
import React, { useState } from "react";

export default function AvatarUploader({ initialUrl, onChange }) {
  const [preview, setPreview] = useState(initialUrl || null);

  function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    onChange(file); // parent will receive file
  }

  return (
    <div>
      {preview && <img src={preview} alt="avatar preview" style={{ width: 120, height: 120, objectFit: "cover", borderRadius: "50%" }} />}
      <input type="file" accept="image/*" onChange={handleFile} />
    </div>
  );
}
