import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { RootState } from "@/redux/store";
import { getFreelancerFullProfile, changeProfileImg, getProfileImage } from "@/api/user.api";
import { updateFreelancerProfile } from "@/api/freelancer.api";
import { getSkills } from "@/api/admin.api";
import { setUser } from "@/redux/slices/userSlice";
import { userRoutes } from "@/constants/routeUrl";
import ProfileImageUploader from "../profile/ProfileImageUploader";
import EditableName from "../profile/EditableName";
import ProfileForm from "../profile/ProfileForm";

export default function CompleteFreelancerProfile() {
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [form, setForm] = useState<any>({});
  const [profileImage, setProfileImage] = useState("");
  const [adminSkills, setAdminSkills] = useState<{ [category: string]: { _id: string; name: string }[] }>({});
  const [wasComplete, setWasComplete] = useState(false);
  const [saving, setSaving] = useState(false);

  const fields = [
    { name: "profession", placeholder: "Profession" },
    { name: "company", placeholder: "Company" },
    { name: "qualification", placeholder: "Qualification" },
    { name: "bio", placeholder: "Bio" },
    { name: "work_experience", placeholder: "Work Experience" },
    { name: "proficient_languages", placeholder: "Languages (comma-separated)" },
    { name: "profileSkills", type: "multiselect", placeholder: "Skills", options: adminSkills },
    { name: "working_days", placeholder: "Working Days" },
    { name: "active_hours", placeholder: "Active Hours" },
    { name: "portfolio", placeholder: "Portfolio URL" },
  ];

  useEffect(() => {
    let ignore = false;

    const load = async () => {
      try {
        const [imageRes, profileRes, skillsRes] = await Promise.all([
          getProfileImage(),
          getFreelancerFullProfile(),
          getSkills(),
        ]);
        if (ignore) return;

        if (imageRes.success) setProfileImage(imageRes.data.user.profilePicture);
        if (skillsRes.success) setAdminSkills(skillsRes.data.skills || {});

        if (profileRes.success) {
          const profile = profileRes.data.fullProfile;
          setForm({
            ...profile,
            // the text input needs one string, and the backend needs an array
            proficient_languages: Array.isArray(profile.proficient_languages)
              ? profile.proficient_languages.join(", ")
              : profile.proficient_languages ?? "",
            // populated skills arrive as objects, but the checkboxes compare ids
            profileSkills: (profile.profileSkills ?? []).map((s: any) => s._id ?? s),
          });
          setWasComplete(Boolean(profile.isProfileComplete));
        }
      } catch (err) {
        console.error("Error loading freelancer profile", err);
        toast.error("Could not load your profile");
      }
    };

    load();
    return () => { ignore = true; };
  }, []);

  const handleImageChange = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("profileImage", file);
      formData.append("userId", user._id);

      const res = await changeProfileImg(formData);
      if (res.success) {
        setProfileImage(res.data.user.profilePicture);
        toast.success("Profile image updated");
      }
    } catch (err) {
      console.error("Image upload failed:", err);
      toast.error("Failed to upload image");
    }
  };

  // Error 2 fixed: the form now calls onChange(name, value)
  const handleChange = (name: string, value: any) =>
    setForm((prev: any) => ({ ...prev, [name]: value }));

  // Error 1 fixed: this is the function passed as onSave
  const handleNameSave = async (newName: string) => {
    const name = newName.trim();
    if (!name) return toast.error("Name cannot be empty");

    try {
      const response = await updateFreelancerProfile({ name });
      if (response.success) {
        dispatch(setUser({ ...user, name }));
        toast.success("Name updated");
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to update name");
    }
  };

  const handleSave = async () => {
    if (saving) return;

    // the same rule the backend uses to mark a profile complete
    if (!form.profession?.trim() || !form.bio?.trim() || !form.profileSkills?.length) {
      return toast.error("Please fill profession, bio and at least one skill");
    }

    setSaving(true);
    try {
      // send only the fields shown in the form
      const payload: Record<string, any> = Object.fromEntries(
        fields.filter((f) => form[f.name] !== undefined).map((f) => [f.name, form[f.name]])
      );
      if (typeof payload.proficient_languages === "string") {
        payload.proficient_languages = payload.proficient_languages
          .split(",")
          .map((s: string) => s.trim())
          .filter(Boolean);
      }

      const response = await updateFreelancerProfile(payload);
      if (response.success) {
        toast.success("Updated Successfully");
        dispatch(setUser(response.data.userDetails));
        navigate(wasComplete ? userRoutes.FREELANCER_DASH : userRoutes.CREATE_GIG);
      } else {
        toast.error("Failed to update profile");
      }
    } catch (err: any) {
      console.error("Failed to update profile", err);
      toast.error(err?.response?.data?.message || "An error occurred while saving");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white w-full max-w-2xl rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-center mb-6 text-gray-800">
          {wasComplete ? "Edit Your Freelancer Profile" : "Complete Your Freelancer Profile"}
        </h2>

        <div className="flex flex-col items-center">
          <ProfileImageUploader image={profileImage} onImageChange={handleImageChange} />
          <EditableName name={user.name} onSave={handleNameSave} />
          <p className="text-gray-600 mb-4">{user.email}</p>
        </div>

        <ProfileForm form={form} onChange={handleChange} fields={fields} />

        <button
          onClick={handleSave}
          disabled={saving}
          className="mt-6 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          {saving ? "Saving..." : wasComplete ? "Save Changes" : "Save & Continue"}
        </button>
      </div>
    </div>
  );
}