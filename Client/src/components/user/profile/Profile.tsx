// import { useEffect, useState } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { RootState } from "@/redux/store";
// import { changeProfileImg, getClientFullProfile, getFreelancerFullProfile, getProfileImage } from "@/api/user.api";
// import { updateClientProfile } from "@/api/client.api";
// import { setUser } from "@/redux/slices/userSlice";
// import ProfileImageUploader from "./ProfileImageUploader";
// import EditableName from "./EditableName";
// import ProfileForm from "./ProfileForm";
// import { getSkills } from "@/api/admin.api";
// import { updateFreelancerProfile } from "@/api/freelancer.api";
// import toast from "react-hot-toast";

// export default function Profile() {
//   const user = useSelector((state: RootState) => state.user);
//   const dispatch = useDispatch();

//   const [form, setForm] = useState<any>({});
//   const [profileImage, setProfileImage] = useState("");
//   const [adminSkills, setAdminSkills] = useState<{ [category: string]: { _id: string; name: string }[] }>({});

// const clientFields = [
//   { name: "companyName", placeholder: "Company Name" },
//   { name: "website", placeholder: "Website" },
//   { name: "industry", placeholder: "Industry" },
//   { name: "address", placeholder: "Address" },
//   { name: "country", placeholder: "Country" },
//   { name: "workType", type: "select", options: ["Short-term", "Long-term", "Both"] },
//   { name: "budgetRange", placeholder: "Budget Range" },
//   { name: "preferredTechStack", placeholder: "Preferred Tech Stack" }
// ];

// const freelancerFields = [
//   { name: "profession", placeholder: "Profession" },
//   { name: "company", placeholder: "Company" },
//   { name: "qualification", placeholder: "Qualification" },
//   { name: "bio", placeholder: "Bio" },
//   { name: "work_experience", placeholder: "Work Experience" },
//   { name: "proficient_languages", placeholder: "Languages (comma-separated)" },
//   { name: "skills", type: "multiselect", placeholder:"Skills", options: adminSkills },
//   { name: "working_days", placeholder: "Working Days" },
//   { name: "active_hours", placeholder: "Active Hours" },
//   { name: "portfolio", placeholder: "Portfolio URL" }
// ];


//   const isClient = user.role === "client";
//   const isFreelancer = user.role === "freelancer";
//   const formFields = isClient ? clientFields : freelancerFields;

//   useEffect(() => {
//     const load = async () => {
//       try {
//         const response = await getProfileImage();
//         if (response.success) {
//           setProfileImage(response.data.user.profilePicture);
//           setForm(response.data.user);
//         }

//         const skillsRes = await getSkills();
//         if (skillsRes.success) {
//           setAdminSkills(skillsRes.data.skills || {});
//         }

//         let profileResponce;
//         if (isClient) {
//           profileResponce = await getClientFullProfile();
//         } else if (isFreelancer) {
//           profileResponce = await getFreelancerFullProfile();
//         }

//         if(profileResponce?.success){
//           setForm(profileResponce.data.fullProfile)
//         }
//       } catch (e) {
//         console.error(e);
//       }
//     };

//   load();
//   }, []);

//   const handleImageChange = async (file: File) => {
//     const formData = new FormData();
//     formData.append("profileImage", file);
//     formData.append("userId", user._id);
//     try {
//       const response = await changeProfileImg(formData);
//       if (response.success){
//         setProfileImage(response.data.user.profilePicture);
//       }else{
//         console.error("Image Upload Failed",response)
//       }
//     } catch (err) {
//       console.error("Image Upload Failed",err)
//     }
//   }

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSave = async () => {
//     try {
//       let response;

//       if (isClient) {
//         response = await updateClientProfile(form);
//       } else if (isFreelancer) {
//         response = await updateFreelancerProfile(form);
//       } else {
//         console.warn("Unknown role — cannot update profile");
//         return;
//       }

//       if (response.success) {
//         toast.success("Profile Updated");
//         dispatch(setUser(response.data.userDetails));

//         let profileResponse;
//         if (isClient) {
//           profileResponse = await getClientFullProfile();
//           if (profileResponse.success) {
//             setForm(profileResponse.data.fullProfile);
//           }
//         } else if (isFreelancer) {
//           profileResponse = await getFreelancerFullProfile();
//           if (profileResponse.success) {
//             setForm({
//               ...profileResponse.data.fullProfile,
//               skills: profileResponse.data.fullProfile.skills.map((s: any) =>
//                 typeof s === "string" ? s : s._id
//               ),
//             });
//           }
//         }
//       } else {
//         console.error("Failed to update profile", response);
//       }
//     } catch (err) {
//       console.error("Profile update error", err);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
//       <div className="bg-white w-full max-w-2xl rounded-md shadow p-6 border border-gray-300">
//         <div className="flex flex-col items-center relative">
//           <ProfileImageUploader image={profileImage} onChange={handleImageChange} />
//           <EditableName name={user.name} />
//           <p className="text-gray-600">{user.email}</p>
//         </div>
//         <hr className="my-4" />
//         <ProfileForm form={form} onChange={handleChange} fields={formFields} />
//         <button onClick={handleSave} className="w-full bg-blue-600 text-white py-2 mt-4 rounded hover:bg-blue-700">Save Profile</button>
//       </div>
//     </div>
//   );
// }



import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { setUser } from "@/redux/slices/userSlice";
import { changeProfileImg, getProfileImage, getClientFullProfile, getFreelancerFullProfile } from "@/api/user.api";
import { updateClientProfile } from "@/api/client.api";
import { updateFreelancerProfile } from "@/api/freelancer.api";
import { getSkills } from "@/api/admin.api";
import toast from "react-hot-toast";
import DefaultImage from "@/assets/userProfile.png";

// ============================================
// PROFILE IMAGE SECTION
// ============================================
function ProfileImage({ image, onImageChange }: { image: string; onImageChange: (file: File) => void }) {
  const inputRef = React.useRef<HTMLInputElement>(null);

  return (
    <div className="relative w-32 h-32 group cursor-pointer">
      <img 
        src={image || DefaultImage} 
        alt="Profile" 
        className="w-full h-full rounded-full object-cover border-4 border-blue-500 shadow-lg group-hover:shadow-xl transition-shadow"
      />
      <button
        onClick={() => inputRef.current?.click()}
        className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
      >
        <span className="text-white text-sm font-medium">Change Photo</span>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept=".jpg,.jpeg,.png,.webp"
        onChange={(e) => e.target.files?.[0] && onImageChange(e.target.files[0])}
        className="hidden"
      />
    </div>
  );
}

// ============================================
// EDITABLE NAME SECTION
// ============================================
function EditableName({ name, onSave }: { name: string; onSave: (newName: string) => void }) {
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(name);

  const handleSave = () => {
    onSave(newName);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="flex gap-2 items-center mt-4">
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          className="px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter your name"
        />
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
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
      <h2 className="text-2xl font-bold text-gray-800 flex items-center justify-center gap-2 cursor-pointer group">
        {name}
        <span className="opacity-0 group-hover:opacity-100 transition">✏️</span>
      </h2>
      <p 
        onClick={() => setIsEditing(true)}
        className="text-xs text-gray-500 mt-1 hover:text-blue-500 cursor-pointer"
      >
        Click to edit
      </p>
    </div>
  );
}

// ============================================
// FORM FIELDS SECTION
// ============================================
function FormFields({ 
  form, 
  fields, 
  onChange 
}: { 
  form: any; 
  fields: any[]; 
  onChange: (name: string, value: any) => void;
}) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

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

// ============================================
// MAIN PROFILE COMPONENT
// ============================================
export default function Profile() {
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();

  const [form, setForm] = useState<any>({});
  const [profileImage, setProfileImage] = useState("");
  const [adminSkills, setAdminSkills] = useState<any>({});
  const [loading, setLoading] = useState(true);

  const isClient = user.role === "client";

  const clientFields = [
    { name: "companyName", placeholder: "Company Name" },
    { name: "website", placeholder: "Website" },
    { name: "industry", placeholder: "Industry" },
    { name: "address", placeholder: "Address" },
    { name: "country", placeholder: "Country" },
    { name: "workType", type: "select", options: ["Short-term", "Long-term", "Both"] },
    { name: "budgetRange", placeholder: "Budget Range" },
    { name: "preferredTechStack", placeholder: "Preferred Tech Stack" },
  ];

  const freelancerFields = [
    { name: "profession", placeholder: "Profession" },
    { name: "company", placeholder: "Company" },
    { name: "qualification", placeholder: "Qualification" },
    { name: "bio", placeholder: "Bio" },
    { name: "work_experience", placeholder: "Work Experience" },
    { name: "proficient_languages", placeholder: "Languages (comma-separated)" },
    { name: "skills", type: "multiselect", placeholder: "Skills", options: adminSkills },
    { name: "working_days", placeholder: "Working Days" },
    { name: "active_hours", placeholder: "Active Hours" },
    { name: "portfolio", placeholder: "Portfolio URL" },
  ];

  const formFields = isClient ? clientFields : freelancerFields;

  // Load profile data
  useEffect(() => {
    const loadData = async () => {
      try {
        const imageRes = await getProfileImage();
        if (imageRes.success) {
          setProfileImage(imageRes.data.user.profilePicture);
          setForm(imageRes.data.user);
        }

        const skillsRes = await getSkills();
        if (skillsRes.success) {
          setAdminSkills(skillsRes.data.skills || {});
        }

        const profileRes = isClient
          ? await getClientFullProfile()
          : await getFreelancerFullProfile();

        if (profileRes?.success) {
          const profileData = profileRes.data.fullProfile;
          if (isClient) {
            setForm(profileData);
          } else {
            setForm({
              ...profileData,
              skills: Array.isArray(profileData.skills)
                ? profileData.skills.map((s: any) => (typeof s === "string" ? s : s._id))
                : [],
            });
          }
        }
      } catch (err) {
        console.error("Error loading profile:", err);
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [isClient]);

  // Handle image upload
  const handleImageChange = async (file: File) => {
    const formData = new FormData();
    formData.append("profileImage", file);
    formData.append("userId", user._id);

    try {
      const response = await changeProfileImg(formData);
      if (response.success) {
        setProfileImage(response.data.user.profilePicture);
        toast.success("Profile image updated");
      }
    } catch (err) {
      console.error("Image upload failed:", err);
      toast.error("Failed to upload image");
    }
  };

  // Handle form field changes
  const handleFormChange = (name: string, value: any) => {
    setForm({ ...form, [name]: value });
  };

  // Handle name save
  const handleNameSave = async (newName: string) => {
    try {
      const response = isClient
        ? await updateClientProfile({ ...form, name: newName })
        : await updateFreelancerProfile({ ...form, name: newName });

      if (response.success) {
        setForm({ ...form, name: newName });
        dispatch(setUser({ ...user, name: newName }));
        toast.success("Name updated");
      }
    } catch (err) {
      console.error("Error updating name:", err);
      toast.error("Failed to update name");
    }
  };

  // Handle save profile
  const handleSaveProfile = async () => {
    try {
      const response = isClient
        ? await updateClientProfile(form)
        : await updateFreelancerProfile(form);

      if (response.success) {
        dispatch(setUser(response.data.userDetails));
        toast.success("Profile updated successfully!");
      } else {
        toast.error("Failed to update profile");
      }
    } catch (err) {
      console.error("Error saving profile:", err);
      toast.error("An error occurred while saving");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-200 to-indigo-500 p-4">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        {/* Header Section */}
        <div className="text-center border-b pb-6 mb-6">
          <ProfileImage image={profileImage} onImageChange={handleImageChange} />
          <EditableName name={user.name} onSave={handleNameSave} />
          <p className="text-gray-500 text-sm mt-2">{user.email}</p>
        </div>

        {/* Form Section */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            {isClient ? "Company Information" : "Professional Details"}
          </h3>
          <FormFields form={form} fields={formFields} onChange={handleFormChange} />
        </div>

        {/* Save Button */}
        <button
          onClick={handleSaveProfile}
          className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition shadow-md"
        >
          Save Profile
        </button>
      </div>
    </div>
  );
}