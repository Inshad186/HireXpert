import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { setUser } from "@/redux/slices/userSlice";
import { changeProfileImg, getProfileImage, getClientFullProfile, getFreelancerFullProfile } from "@/api/user.api";
import { updateClientProfile } from "@/api/client.api";
import { updateFreelancerProfile } from "@/api/freelancer.api";
import { getSkills } from "@/api/admin.api";
import toast from "react-hot-toast";
import ProfileImage from "@/components/user/profile/ProfileImageUploader";
import FormFields from "@/components/user/profile/ProfileForm";
import EditableName from "@/components/user/profile/EditableName";

export default function Profile() {
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();

  const [form, setForm] = useState<any>({});
  const [profileImage, setProfileImage] = useState("");
  const [adminSkills, setAdminSkills] = useState<any>({});
  const [loading, setLoading] = useState(true);

  const isClient = user.role === "client";

  const isCompany = (f: any) => f.accountType === "company";

  const clientFields = [
    { name: "accountType", type: "select", placeholder: "Account Type", options: ["individual", "company"] },
    { name: "companyName", placeholder: "Company Name", showIf: isCompany },
    { name: "companySize", type: "select", placeholder: "Company Size", options: ["1", "2-10", "11-50", "51-200", "200+"], showIf: isCompany },
    { name: "industry", placeholder: "Industry" },
    { name: "website", placeholder: "Website (https://...)" },
    { name: "country", placeholder: "Country" },
    { name: "address", placeholder: "Address (private)" },
    { name: "workType", type: "select", placeholder: "Work Type", options: ["Short-term", "Long-term", "Both"] },
    { name: "budgetRange", placeholder: "Budget Range" },
    { name: "preferredTechStack", placeholder: "Preferred Tech Stack" },
    { name: "about", type: "textarea", placeholder: "About", maxLength: 500 },
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

  useEffect(() => {
    const loadData = async () => {
      try {
        const imageRes = await getProfileImage();
        if (imageRes.success) {
          setProfileImage(imageRes.data.user.profilePicture);
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

    const handleNameSave = async (newName: string) => {
    try {
        const response = isClient ? await updateClientProfile({ name: newName }) : await updateFreelancerProfile({ name: newName });
        if (response.success) {
        setForm((prev: any) => ({ ...prev, name: newName }));
        dispatch(setUser({ ...user, name: newName }));
        toast.success("Name updated");
        }
    } catch (err: any) {
        toast.error(err?.response?.data?.message || "Failed to update name");
    }
    };

    const handleFormChange = (name: string, value: any) =>
    setForm((prev: any) => ({ ...prev, [name]: value }));

  // Handle save profile
    const pickFields = () =>
    Object.fromEntries(
        formFields.filter((f) => form[f.name] !== undefined).map((f) => [f.name, form[f.name]])
    );

    const handleSaveProfile = async () => {
    try {
        const payload = pickFields();
        const response = isClient ? await updateClientProfile(payload) : await updateFreelancerProfile(payload);
        if (response.success) {
        dispatch(setUser(response.data.userDetails));
        toast.success("Profile updated successfully!");
        } else {
        toast.error("Failed to update profile");
        }
    } catch (err: any) {
        console.error("Error saving profile:", err);
        toast.error(err?.response?.data?.message || "An error occurred while saving");
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