import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getEarnings } from "@/api/freelancer.api";
import { userRoutes } from "@/constants/routeUrl";
import { Wallet, ShieldCheck, CheckCircle2, ArrowLeft, Loader2, DollarSign } from "lucide-react";

interface Earnings {
  totalEarned: number;
  inEscrow: number;
  completedOrders: number;
  recent: {
    _id: string;
    gig?: { title: string };
    paymentDetails: { freelancerAmount: number };
    escrowDetails: { releasedAt: string };
  }[];
}

const money = (n?: number) =>
  (n ?? 0).toLocaleString("en-US", { style: "currency", currency: "USD" });

export default function EarningsPage() {
  const [data, setData] = useState<Earnings | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    let ignore = false;
    const load = async () => {
      try {
        setLoading(true);
        const res = await getEarnings();
        if (!ignore) {
          if (res.success) {
            setData(res.data.earnings);
          } else {
            setError("Failed to fetch earnings details");
          }
        }
      } catch (err) {
        console.error("Failed to load earnings", err);
        if (!ignore) setError("Something went wrong while fetching earnings.");
      } finally {
        if (!ignore) setLoading(false);
      }
    };
    load();
    return () => {
      ignore = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50/60 py-10 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-slate-500 font-medium">
          <Loader2 size={32} className="animate-spin text-indigo-600" />
          <p>Loading earnings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50/60 py-10 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="bg-white p-8 rounded-3xl shadow-xs border border-rose-100 text-center max-w-md w-full">
          <p className="text-rose-600 font-bold mb-1">Failed to load earnings</p>
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
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Earnings & Payouts</h1>
            <p className="text-sm font-medium text-slate-500 mt-0.5">Track your overall revenue, escrow balances, and recent payment releases</p>
          </div>
          <button
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white border border-slate-200 font-bold px-4 py-2.5 rounded-2xl text-sm transition-all shadow-xs"
            onClick={() => navigate(userRoutes.FREELANCER_DASH)}
          >
            <ArrowLeft size={16} />
            Dashboard
          </button>
        </div>

        {/* Stats Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="bg-white p-6 rounded-3xl shadow-xs border border-slate-200/60 hover:shadow-md transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-bold uppercase tracking-wider text-slate-400">Total Earned</span>
              <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-2xl group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <Wallet size={20} />
              </div>
            </div>
            <p className="text-3xl font-black text-slate-900">{money(data?.totalEarned)}</p>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-xs border border-slate-200/60 hover:shadow-md transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-bold uppercase tracking-wider text-slate-400">In Escrow (Pending)</span>
              <div className="p-2.5 bg-amber-50 text-amber-600 rounded-2xl group-hover:bg-amber-600 group-hover:text-white transition-colors">
                <ShieldCheck size={20} />
              </div>
            </div>
            <p className="text-3xl font-black text-slate-900">{money(data?.inEscrow)}</p>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-xs border border-slate-200/60 hover:shadow-md transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-bold uppercase tracking-wider text-slate-400">Completed Orders</span>
              <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-2xl group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <CheckCircle2 size={20} />
              </div>
            </div>
            <p className="text-3xl font-black text-slate-900">{data?.completedOrders ?? 0}</p>
          </div>
        </div>

        {/* Recent Earnings Table */}
        <div className="bg-white rounded-3xl shadow-xs border border-slate-200/60 overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Recent Payouts</h2>
            <p className="text-xs font-medium text-slate-500 mt-0.5">History of funds released to your account</p>
          </div>

          {!data?.recent || data.recent.length === 0 ? (
            <div className="py-20 px-6 text-center">
              <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-4">
                <DollarSign size={28} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">No recent payouts found</h3>
              <p className="text-sm text-slate-500 max-w-sm mx-auto">Completed order payments will show up here once funds are released from escrow.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-indigo-700 border-b border-slate-200/60 text-white text-xs uppercase tracking-wider font-extrabold">
                    <th className="py-4 px-6">#</th>
                    <th className="py-4 px-6">Gig / Title</th>
                    <th className="py-4 px-6">Released Date</th>
                    <th className="py-4 px-6 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-md">
                  {data.recent.map((order, index) => (
                    <tr
                      key={order._id}
                      className="hover:bg-slate-50/50 transition-colors duration-150"
                    >
                      <td className="py-4 px-6 font-bold text-slate-500">
                        {index + 1}
                      </td>
                      <td className="py-4 px-6 font-semibold text-slate-800 max-w-xs truncate">
                        {order.gig?.title || "Order"}
                      </td>
                      <td className="py-4 px-6 text-slate-600 font-medium">
                        {order.escrowDetails?.releasedAt
                          ? new Date(order.escrowDetails.releasedAt).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })
                          : "—"}
                      </td>
                      <td className="py-4 px-6 text-right font-black text-emerald-600">
                        {money(order.paymentDetails?.freelancerAmount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}