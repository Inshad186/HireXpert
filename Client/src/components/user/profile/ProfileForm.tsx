import { useState } from "react";

function FormFields({ form, fields, onChange }: { form: any; fields: any[]; onChange: (name: string, value: any) => void;}) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const visibleFields = fields.filter((f) => !f.showIf || f.showIf(form));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {fields.map((field) => {
        // Multi-select field
        if (field.type === "multiselect") {
          const selected = form[field.name] || [];

          return (
            <div key={field.name}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {field.placeholder}
              </label>
              <div className="relative">
                <button
                  onClick={() => setOpenDropdown(openDropdown === field.name ? null : field.name)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-left hover:border-blue-400 transition"
                >
                  {selected.length > 0 
                    ? selected
                        .map((id: string) => {
                          const allSkills = Object.values(field.options || {}).flat() as any[];
                          return allSkills.find((s) => s._id === id)?.name || id;
                        })
                        .slice(0, 2)
                        .join(", ") + (selected.length > 2 ? `+${selected.length - 2}` : "")
                    : `Select ${field.placeholder}`
                  }
                </button>

                {openDropdown === field.name && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                    {Object.entries(field.options || {}).map(([category, skills]) => (
                      <div key={category}>
                        <div className="px-3 py-2 font-semibold text-gray-700 bg-gray-50 text-xs">
                          {category}
                        </div>
                        {Array.isArray(skills) && skills.map((skill: any) => (
                          <label key={skill._id} className="flex items-center px-3 py-2 hover:bg-blue-50 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={selected.includes(skill._id)}
                              onChange={(e) => {
                                const updated = e.target.checked
                                  ? [...selected, skill._id]
                                  : selected.filter((s: string) => s !== skill._id);
                                onChange(field.name, updated);
                              }}
                              className="mr-2 w-4 h-4 cursor-pointer"
                            />
                            <span className="text-sm">{skill.name}</span>
                          </label>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        }

        // Select field
        if (field.type === "select") {
          return (
            <div key={field.name}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {field.placeholder}
              </label>
              <select
                value={form[field.name] || ""}
                onChange={(e) => onChange(field.name, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select {field.placeholder}</option>
                {field.options.map((opt: string) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          );
        }

      if (field.type === "textarea") {
        return (
          <div key={field.name} className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">{field.placeholder}</label>
            <textarea
              rows={4}
              maxLength={field.maxLength}
              value={form[field.name] || ""}
              onChange={(e) => onChange(field.name, e.target.value)}
              placeholder={field.placeholder}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>
        );
      }

        // Text input field
        return (
          <div key={field.name}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {field.placeholder}
            </label>
            <input
              type="text"
              value={form[field.name] || ""}
              onChange={(e) => onChange(field.name, e.target.value)}
              placeholder={field.placeholder}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        );
      })}
    </div>
  );
}

export default FormFields