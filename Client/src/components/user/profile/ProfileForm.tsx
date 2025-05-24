import React from "react";

interface Props {
  form: any;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  fields: Array<any>;
}

export default function ProfileForm({ form, onChange, fields }: Props) {
  return (
    <div className="space-y-4 text-sm text-gray-700">
      {fields.map((field) =>
        field.type === "select" ? (
          <select
            key={field.name}
            name={field.name}
            value={form[field.name] || ""}
            onChange={onChange}
            className="w-full border p-2 rounded"
          >
            <option value="">Select {field.name}</option>
            {field.options.map((opt: string) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        ) : (
          <input
            key={field.name}
            name={field.name}
            value={form[field.name] || ""}
            onChange={onChange}
            placeholder={field.placeholder}
            className="w-full border p-2 rounded"
          />
        )
      )}
    </div>
  );
}
