import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { changeProfile, getProfileImage, updateUserDetails } from "@/api/user.api";
import { setUser } from "@/redux/slices/userSlice";
import ProfileImageUploader from "./ProfileImageUploader";
import EditableName from "./EditableName";
import ProfileForm from "./ProfileForm";
import { clientFields, freelancerFields } from "./formConfig"

export default function Profile() {
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();

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
    const response = await changeProfile(formData);
    if (response.success) setProfileImage(response.data.user.profilePicture);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    const response = await updateUserDetails(form);
    console.log("Woow response got it >?>> : ",response.data)
    if (response.success){
      dispatch(setUser(response.data.userDetails.userDetails));
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
