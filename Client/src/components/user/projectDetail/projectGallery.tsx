import { useState } from "react";

interface Props {
  images?: string[];
  title: string;
}

export default function ProjectGallery({ images = [], title }: Props) {
  const [active, setActive] = useState(0);

  return (
    <div className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
      <div className="aspect-[16/10] bg-slate-100 rounded-xl overflow-hidden">
        <img
          src={images[active] || images[0] || "/placeholder.jpg"}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>

      {images.length > 1 && (
        <div className="flex items-center gap-3 mt-3 overflow-x-auto pb-1">
          {images.map((img, index) => (
            <button
              key={index}
              onClick={() => setActive(index)}
              className={`flex-shrink-0 w-24 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                active === index
                  ? "border-indigo-600"
                  : "border-transparent opacity-70 hover:opacity-100"
              }`}
            >
              <img src={img} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}