import React, { useRef } from "react";
import DefaultImage from "@/assets/userProfile.png";

export default function ProfileImageUploader({ image, onChange }: { image: string; onChange: (file: File) => void }) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  return (
    <div className="relative w-32 h-32 mb-2">
      <img src={image || DefaultImage} alt="User" className="w-full h-full rounded-full object-cover border-4 border-white shadow-md" />
      <input type="file" accept=".jpg,.jpeg,.png,.webp" style={{ display: "none" }} ref={inputRef} onChange={(e) => {
        if (e.target.files?.length) onChange(e.target.files[0]);
      }} />
      <button
        className="absolute bottom-0 right-0 bg-blue-600 text-white text-xs px-2 py-1 rounded hover:bg-blue-700"
        onClick={() => inputRef.current?.click()}
      >
        Update
      </button>
    </div>
  );
}
