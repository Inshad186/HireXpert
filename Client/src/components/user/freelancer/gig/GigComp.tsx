import { Sparkles, Trash2, UploadCloud, CheckCircle2, Image as ImageIcon, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { userRoutes } from "@/constants/routeUrl";
import GigPricing from "./GigPricing";

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

interface Props {
  form: GigFormData;
  adminSkills: {[category: string]: { _id: string; name: string }[]};
  loading: boolean;
  onChange: ( e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> ) => void;
  onPricingChange: ( level: "basic" | "standard" | "premium", field: "price" | "description" | "deliveryTime", value: string ) => void;
  onSkillToggle: (skillId: string) => void;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: (index: number) => void;
  onSubmit: () => void;
}

function GigComp({ form, adminSkills, loading, onChange, onPricingChange, onSkillToggle, onImageUpload, onRemoveImage, onSubmit }: Props) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Top Header & Navigation */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-6 rounded-3xl shadow-xs border border-slate-200/60 gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Sparkles className="text-indigo-600" size={24} />
              Create New Gig
            </h1>
            <p className="text-sm font-medium text-slate-500 mt-0.5">Showcase your expertise and set up professional service packages</p>
          </div>
          <button
            onClick={() => navigate(userRoutes.LISTED_GIG)}
            className="inline-flex items-center gap-2 bg-indigo-700 hover:bg-indigo-800 text-white border border-slate-200 font-bold px-4 py-2.5 rounded-2xl text-sm transition-all shadow-xs"
          >
            <ArrowLeft size={16} />
            Back to Gigs
          </button>
        </div>

        {/* Main Form Container */}
        <div className="bg-white rounded-3xl shadow-xs border border-slate-200/60 p-8 space-y-8">
          
          {/* Basic Details Section */}
          <div className="space-y-6">
            <h2 className="text-lg font-black text-slate-900 tracking-tight border-b border-slate-100 pb-3">
              1. Basic Information
            </h2>

            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">Gig Title</label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={onChange}
                placeholder="e.g., I will build a professional full-stack web application using React and Node.js"
                className="w-full bg-slate-50/50 hover:bg-slate-50 focus:bg-white border border-slate-200/80 rounded-2xl py-3 px-4 text-slate-800 text-sm font-medium focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all shadow-xs"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">Description</label>
              <textarea
                name="description"
                rows={4}
                value={form.description}
                onChange={onChange}
                placeholder="Describe your service in detail. What makes you stand out? What deliverables will the client receive?"
                className="w-full bg-slate-50/50 hover:bg-slate-50 focus:bg-white border border-slate-200/80 rounded-2xl py-3 px-4 text-slate-800 text-sm font-medium focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all shadow-xs"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">Category</label>
                <select
                  name="category"
                  value={form.category}
                  onChange={onChange}
                  className="w-full bg-slate-50/50 hover:bg-slate-50 focus:bg-white border border-slate-200/80 rounded-2xl py-3 px-4 text-slate-800 text-sm font-medium focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all shadow-xs cursor-pointer"
                >
                  <option value="">Select Category</option>
                  {Object.keys(adminSkills).map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Skills Selection */}
          {form.category && adminSkills[form.category] && (
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-black text-slate-900 tracking-tight">Select Relevant Skills</h3>
                  <p className="text-xs font-medium text-slate-500">Choose skills associated with {form.category}</p>
                </div>
                <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-xl">
                  {form.skills.length} selected
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                {adminSkills[form.category].map((skill) => {
                  const isChecked = form.skills.includes(skill._id);
                  return (
                    <button
                      type="button"
                      key={skill._id}
                      onClick={() => onSkillToggle(skill._id)}
                      className={`flex items-center gap-2 p-3 rounded-2xl border text-sm font-bold transition-all text-left ${
                        isChecked
                          ? "bg-indigo-600 text-white border-indigo-600 shadow-sm shadow-indigo-100"
                          : "bg-slate-50/50 hover:bg-slate-100/70 text-slate-700 border-slate-200/80"
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-md flex items-center justify-center border transition-all ${
                        isChecked ? "bg-white text-indigo-600 border-white" : "border-slate-300 bg-white"
                      }`}>
                        {isChecked && <CheckCircle2 size={12} />}
                      </div>
                      <span className="truncate">{skill.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Pricing Tiers Section */}
          <GigPricing
            pricing={form.pricing}
            onPricingChange={onPricingChange}
          />

          {/* Gallery / Images Section */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">3. Gig Gallery</h2>
              <p className="text-xs font-medium text-slate-500">Upload up to 3 images showcasing your work (Max 3MB each)</p>
            </div>

            <div className="relative border-2 border-dashed border-slate-200 hover:border-indigo-400 rounded-3xl p-6 text-center transition-all bg-slate-50/50">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={onImageUpload}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              <div className="flex flex-col items-center justify-center space-y-2 pointer-events-none">
                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
                  <UploadCloud size={24} />
                </div>
                <p className="text-sm font-bold text-slate-700">Click to upload or drag & drop images</p>
                <p className="text-xs text-slate-400">PNG, JPG, WEBP up to 3MB</p>
              </div>
            </div>

            {form.gallery.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-600">Attached Images ({form.gallery.length}/3)</p>
                <ul className="space-y-2">
                  {form.gallery.map((file, index) => (
                    <li
                      key={`${file.name}-${index}`}
                      className="flex items-center justify-between bg-slate-50 border border-slate-200/60 rounded-2xl px-4 py-3"
                    >
                      <div className="flex items-center gap-3 truncate">
                        <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                          <ImageIcon size={16} />
                        </div>
                        <span className="text-sm font-semibold text-slate-700 truncate">{file.name}</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => onRemoveImage(index)}
                        className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-xl transition-colors"
                      >
                        <Trash2 size={14} />
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t border-slate-100">
            <button
              onClick={onSubmit}
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white py-4 rounded-2xl font-bold text-base transition-all shadow-md shadow-indigo-100 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Creating Gig...</span>
                </>
              ) : (
                <span>Publish Gig</span>
              )}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
export default GigComp;