import { useEffect, useState } from "react";
import { getSkills } from "@/api/admin.api";
import { createGig } from "@/api/freelancer.api";
import { useNavigate } from "react-router-dom";
import { userRoutes } from "@/constants/routeUrl";
import toast from "react-hot-toast";
import GigComp from "@/components/user/freelancer/gig/GigComp";

interface PricingPlan {
  price: number;
  description: string;
  deliveryTime: number;
}

interface GigFormData {
  title: string;
  description: string;
  category: string;
  skills: string[];
  pricing: {
    basic: PricingPlan;
    standard: PricingPlan;
    premium: PricingPlan;
  };
  gallery: File[];
}

const initialForm: GigFormData = {
  title: "",
  description: "",
  category: "",
  skills: [],
  pricing: {
    basic: { price: 0, description: "", deliveryTime: 0 },
    standard: { price: 0, description: "", deliveryTime: 0 },
    premium: { price: 0, description: "", deliveryTime: 0 },
  },
  gallery: [],
};

function Gig() {
  const navigate = useNavigate();

  const [form, setForm] = useState<GigFormData>(initialForm);

  const [adminSkills, setAdminSkills] = useState<{
    [category: string]: { _id: string; name: string }[];
  }>({});

  const [loading, setLoading] = useState(false);

  const MAX_IMAGES = 3;
  const MAX_IMAGE_SIZE = 3 * 1024 * 1024;

  // Fetch skills
  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await getSkills();

        if (response.success) {
          setAdminSkills(response.data.skills);
        }
      } catch (error) {
        console.error("Error fetching skills:", error);
        toast.error("Failed to load skills");
      }
    };

    fetchSkills();
  }, []);

  // Form validation
  const validateForm = (): string | null => {
    if (!form.title.trim()) return "Title is required";
    if (!form.description.trim()) return "Description is required";
    if (!form.category) return "Category is required";
    if (form.skills.length === 0) return "Select at least one skill";
    if (form.gallery.length === 0) return "Upload at least one image";

    const { basic, standard, premium } = form.pricing;

    if (basic.price <= 0) return "Basic package price is required";
    if (!basic.description.trim())
      return "Basic package description is required";
    if (basic.deliveryTime <= 0)
      return "Basic package delivery time is required";

    const optionalPlans = { standard, premium };

    for (const [name, plan] of Object.entries(optionalPlans)) {
      const filled = [
        plan.price > 0,
        plan.description.trim() !== "",
        plan.deliveryTime > 0,
      ];

      const count = filled.filter(Boolean).length;

      if (count > 0 && count < 3) {
        return `Please fill price, description and delivery time for the ${name} package, or leave it empty`;
      }
    }

    return null;
  };

  // Handle normal inputs
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "category" ? { skills: [] } : {}),
    }));
  };

  // Handle pricing
  const handlePricingChange = (
    level: "basic" | "standard" | "premium",
    field: "price" | "description" | "deliveryTime",
    value: string
  ) => {
    setForm((prev) => ({
      ...prev,
      pricing: {
        ...prev.pricing,
        [level]: {
          ...prev.pricing[level],
          [field]:
            field === "price" || field === "deliveryTime"
              ? Number(value)
              : value,
        },
      },
    }));
  };

  // Handle skills
  const handleSkillToggle = (skillId: string) => {
    setForm((prev) => {
      const exists = prev.skills.includes(skillId);

      const updatedSkills = exists
        ? prev.skills.filter((s) => s !== skillId)
        : [...prev.skills, skillId];

      return { ...prev, skills: updatedSkills };
    });
  };

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);

    // Allow selecting the same file again
    e.target.value = "";

    const tooBig = files.find((file) => file.size > MAX_IMAGE_SIZE);

    if (tooBig) {
      return toast.error(`${tooBig.name} is larger than 3 MB`);
    }

    if (form.gallery.length + files.length > MAX_IMAGES) {
      return toast.error(`You can upload up to ${MAX_IMAGES} images`);
    }

    setForm((prev) => ({
      ...prev,
      gallery: [...prev.gallery, ...files],
    }));
  };

  // Remove image
  const handleRemoveImage = (index: number) => {
    setForm((prev) => ({
      ...prev,
      gallery: prev.gallery.filter((_, i) => i !== index),
    }));
  };

  // Submit gig
  const handleSubmit = async () => {
    const validationError = validateForm();

    if (validationError) {
      toast.error(validationError);
      return;
    }

    setLoading(true);

    try {
      const gigForm = new FormData();

      gigForm.append("title", form.title);
      gigForm.append("description", form.description);
      gigForm.append("category", form.category);
      gigForm.append("skills", JSON.stringify(form.skills));

      form.gallery.forEach((file) => {
        gigForm.append("gallery", file);
      });

      const pricingObj: { basic: PricingPlan; standard?: PricingPlan; premium?: PricingPlan } = { basic: form.pricing.basic };

      if (
        form.pricing.standard.price > 0 &&
        form.pricing.standard.deliveryTime > 0 &&
        form.pricing.standard.description.trim()
      ) {
        pricingObj.standard = form.pricing.standard;
      }

      if (
        form.pricing.premium.price > 0 &&
        form.pricing.premium.deliveryTime > 0 &&
        form.pricing.premium.description.trim()
      ) {
        pricingObj.premium = form.pricing.premium;
      }

      gigForm.append("pricing", JSON.stringify(pricingObj));

      const res = await createGig(gigForm);

      if (res.success) {
        toast.success("Gig Created Successfully!");
        setForm(initialForm);
        navigate(userRoutes.LISTED_GIG);
      } else {
        toast.error(res.error || "Gig creation failed");
      }
    } catch (error) {
      console.error("Error creating gig:", error);
      toast.error("An error occurred while creating the gig");
    } finally {
      setLoading(false);
    }
  };

  return (
    <GigComp
      form={form}
      adminSkills={adminSkills}
      loading={loading}
      onChange={handleChange}
      onPricingChange={handlePricingChange}
      onSkillToggle={handleSkillToggle}
      onImageUpload={handleImageUpload}
      onRemoveImage={handleRemoveImage}
      onSubmit={handleSubmit}
    />
  );
}

export default Gig;