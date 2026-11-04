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
import { getMySummary } from "@/api/client.api";
import { ClientSummary } from "@/types/user.type";
import ClientSummaryCard from "@/components/user/profile/ClientSummaryCard";

export default function Profile() {
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();

  const [form, setForm] = useState<any>({});
  const [profileImage, setProfileImage] = useState("");
  const [adminSkills, setAdminSkills] = useState<any>({});
  const [loading, setLoading] = useState(true);

  const isClient = user.role === "client";
  const BUDGET_RANGES = ["Under $100", "$100 - $500", "$500 - $2,000", "$2,000+"];

  const COMMON_FIELDS = [
      { name: "country", label: "Country", placeholder: "e.g. United States, Canada" },
      { name: "address", label: "Address", placeholder: "Private address (optional)" },
      { name: "workType", type: "select", label: "Work Type", placeholder: "Select work preference", options: ["Short-term", "Long-term", "Both"] },
      { name: "budgetRange", type: "select", label: "Budget Range", placeholder: "Select typical budget", options: BUDGET_RANGES },
      { name: "preferredTechStack", label: "Preferred Tech Stack", placeholder: "e.g. React, Node.js, Python" },
      { name: "about", type: "textarea", label: "About You", placeholder: "Write a brief introduction about yourself or your goals...", maxLength: 500 },
  ];

  const individualFields = [...COMMON_FIELDS];

  const companyFields = [
      { name: "companyName", label: "Company Name", placeholder: "e.g. Acme Corp" },
      { name: "contactTitle", label: "Your Role", placeholder: "e.g. Project Manager, CEO" },
      { name: "industry", label: "Industry", placeholder: "e.g. Fintech, Healthcare" },
      { name: "companySize", type: "select", label: "Company Size", placeholder: "Select company size", options: ["1", "2-10", "11-50", "51-200", "200+"] },
      { name: "website", label: "Company Website", placeholder: "https://yourcompany.com" },
      { name: "linkedinUrl", label: "LinkedIn Profile", placeholder: "https://linkedin.com/company/..." },
      ...COMMON_FIELDS,
  ];

  const clientFields = form.accountType === "company" ? companyFields : individualFields;

  const freelancerFields = [
      { name: "profession", label: "Profession / Title", placeholder: "e.g. Full Stack Developer" },
      { name: "company", label: "Current Company / Agency", placeholder: "e.g. Freelance or Agency name" },
      { name: "qualification", label: "Qualification", placeholder: "e.g. B.Tech in Computer Science" },
      { name: "bio", label: "Professional Bio", placeholder: "Short summary of your expertise..." },
      { name: "work_experience", label: "Work Experience", placeholder: "e.g. 5+ Years" },
      { name: "proficient_languages", label: "Languages", placeholder: "English, Spanish, French" },
      { name: "skills", type: "multiselect", label: "Skills", placeholder: "Select your skills" },
      { name: "working_days", label: "Working Days", placeholder: "e.g. Monday - Friday" },
      { name: "active_hours", label: "Active Hours", placeholder: "e.g. 9:00 AM - 6:00 PM EST" },
      { name: "portfolio", label: "Portfolio URL", placeholder: "https://yourportfolio.com" },
  ];

  const formFields = isClient ? clientFields : freelancerFields;

  const [summary, setSummary] = useState<ClientSummary | null>(null);

  useEffect(() => {
    if (!isClient) return;
    getMySummary()
      .then((res) => { if (res.success) setSummary(res.data.summary); })
      .catch(console.error);
  }, [isClient]);

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

        const profileRes = isClient? await getClientFullProfile() : await getFreelancerFullProfile();

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

  const pickFields = () => {
    const payload: Record<string, any> = Object.fromEntries(
      formFields.filter((f) => form[f.name] !== undefined).map((f) => [f.name, form[f.name]])
    );
    if (isClient && form.accountType) payload.accountType = form.accountType;

    if (typeof payload.proficient_languages === "string") {
      payload.proficient_languages = payload.proficient_languages
        .split(",")
        .map((s: string) => s.trim())
        .filter(Boolean);
    }
    return payload;
  };

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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex items-center space-x-3 text-gray-600">
          <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-lg font-medium">Loading profile...</span>
        </div>
      </div>
    );
  }

  const sectionTitle = !isClient
    ? "Professional Details"
    : form.accountType === "company"
    ? "Company Information"
    : "Your Details";

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl shadow-slate-200/60 overflow-hidden border border-slate-100">
        
        {/* Decorative Top Banner */}
        <div className="h-32 bg-gradient-to-r from-indigo-600 to-violet-600 relative"></div>

        <div className="px-8 pb-8">
          {/* Header Section with Overlapping Avatar */}
          <div className="flex flex-col items-center -mt-16 border-b border-slate-100 pb-8 mb-8">
            <div className="relative p-1 rounded-full">
              <ProfileImage image={profileImage} onImageChange={handleImageChange} />
            </div>
            <div className="mt-4 text-center">
              <EditableName name={user.name} onSave={handleNameSave} />
              <p className="text-slate-500 text-sm mt-1 font-medium">{user.email}</p>
            </div>
          </div>

          {/* Form Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-slate-800 tracking-tight">{sectionTitle}</h3>
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 capitalize">
                {user.role}
              </span>
            </div>

            {/* Added mb-6 wrapper or spacing for the summary card */}
            {isClient && summary && (
              <div className="mb-6">
                <ClientSummaryCard summary={summary} owner />
              </div>
            )}

            {isClient && (
              <div className="flex items-center justify-between bg-slate-50 border border-slate-200/80 rounded-xl p-4 mb-6 text-sm text-slate-600">
                <div>
                  Account type: <strong className="text-slate-900">{form.accountType === "company" ? "Company" : "Individual"}</strong>
                </div>
                <button
                  type="button"
                  className="font-semibold text-indigo-600 hover:text-indigo-700 underline underline-offset-2 transition-colors"
                  onClick={() =>
                    handleFormChange("accountType", form.accountType === "company" ? "individual" : "company")
                  }
                >
                  Switch to {form.accountType === "company" ? "Individual" : "Company"}
                </button>
              </div>
            )}

            <div className="space-y-4">
              <FormFields form={form} fields={formFields} onChange={handleFormChange} />
            </div>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSaveProfile}
            className="w-full bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold py-3.5 px-4 rounded-xl transition-all duration-200 shadow-lg shadow-indigo-500/25 focus:outline-none focus:ring-4 focus:ring-indigo-500/20"
          >
            Save Profile Changes
          </button>
        </div>
      </div>
    </div>
  );
} 