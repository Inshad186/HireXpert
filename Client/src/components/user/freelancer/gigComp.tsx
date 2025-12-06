import { useEffect, useState } from "react";
import { getSkills } from "@/api/admin.api";
import { createGig } from "@/api/freelancer.api";
import { useNavigate } from "react-router-dom";
import { userRoutes } from "@/constants/routeUrl";
import { ProjectDetail } from "@/types/user.type";
import toast from "react-hot-toast";

function GigComp() {

  const navigate = useNavigate()
    const [form, setForm] = useState<any>({
        title: "",
        description: "",
        category: "",
        skills: [],
        pricing: {
          basic: { price: 0, description: "", deliveryTime: 0 },
          standard: { price: 0, description: "", deliveryTime: 0 },
          premium: { price: 0, description: "", deliveryTime: 0 }
        },
        gallery:[]
    });

    const [adminSkills, setAdminSkills] = useState<{ [category: string]: { _id: string; name: string }[] }>({});
    const [loading, setLoading] = useState(false)


    const validateForm = (): string | null => {
      if(!form.title.trim()) return "Title is required";
      if(!form.description.trim()) return "Description is required";
      if(!form.category) return "Category is required";
      if(form.skills.length === 0) return "Select atleast one skill";
      if(form.gallery.length === 0) return "Uploaad atleast one Image"

      const {basic, standard, premium} = form.pricing
      if(basic.price <= 0) return "Basic package is required"
      if (!basic.description.trim()) return "Basic package description is required";
      if (basic.deliveryTime <= 0) return "Basic package delivery time is required";

      if(standard.price > 0 && standard.pricing.deliveryTime > 0) {
        
      }
      return null
    }

    useEffect(() => {
      const fetchSkills = async() => {
        const response = await getSkills()
        if(response.success){
          setAdminSkills(response.data.skills)
        }
      }
      fetchSkills()
    },[])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const {name, value} = e.target
        setForm({...form,[name]: value})
    }

    const handlePricingChange = (level: "basic" | "standard" | "premium", field: "price" | "description" | "deliveryTime", value: string) => {
      setForm((prev: any) => ({
        ...prev,
        pricing: {
          ...prev.pricing,
          [level]: {
            ...prev.pricing[level],
            [field]: field === "price" || field === "deliveryTime" ? Number(value) : value
          }
        }
      }))
    }

    const handleSkillToggle = (skillId: string) => {
      setForm((prev: any) => {
        const exists = prev.skills.includes(skillId);
        const updatedSkills = exists ? prev.skills.filter((s: string) => s !== skillId): [...prev.skills, skillId];
        return { ...prev, skills: updatedSkills };
      });
    };


  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setForm((prev: any) => ({
        ...prev, 
        gallery: [...prev.gallery, ...Array.from(e.target.files || [])],
      }));
    }
  };

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
    
    form.gallery.forEach((file: File) => {
      gigForm.append("gallery", file);
    });

    const pricingObj: any = {
      basic: {
        price: form.pricing.basic.price,
        description: form.pricing.basic.description,
        deliveryTime: form.pricing.basic.deliveryTime
      }
    };

    if (
      form.pricing.standard.price > 0 &&
      form.pricing.standard.deliveryTime > 0 &&
      form.pricing.standard.description.trim()
    ) {
      pricingObj.standard = {
        price: form.pricing.standard.price,
        description: form.pricing.standard.description,
        deliveryTime: form.pricing.standard.deliveryTime
      };
    }

    if (
      form.pricing.premium.price > 0 &&
      form.pricing.premium.deliveryTime > 0 &&
      form.pricing.premium.description.trim()
    ) {
      pricingObj.premium = {
        price: form.pricing.premium.price,
        description: form.pricing.premium.description,
        deliveryTime: form.pricing.premium.deliveryTime
      };
    }

    gigForm.append("pricing", JSON.stringify(pricingObj));

    const res = await createGig(gigForm);
    console.log("Create Gig !!", res);
    
    if (res.success) {
      toast.success("Gig Created Successfully!");
      setForm({
        title: "",
        description: "",
        category: "",
        skills: [],
        pricing: {
          basic: { price: 0, description: "", deliveryTime: 0 },
          standard: { price: 0, description: "", deliveryTime: 0 },
          premium: { price: 0, description: "", deliveryTime: 0 }
        },
        gallery: []
      });
      navigate(userRoutes.LISTED_GIG);
    } else {
      toast.error("Gig creation failed");
    }
  } catch (error) {
    console.error("Error creating gig:", error);
    toast.error("An error occurred while creating the gig");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white shadow rounded-lg space-y-6 mt-7">
      <h1 className="text-3xl font-semibold text-center text-black">Create New Gig</h1>

      <input
       type="text" 
       name="title" 
       value={form.title}  
       onChange={handleChange}
       placeholder="Gig Title" 
       className="w-full border p-2 rounded" />

       <textarea 
       name="description"
       value={form.description}
       onChange={handleChange}
       placeholder="Gig description"
       className="w-full border p-2 rounded"
       ></textarea>

      <select name="category" 
      value={form.category} 
      onChange={handleChange}  
      className="w-full border p-2 rounded">
        <option value="">Select Category</option>
        {Object.keys(adminSkills).map((cat) => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>

      <div>
        <label className="block font-medium mb-1">Skills</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {form.category && adminSkills[form.category] && (
            <div>
              <p className="font-semibold text-gray-700 mb-1">{form.category}</p>
              <div className="flex flex-col gap-2">
                {adminSkills[form.category].map((skill) => (
                  <label key={skill._id} className="block text-sm">
                    <input
                      type="checkbox"
                      checked={form.skills.includes(skill._id)}
                      onChange={() => handleSkillToggle(skill._id)}
                      className="mr-2"
                    />
                    {`+${skill.name}`}
                  </label>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {(["basic", "standard", "premium"]as const).map((level) => (
          <div key={level} className="border rounded p-4 space-y-3">
            <h3 className="text-lg font-semibold capitalize">{level} Package</h3>

            <input
              type="number"
              value={form.pricing[level].price === 0? "" : form.pricing[level].price}
              onChange={(e) => handlePricingChange(level, "price", e.target.value)}
              placeholder="Price"
              className="w-full border p-2 rounded"
            />

            <textarea
              value={form.pricing[level].description}
              onChange={(e) => handlePricingChange(level, "description", e.target.value)}
              placeholder="Description"
              className="w-full border p-2 rounded"
            />

            <input
              type="number"
              min={0}
              value={form.pricing[level].deliveryTime === 0?"" : form.pricing[level].deliveryTime}
              onChange={(e) => handlePricingChange(level, "deliveryTime", e.target.value)}
              placeholder="Delivery Time (days)"
              className="w-full border p-2 rounded"
            />
          </div>
        ))}
      </div>

      <input 
      type="file" 
      accept="image/*" 
      multiple onChange={handleImageUpload}
      className="w-full border p-2 rounded" />

      <button
      onClick={handleSubmit} 
      className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      disabled={loading}>
        {loading? "Submitting.." : "Submit"}
      </button>
    </div>
  );
}

export default GigComp
