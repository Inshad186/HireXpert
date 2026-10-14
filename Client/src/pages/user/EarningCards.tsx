import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getEarnings } from "@/api/freelancer.api";
import { userRoutes } from "@/constants/routeUrl";

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
      <div className="min-h-screen bg-gray-100 py-10 px-4">
        <div className="max-w-6xl mx-auto bg-white shadow-xl rounded-2xl p-8 border border-gray-200">
          <div className="text-center text-gray-600 py-20">
            <p className="text-lg font-medium">Loading earnings...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 py-10 px-4">
        <div className="max-w-6xl mx-auto bg-white shadow-xl rounded-2xl p-8 border border-gray-200">
          <div className="text-center text-red-600 py-20">
            <p className="text-lg font-medium">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  const cards = [
    { label: "Total Earned", value: money(data?.totalEarned) },
    { label: "In Escrow (Pending)", value: money(data?.inEscrow) },
    { label: "Completed Orders", value: String(data?.completedOrders ?? 0) },
  ];

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-6xl mx-auto bg-white shadow-xl rounded-2xl p-8 border border-gray-200">
        
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Earnings</h1>
        </div>

        {/* Stats Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          {cards.map((card) => (
            <div
              key={card.label}
              className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm flex flex-col justify-between"
            >
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {card.label}
              </p>
              <p className="text-3xl font-bold text-gray-800 mt-2">
                {card.value}
              </p>
            </div>
          ))}
        </div>

        {/* Recent Earnings Table */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Payouts</h2>

          {!data?.recent || data.recent.length === 0 ? (
            <div className="text-center text-gray-600 py-12 border border-gray-200 rounded-lg">
              <p className="text-lg font-medium">No recent payouts found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-gray-300">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-800 text-white text-sm uppercase tracking-wider">
                    <th className="p-4">#</th>
                    <th className="p-4">Gig / Title</th>
                    <th className="p-4">Released Date</th>
                    <th className="p-4 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {data.recent.map((order, index) => (
                    <tr
                      key={order._id}
                      className="border-t border-gray-200 hover:bg-gray-100 transition duration-200"
                    >
                      <td className="p-4 font-medium text-gray-700">
                        {index + 1}
                      </td>
                      <td className="p-4 text-gray-700">
                        {order.gig?.title || "Order"}
                      </td>
                      <td className="p-4 text-gray-600">
                        {order.escrowDetails?.releasedAt
                          ? new Date(order.escrowDetails.releasedAt).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })
                          : "—"}
                      </td>
                      <td className="p-4 text-right font-bold text-green-600">
                        {money(order.paymentDetails?.freelancerAmount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Back Button */}
        <div className="flex justify-center mt-6">
          <button
            className="text-white bg-gray-900 hover:bg-gray-800 transition-colors px-6 py-2.5 rounded-md font-medium shadow"
            onClick={() => navigate(userRoutes.FREELANCER_DASH)}
          >
            Back to dashboard
          </button>
        </div>

      </div>
    </div>
  );
}