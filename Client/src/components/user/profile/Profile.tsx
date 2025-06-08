import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { changeProfile, getProfileImage, updateUserDetails } from "@/api/user.api";
import { setUser } from "@/redux/slices/userSlice";
import ProfileImageUploader from "./ProfileImageUploader";
import EditableName from "./EditableName";
import ProfileForm from "./ProfileForm";

export default function Profile() {
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();

const clientFields = [
  { name: "companyName", placeholder: "Company Name" },
  { name: "website", placeholder: "Website" },
  { name: "industry", placeholder: "Industry" },
  { name: "address", placeholder: "Address" },
  { name: "country", placeholder: "Country" },
  { name: "workType", type: "select", options: ["Short-term", "Long-term", "Both"] },
  { name: "budgetRange", placeholder: "Budget Range" },
  { name: "preferredTechStack", placeholder: "Preferred Tech Stack" }
];

const freelancerFields = [
  { name: "profession", placeholder: "Profession" },
  { name: "company", placeholder: "Company" },
  { name: "qualification", placeholder: "Qualification" },
  { name: "bio", placeholder: "Bio" },
  { name: "work_experience", placeholder: "Work Experience" },
  { name: "proficient_languages", placeholder: "Languages (comma-separated)" },
  { name: "skills", placeholder: "Skills (comma-separated)" },
  { name: "working_days", placeholder: "Working Days" },
  { name: "active_hours", placeholder: "Active Hours" },
  { name: "basic_price", placeholder: "Basic Price" },
  { name: "standard_price", placeholder: "Standard Price" },
  { name: "premium_price", placeholder: "Premium Price" },
  { name: "portfolio", placeholder: "Portfolio URL" }
];


  const [form, setForm] = useState<any>({});
  const [profileImage, setProfileImage] = useState("");

  const isClient = user.role === "client";
  const isFreelancer = user.role === "freelancer";
  const formFields = isClient ? clientFields : freelancerFields;

  useEffect(() => {
    const load = async () => {
      try {
        const response = await getProfileImage();
        if (response.success) {
          setProfileImage(response.data.user.profilePicture);
          setForm({ ...form, ...response.data.user });
        }
      } catch (e) {
        console.error(e);
      }
    };
    load();
  }, []);

  const handleImageChange = async (file: File) => {
    const formData = new FormData();
    formData.append("profileImage", file);
    formData.append("userId", user._id);
    try {
      const response = await changeProfile(formData);
      if (response.success){
        setProfileImage(response.data.user.profilePicture);
      }else{
        console.error("Image Upload Failed",response)
      }
    } catch (err) {
      console.error("Image Upload Failed",err)
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const response = await updateUserDetails(form);
      console.log("Woow response got it >?>> : ",response.data)
      if (response.success){
        dispatch(setUser(response.data.userDetails.userDetails));
      }else{
        console.error("Failed to update profile", response);
      }
    } catch (err) {
      console.error("Profile update error", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white w-full max-w-2xl rounded-md shadow p-6 border border-gray-300">
        <div className="flex flex-col items-center relative">
          <ProfileImageUploader image={profileImage} onChange={handleImageChange} />
          <EditableName name={user.name} />
          <p className="text-gray-600">{user.email}</p>
        </div>
        <hr className="my-4" />
        <ProfileForm form={form} onChange={handleChange} fields={formFields} />
        <button onClick={handleSave} className="w-full bg-blue-600 text-white py-2 mt-4 rounded hover:bg-blue-700">Save Profile</button>
      </div>
    </div>
  );
}
