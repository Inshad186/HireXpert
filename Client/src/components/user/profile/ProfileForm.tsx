import React,{useState} from "react";

interface Props {
  form: any;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  fields: Array<any>;
}

export default function ProfileForm({ form, onChange, fields }: Props) {
  return (
    <div className="space-y-4 text-sm text-gray-700">
      {fields.map((field) => {

        // --- Custom Multiselect ---
        if (field.type === "multiselect") {
          const selected = form[field.name] || [];
          const [open, setOpen] = useState(false);

          return (
            <div key={field.name} className="relative">
              <label className="block mb-1 font-medium">{field.placeholder}</label>
              <div
                onClick={() => setOpen(!open)}
                className="border p-2 rounded cursor-pointer bg-white"
              >
                {selected.length > 0
                  ? selected.join(", ")
                  : `Select ${field.placeholder}`}
              </div>

              {open && (
                <div className="absolute z-10 bg-white border rounded w-full mt-1 max-h-40 overflow-y-auto">
                  {field.options.map((opt: string) => (
                    <label
                      key={opt}
                      className="block px-3 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        value={opt}
                        checked={selected.includes(opt)}
                        onChange={(e) => {
                          let updated = [...selected];
                          if (e.target.checked) {
                            updated.push(opt);
                          } else {
                            updated = updated.filter((v) => v !== opt);
                          }

                          onChange({
                            target: {
                              name: field.name,
                              value: updated
                            }
                          } as any);
                        }}
                        className="mr-2"
                      />
                      {opt}
                    </label>
                  ))}
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

