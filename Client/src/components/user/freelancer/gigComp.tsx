interface PricingPlan {
  price: number;
  description: string;
  deliveryTime: number;
}

interface GigFormData {
  title: string;
  description: string;
  category: string;
  skills: string[];
  pricing: {
    basic: PricingPlan;
    standard: PricingPlan;
    premium: PricingPlan;
  };
  gallery: File[];
}

interface Props {
  form: GigFormData;
  adminSkills: {[category: string]: { _id: string; name: string }[]};
  loading: boolean;
  onChange: ( e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> ) => void;
  onPricingChange: ( level: "basic" | "standard" | "premium", field: "price" | "description" | "deliveryTime", value: string ) => void;
  onSkillToggle: (skillId: string) => void;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: (index: number) => void;
  onSubmit: () => void;
}

function GigComp({ form, adminSkills, loading, onChange, onPricingChange, onSkillToggle, onImageUpload, onRemoveImage, onSubmit }: Props) {
  return (
    <div className="p-6 max-w-4xl mx-auto bg-white shadow rounded-lg space-y-6 mt-7">
      <h1 className="text-3xl font-semibold text-center text-black">
        Create New Gig
      </h1>

      <input
        type="text"
        name="title"
        value={form.title}
        onChange={onChange}
        placeholder="Gig Title"
        className="w-full border p-2 rounded"
      />

      <textarea
        name="description"
        value={form.description}
        onChange={onChange}
        placeholder="Gig description"
        className="w-full border p-2 rounded"
      />

      <select
        name="category"
        value={form.category}
        onChange={onChange}
        className="w-full border p-2 rounded"
      >
        <option value="">Select Category</option>
        {Object.keys(adminSkills).map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>

      <div>
        <label className="block font-medium mb-1">Skills</label>

        {form.category && adminSkills[form.category] && (
          <div>
            <p className="font-semibold text-gray-700 mb-1">
              {form.category}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {adminSkills[form.category].map((skill) => (
                <label key={skill._id} className="block text-sm">
                  <input
                    type="checkbox"
                    checked={form.skills.includes(skill._id)}
                    onChange={() => onSkillToggle(skill._id)}
                    className="mr-2"
                  />
                  {`+${skill.name}`}
                </label>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {(["basic", "standard", "premium"] as const).map((level) => (
          <div key={level} className="border rounded p-4 space-y-3">
            <h3 className="text-lg font-semibold capitalize">
              {level} Package
            </h3>

            <input
              type="number"
              min={0}
              value={ form.pricing[level].price === 0 ? "" : form.pricing[level].price }
              onChange={(e) => onPricingChange(level, "price", e.target.value) }
              placeholder="Price"
              className="w-full border p-2 rounded"
            />

            <textarea
              value={form.pricing[level].description}
              onChange={(e) => onPricingChange(level, "description", e.target.value) }
              placeholder="Description"
              className="w-full border p-2 rounded"
            />

            <input
              type="number"
              min={0}
              value={form.pricing[level].deliveryTime === 0 ? "" : form.pricing[level].deliveryTime }
              onChange={(e) => onPricingChange(level, "deliveryTime", e.target.value) }
              placeholder="Delivery Time (days)"
              className="w-full border p-2 rounded"
            />
          </div>
        ))}
      </div>

      <input
        type="file"
        accept="image/*"
        multiple
        onChange={onImageUpload}
        className="w-full border p-2 rounded"
      />

      {form.gallery.length > 0 && (
        <ul className="space-y-1 text-sm">
          {form.gallery.map((file, index) => (
            <li
              key={`${file.name}-${index}`}
              className="flex justify-between bg-gray-50 rounded px-3 py-1"
            >
              <span className="truncate">{file.name}</span>

              <button
                type="button"
                onClick={() => onRemoveImage(index)}
                className="text-red-500"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}

      <button
        onClick={onSubmit}
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Submitting..." : "Submit"}
      </button>
    </div>
  );
}

export default GigComp;