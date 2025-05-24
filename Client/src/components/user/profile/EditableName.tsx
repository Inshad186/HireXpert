import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/slices/userSlice";
import { editUserName } from "@/api/user.api";

export default function EditableName({ name }: { name: string }) {
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(name);

  const handleSave = async () => {
    const response = await editUserName(newName);
    dispatch(setUser({ name: newName }));
    setIsEditing(false);
  };

  return isEditing ? (
    <div className="flex items-center gap-2">
      <input value={newName} onChange={(e) => setNewName(e.target.value)} className="border px-2 py-1 rounded text-sm" />
      <button onClick={handleSave} className="text-blue-600 text-sm font-medium hover:underline">Save</button>
    </div>
  ) : (
    <h2 onClick={() => setIsEditing(true)} className="text-xl font-semibold flex items-center gap-1 cursor-pointer">
      {name} <span className="text-sm">✏️</span>
    </h2>
  );
}
