
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { getFreelancerFullProfile, changeProfile, getProfileImage } from "@/api/user.api";
import { updateFreelancerProfile } from "@/api/freelancer.api";
import { getSkills } from "@/api/admin.api";
import { setUser } from "@/redux/slices/userSlice";
import { data, useNavigate } from "react-router-dom";
import ProfileImageUploader from "../profile/ProfileImageUploader";
import EditableName from "../profile/EditableName";
import ProfileForm from "../profile/ProfileForm";
import { userRoutes } from "@/constants/routeUrl";
import toast from "react-hot-toast";

export default function CompleteFreelancerProfile() {
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [form, setForm] = useState<any>({});
  const [profileImage, setProfileImage] = useState("");
  const [adminSkills, setAdminSkills] = useState<{ [category: string]: { _id: string; name: string }[] }>({});

  const fields = [
    { name: "profession", placeholder: "Profession" },
    { name: "company", placeholder: "Company" },
    { name: "qualification", placeholder: "Qualification" },
    { name: "bio", placeholder: "Bio" },
    { name: "work_experience", placeholder: "Work Experience" },
    { name: "proficient_languages", placeholder: "Languages (comma-separated)" },
    { name: "skills", type: "multiselect", placeholder: "Skills", options: adminSkills },
    { name: "working_days", placeholder: "Working Days" },
    { name: "active_hours", placeholder: "Active Hours" },
    { name: "portfolio", placeholder: "Portfolio URL" }
  ];

  useEffect(() => {
    const load = async () => {
      try {
        const profImageresp = await getProfileImage()
        if(profImageresp.success){
          setProfileImage(profImageresp.data.user.profilePicture)
        }

        const response = await getFreelancerFullProfile();
        if (response.success) {
          setForm(response.data.fullProfile);
        }

        const imageRes = await changeProfile(new FormData());
        console.log("Image Respond >>>>> : ",imageRes)
        if (imageRes.success) {
          setProfileImage(imageRes.data.user.profilePicture);
        }

        const skillsRes = await getSkills();
        if (skillsRes.success) {
          setAdminSkills(skillsRes.data.skills || {});
        }
      } catch (err) {
        console.error("Error loading freelancer profile", err);
      }
    };

    load();
  }, []);

  const handleImageChange = async (file: File) => {
    const formData = new FormData();
    formData.append("profileImage", file);
    formData.append("userId", user._id);

    const res = await changeProfile(formData);
    if (res.success) {
      setProfileImage(res.data.user.profilePicture);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    const response = await updateFreelancerProfile(form);
    if (response.success) {
      toast.success("Updated Successfully")
      dispatch(setUser(response.data.userDetails));
      navigate(userRoutes.CREATE_GIG); 
    } else {
      console.error("Failed to update profile", response);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white w-full max-w-2xl rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-center mb-6 text-gray-800">
          Complete Your Freelancer Profile
        </h2>

        <div className="flex flex-col items-center">
          <ProfileImageUploader image={profileImage} onChange={handleImageChange} />
          <EditableName name={user.name} />
          <p className="text-gray-600 mb-4">{user.email}</p>
        </div>

        <ProfileForm form={form} onChange={handleChange} fields={fields} />

        <button
          onClick={handleSave}
          className="mt-6 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Save & Continue
        </button>
      </div>
    </div>
  );
}

