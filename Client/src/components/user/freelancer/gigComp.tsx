import { useEffect, useState } from "react";
import { getSkills } from "@/api/admin.api";
import { createGig } from "@/api/freelancer.api";
import { useNavigate } from "react-router-dom";
import { userRoutes } from "@/constants/routeUrl";
import { ProjectDetail } from "@/types/user.type";

function GigComp() {

  const navigate = useNavigate()
    const [form, setForm] = useState<any>({
        title: "",
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
    const gigForm = new FormData();
    gigForm.append("title", form.title);
    gigForm.append("category", form.category);
    gigForm.append("skills", JSON.stringify(form.skills))
    form.gallery.forEach((file:File) => {
      gigForm.append("gallery", file);
      console.log("GALLERY : ",file)
    });


    const pricingObj = {
      basic: {
        price: form.pricing.basic.price,
        description: form.pricing.basic.description,
        deliveryTime: form.pricing.basic.deliveryTime
      },
      standard: {
        price: form.pricing.standard.price,
        description: form.pricing.standard.description,
        deliveryTime: form.pricing.standard.deliveryTime,
      },
      premium: {
        price: form.pricing.premium.price,
        description: form.pricing.premium.description,
        deliveryTime: form.pricing.premium.deliveryTime,
      }
    };
    gigForm.append("pricing", JSON.stringify(pricingObj));

    const res = await createGig(gigForm);
    console.log("Create Gig !!",res)
    if (res.success) {
      alert("Gig Created Successfully!");
      setForm({
        title: "",
        category: "",
        skills: [],
        pricing: {
          basic: { price: 0, description: "", deliveryTime: 0 },
          standard: { price: 0, description: "", deliveryTime: 0 },
          premium: { price: 0, description: "", deliveryTime: 0 }
        },
        gallery:[]
      });
      navigate(userRoutes.LISTED_GIG)
    } else {
      console.error("Gig creation failed:", res);
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
      className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
        Submit
      </button>
    </div>
  );
}

export default GigComp
