import React,{useState} from "react";

interface Props {
  form: any;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  fields: Array<any>;
}

export default function ProfileForm({ form, onChange, fields }: Props) {
    const [multiSelectOpen, setMultiSelectOpen] = useState<{ [key: string]: boolean }>({});

      const toggleSelect = (fieldName: string) => {
    setMultiSelectOpen((prev) => ({
      ...prev,
      [fieldName]: !prev[fieldName]
    }));
  };

  return (
    <div className="space-y-4 text-sm text-gray-700">
      {fields.map((field) => {

        // --- Custom Multiselect ---
        if (field.type === "multiselect") {
          const selected = form[field.name] || [];

          return (
            <div key={field.name} className="relative">
              <label className="block mb-1 font-medium">{field.placeholder}</label>
              <div
                onClick={() => toggleSelect(field.name)}
                className="border p-2 rounded cursor-pointer bg-white"
              >
                {selected.length > 0
                  ? selected.join(", ")
                  : `Select ${field.placeholder}`}
              </div>

              {multiSelectOpen[field.name] && (
                <div className="absolute z-10 bg-white border rounded w-full mt-1 max-h-40 overflow-y-auto">
{Object.entries(field.options).map(([category, skills]) => {
  return (
    <div key={category} className="border-t border-gray-300 px-2 py-1">
      <div className="font-semibold text-gray-800 mb-1">{category}</div>
      {(skills as { _id: string; name: string }[]).map((opt) => (
        <label
          key={opt._id}
          className="block px-3 py-1 hover:bg-gray-100 cursor-pointer"
        >
          <input
            type="checkbox"
            value={opt._id}
            checked={selected.includes(opt._id)}
            onChange={(e) => {
              let updated = [...selected];
              if (e.target.checked) {
                updated.push(opt._id);
              } else {
                updated = updated.filter((v) => v !== opt._id);
              }

              onChange({
                target: {
                  name: field.name,
                  value: updated,
                },
              } as any);
            }}
            className="mr-2"
          />
          {opt.name}
        </label>
      ))}
    </div>
  );
})}


                </div>
              )}
            </div>
          );
        }

        // --- Normal select ---
        if (field.type === "select") {
          return (
            <div key={field.name}>
              <label className="block mb-1 font-medium">{field.placeholder}</label>
              <select
                name={field.name}
                value={form[field.name] || ""}
                onChange={onChange}
                className="w-full border p-2 rounded"
              >
                <option value="">Select {field.placeholder}</option>
                {field.options.map((opt: string) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          );
        }

        // --- Default: input ---
        return (
          <div key={field.name}>
            <label className="block mb-1 font-medium">{field.placeholder}</label>
            <input
              name={field.name}
              value={form[field.name] || ""}
              onChange={onChange}
              placeholder={field.placeholder}
              className="w-full border p-2 rounded"
            />
          </div>
        );
      })}
    </div>
  );
}

