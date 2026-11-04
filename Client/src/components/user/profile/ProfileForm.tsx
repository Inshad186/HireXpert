import { useState } from "react";

function FormFields({ form, fields, onChange }: { form: any; fields: any[]; onChange: (name: string, value: any) => void;}) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {fields.map((field) => {
        const labelText = field.label || field.placeholder;
        const placeholderText = field.placeholder || `Enter ${labelText}`;

        // Multi-select field
        if (field.type === "multiselect") {
          const selected = form[field.name] || [];

          return (
            <div key={field.name}>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                {labelText}
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setOpenDropdown(openDropdown === field.name ? null : field.name)}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl bg-white text-left hover:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition text-sm text-slate-800"
                >
                  {selected.length > 0 
                    ? selected
                        .map((id: string) => {
                          const allSkills = Object.values(field.options || {}).flat() as any[];
                          return allSkills.find((s) => s._id === id)?.name || id;
                        })
                        .slice(0, 2)
                        .join(", ") + (selected.length > 2 ? ` +${selected.length - 2} more` : "")
                    : placeholderText}
                </button>

                {openDropdown === field.name && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl z-10 max-h-48 overflow-y-auto">
                    {Object.entries(field.options || {}).map(([category, skills]) => (
                      <div key={category}>
                        <div className="px-3 py-2 font-semibold text-slate-500 bg-slate-50 text-xs uppercase tracking-wider">
                          {category}
                        </div>
                        {Array.isArray(skills) && skills.map((skill: any) => (
                          <label key={skill._id} className="flex items-center px-3 py-2 hover:bg-indigo-50 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={selected.includes(skill._id)}
                              onChange={(e) => {
                                const updated = e.target.checked
                                  ? [...selected, skill._id]
                                  : selected.filter((s: string) => s !== skill._id);
                                onChange(field.name, updated);
                              }}
                              className="mr-2.5 w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 cursor-pointer"
                            />
                            <span className="text-sm text-slate-700">{skill.name}</span>
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
              <label className="block text-sm font-medium text-slate-700 mb-2">
                {labelText}
              </label>
              <select
                value={form[field.name] || ""}
                onChange={(e) => onChange(field.name, e.target.value)}
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm text-slate-800"
              >
                <option value="">{placeholderText}</option>
                {field.options.map((opt: string) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          );
        }

        // Textarea field
        if (field.type === "textarea") {
          return (
            <div key={field.name} className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">{labelText}</label>
              <textarea
                rows={4}
                maxLength={field.maxLength}
                value={form[field.name] || ""}
                onChange={(e) => onChange(field.name, e.target.value)}
                placeholder={placeholderText}
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none text-sm text-slate-800"
              />
            </div>
          );
        }

        // Text input field
        return (
          <div key={field.name}>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              {labelText}
            </label>
            <input
              type="text"
              value={form[field.name] || ""}
              onChange={(e) => onChange(field.name, e.target.value)}
              placeholder={placeholderText}
              className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm text-slate-800"
            />
          </div>
        );
      })}
    </div>
  );
}

export default FormFields;