import { useEffect, useState } from "react";
import { getSkills } from "@/api/admin.api";
import { createGig } from "@/api/freelancer.api";
import { useNavigate } from "react-router-dom";
import { userRoutes } from "@/constants/routeUrl";

function GigComp() {

  const navigate = useNavigate()

    const [form, setForm] = useState<any>({
        title: "",
        description: "",
        category: "",
        skills: [],
        deliveryTime: "",
        price: {
        basic: "",
        standard: "",
        premium: ""
        },
        gallery: []
    });

    const [adminSkills, setAdminSkills] = useState<{ [category: string]: { _id: string; name: string }[] }>({});
    const [images, setImages] = useState<File[]>([]);

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
      
      if(["basic", "standard", "premium"].includes(name)){
        setForm({...form, price: {...form.price,[name]: value}})
      }else{
        setForm({...form,[name]: value})
      }
    }

    const handleSkillToggle = (skillName: string) => {
      setForm((prev: any) => {
        const exists = prev.skills.includes(skillName);
        const updatedSkills = exists
          ? prev.skills.filter((s: string) => s !== skillName)
          : [...prev.skills, skillName];
        return { ...prev, skills: updatedSkills };
      });
    };


    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        setImages([...images, ...Array.from(e.target.files)]);
      }
    };

  const handleSubmit = async () => {
    const gigForm = new FormData();
    gigForm.append("title", form.title);
    gigForm.append("description", form.description);
    gigForm.append("category", form.category);
    gigForm.append("deliveryTime", Number(form.deliveryTime).toString());

    form.skills.forEach((skillId: string) => {
      gigForm.append("skills", skillId);
    });

    const priceObj = {
      basic: Number(form.price.basic),
      standard: form.price.standard ? Number(form.price.standard) : undefined,
      premium: form.price.premium ? Number(form.price.premium) : undefined,
    };
    gigForm.append("price", JSON.stringify(priceObj));


    images.forEach((img) => {
      gigForm.append("gallery", img);
    });

    const res = await createGig(gigForm);
    if (res.success) {
      alert("Gig Created Successfully!");
      setForm({
        title: "",
        description: "",
        category: "",
        skills: [],
        deliveryTime: "",
        price: { basic: "", standard: "", premium: "" },
        gallery: [],
      });
      setImages([]);
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

      <textarea name="description" 
      value={form.description}
      onChange={handleChange}
      placeholder="Gig Description" 
      className="w-full border p-2 rounded" />
      <select name="category" value={form.category} onChange={handleChange}  className="w-full border p-2 rounded">
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

      <input 
      type="number" 
      name="deliveryTime" 
      value={form.deliveryTime} 
      onChange={handleChange}
      placeholder="Delivery Time (days)" 
      className="w-full border p-2 rounded" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {["basic", "standard", "premium"].map((level) => (
          <input
            key={level}
            type="number"
            name={level}
            value={form.price[level]}
            onChange={handleChange}
            placeholder={`${level[0].toUpperCase() + level.slice(1)} Price`}
            className="border p-2 rounded"
          />
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
