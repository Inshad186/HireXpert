import { useState } from "react";

function EditableName({ name, onSave }: { name: string; onSave: (newName: string) => void }) {
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(name);

  const handleSave = () => {
    onSave(newName);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="flex gap-2 items-center justify-center mt-4">
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          className="px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter your name"
        />
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition"
        >
          Save
        </button>
        <button
          onClick={() => setIsEditing(false)}
          className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <div className="mt-4 text-center">
      <h2
        onClick={() => setIsEditing(true)}
        className="text-2xl font-bold text-gray-800 flex items-center justify-center gap-2 cursor-pointer group"
      >
        {name}
        <span className="opacity-0 group-hover:opacity-100 text-sm text-indigo-600 transition">
          edit
        </span>
      </h2>
    </div>
  );
}

export default EditableName