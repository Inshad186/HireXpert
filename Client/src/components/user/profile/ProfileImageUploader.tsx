
import { useRef, useState } from "react";

interface ProfileImageProps {
  image: string;
  onImageChange: (file: File) => Promise<void>;
}

function ProfileImage({ image, onImageChange }: ProfileImageProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async ( event: React.ChangeEvent<HTMLInputElement> ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      event.target.value = "";
      return;
    }

    try {
      setUploading(true);
      await onImageChange(file);
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  return (
    <div className="flex flex-col items-center">
      <img
        src={image || "/default-avatar.png"}
        alt="Profile"
        className="h-28 w-28 rounded-full object-cover border-4 border-white shadow-md"
      />

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
        className="mt-3 rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700 disabled:opacity-50"
      >
        {uploading ? "Uploading..." : "Change Profile Photo"}
      </button>
    </div>
  );
}

export default ProfileImage;
