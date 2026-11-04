import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { userRoutes } from "@/constants/routeUrl";
import { ProjectDetail } from "@/types/user.type";
import { Briefcase, Plus, Loader2, Layers } from "lucide-react";

interface ListedGigsCompProps {
  list: ProjectDetail[];
  loading: boolean;
  error: string | null;
  onToggle: (id: string, currentStatus: boolean) => Promise<void>;
}

function ListedGigsComp({ list, loading, error, onToggle }: ListedGigsCompProps) {
  const [selectedPlan, setSelectedPlan] = useState<"basic" | "standard" | "premium">("basic");
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50/60 py-10 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-slate-500 font-medium">
          <Loader2 size={32} className="animate-spin text-indigo-600" />
          <p>Loading your gigs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50/60 py-10 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="bg-white p-8 rounded-3xl shadow-xs border border-rose-100 text-center max-w-md w-full">
          <p className="text-rose-600 font-bold mb-1">Failed to load gigs</p>
          <p className="text-sm text-slate-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-6 rounded-3xl shadow-xs border border-slate-200/60 gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">My Gigs</h1>
            <p className="text-sm font-medium text-slate-500 mt-0.5">Manage your active service offerings and pricing tiers</p>
          </div>
          <button
            onClick={() => navigate(userRoutes.CREATE_GIG)}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-sm rounded-2xl transition-all shadow-sm shadow-indigo-100"
          >
            <Plus size={18} />
            Create Gig
          </button>
        </div>

        {/* Plan Filter Tabs */}
        {list.length > 0 && (
          <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl w-fit border border-slate-200/60 shadow-xs">
            <div className="px-3 text-slate-700 text-sm font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Layers size={14} /> View Plan:
            </div>
            {(["basic", "standard", "premium"] as const).map((plan) => (
              <button
                key={plan}
                onClick={() => setSelectedPlan(plan)}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                  selectedPlan === plan
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-slate-600 hover:text-indigo-600 hover:bg-slate-50"
                }`}
              >
                {plan}
              </button>
            ))}
          </div>
        )}

        {/* Main Content Card / Table */}
        <div className="bg-white rounded-3xl shadow-xs border border-slate-200/60 overflow-hidden">
          {list.length === 0 ? (
            <div className="py-20 px-6 text-center">
              <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-4">
                <Briefcase size={28} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">No gigs found yet</h3>
              <p className="text-sm text-slate-500 max-w-sm mx-auto mb-6">Create your first service listing to start receiving orders from clients across the platform.</p>
              <button
                onClick={() => navigate(userRoutes.CREATE_GIG)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-2xl transition-all shadow-sm shadow-indigo-100"
              >
                <Plus size={18} />
                Create Your First Gig
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-indigo-700 border-b border-indigo-700 text-white text-xs uppercase tracking-wider font-extrabold">
                    <th className="py-4 px-6">#</th>
                    <th className="py-4 px-6">Title</th>
                    <th className="py-4 px-6">Category</th>
                    <th className="py-4 px-6">Selected Plan</th>
                    <th className="py-4 px-6">Delivery Time</th>
                    <th className="py-4 px-6 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 border text-sm">
                  {list.map((gig, index) => {
                    // Dynamically fallback pricing data based on user tab selection
                    const planData = gig.pricing?.[selectedPlan] || gig.pricing?.basic;
                    const deliveryDays = planData?.deliveryTime || 0;

                    return (
                      <tr
                        key={gig._id}
                        className="hover:bg-slate-50/50 transition-colors duration-150"
                      >
                        <td className="py-4 px-6 text-slate-500 font-bold">#{index + 1}</td>
                        <td className="py-4 px-6 font-semibold text-slate-800 max-w-xs truncate">
                          {gig.title || "—"}
                        </td>
                        <td className="py-4 px-6">
                          <span className="inline-flex px-2.5 py-1 text-xs font-bold rounded-lg bg-indigo-50 text-indigo-700">
                            {gig.category || "—"}
                          </span>
                        </td>
                        <td className="py-4 px-6 capitalize text-slate-600 font-medium">
                          {selectedPlan}
                        </td>
                        <td className="py-4 px-6 text-slate-600 font-medium">
                          {deliveryDays} {deliveryDays === 1 ? 'day' : 'days'}
                        </td>
                        <td className="py-4 px-6 text-center">
                          <label className="inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              className="sr-only peer"
                              checked={gig.isActive}
                              onChange={() => onToggle(gig?._id || "", gig?.isActive ?? false)}
                            />
                            <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:bg-emerald-500 relative after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full shadow-xs"></div>
                          </label>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer Navigation Back Button */}
        <div className="flex justify-center pt-2">
          <button 
            className="text-white bg-indigo-700 hover:bg-indigo-800 border border-slate-200 px-6 py-2.5 rounded-2xl font-bold text-sm shadow-xs transition-all"
            onClick={() => navigate(userRoutes.FREELANCER_DASH)}
          >
            ← Back to Dashboard
          </button>
        </div>

      </div>
    </div>
  );
}

export default ListedGigsComp;