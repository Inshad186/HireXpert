import { freelancerDashStats, getOrderList, startStripeOnboarding, getStripeStatus } from '@/api/freelancer.api'
import { useEffect, useState } from 'react'
import { getProfileImage } from '@/api/user.api'
import { NotificationBell } from '../notificationBell'
import toast from 'react-hot-toast'
import { CheckCircle2, AlertCircle, Loader2, Wallet, ShoppingBag, Briefcase, ArrowUpRight, ShieldCheck } from 'lucide-react'

function FreelancerDashboard() {
  interface Order {
    _id: string
    client: {
      name: string
    }
    gig: {
      title: string
    }
    plan: string
    status: string
  }

  interface DashStats {
    totalOrders: number;
    myGigs: number;
    activeOrders: number;
    totalEarned: number;
    inEscrow: number;
  }

  const [dashboardStats, setDashboardStats] = useState<DashStats>({ totalOrders: 0, myGigs: 0, activeOrders: 0, totalEarned: 0, inEscrow: 0 })
  const [profile, setProfile] = useState("")
  const [orderList, setOrderList] = useState<Order[]>([])
  const [userId, setUserId] = useState<string | null>(null)
  const [stripeStatus, setStripeStatus] = useState<"not_connected" | "pending" | "connected">("not_connected")
  const [stripeLoading, setStripeLoading] = useState(false)
  const [stripeChecking, setStripeChecking] = useState(false)

  useEffect(() => {
    try {
      const persistuser = localStorage.getItem("persist:user")
      if (persistuser) {
        const user = JSON.parse(persistuser)
        setUserId(user._id)
      }
    } catch (error) {
      console.error("Error parsing persistuser:", error)
    }
  }, [])

  const loadDashboard = async () => {
    try {
      const [dashRes, profileRes, orderRes] = await Promise.all([
        freelancerDashStats(),
        getProfileImage(),
        getOrderList(),
      ])
      if (dashRes.success) setDashboardStats((prev) => ({ ...prev, ...dashRes.data }))
      if (profileRes.success) setProfile(profileRes.data.user.profilePicture)
      if (orderRes.success) setOrderList(orderRes.data.orderDetails)
    } catch (error) {
      console.error("Failed to load dashboard", error)
      toast.error("Could not load the dashboard")
    }
  }

  useEffect(() => {
    loadDashboard()
    checkStripeStatus()
  }, [])

  const money = (n: number) =>
    n.toLocaleString("en-US", { style: "currency", currency: "USD" })

  const checkStripeStatus = async () => {
    try {
      setStripeChecking(true)
      const response = await getStripeStatus()
      if (response.success) {
        setStripeStatus(response.data.status)
      }
    } catch (error) {
      console.error("Error checking Stripe status:", error)
      setStripeStatus("not_connected")
    } finally {
      setStripeChecking(false)
    }
  }

  const handleStripeConnect = async () => {
    try {
      setStripeLoading(true)
      const response = await startStripeOnboarding()
      if (response.success && response.data.result.onboardingUrl) {
        window.location.href = response.data.result.onboardingUrl
      } else {
        toast.error(response.error || "Failed to start onboarding")
      }
    } catch (error) {
      console.error("Error:", error)
      toast.error("Failed to connect Stripe account")
    } finally {
      setStripeLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-amber-50 text-amber-700 border-amber-200/60';
      case 'ACCEPTED': return 'bg-sky-50 text-sky-700 border-sky-200/60';
      case 'IN_PROGRESS': return 'bg-indigo-50 text-indigo-700 border-indigo-200/60';
      case 'DELIVERED': return 'bg-teal-50 text-teal-700 border-teal-200/60';
      case 'COMPLETED': return 'bg-emerald-50 text-emerald-700 border-emerald-200/60';
      default: return 'bg-slate-100 text-slate-700 border-slate-200/60';
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 py-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white px-6 py-3 rounded-3xl shadow-lg border border-slate-200/60 gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Freelancer Overview</h1>
            <p className="text-sm font-medium text-slate-500 mt-0.5">Welcome back! Here's how your business is performing.</p>
          </div>

          <div className="flex items-center gap-4">
            {userId && (
              <div className="p-2 bg-slate-50 rounded-2xl border border-slate-100">
                <NotificationBell userId={userId} />
              </div>
            )}
            <div className="relative group">
              <img
                className="h-12 w-12 rounded-2xl object-cover ring-2 ring-indigo-600/20 shadow-sm group-hover:ring-indigo-600 transition-all duration-300"
                src={profile || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"}
                alt="Freelancer Profile"
              />
            </div>
          </div>
        </div>

        {/* Stripe Connection Card */}
        <div className="relative overflow-hidden bg-gradient-to-r from-indigo-900 via-indigo-800 to-indigo-950 text-white rounded-3xl p-8 shadow-xl border border-indigo-700/50">
          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/30 text-indigo-200 text-xs font-bold tracking-wider uppercase border border-indigo-400/30">
                <ShieldCheck size={14} /> Payout Gateway
              </div>
              <h3 className="text-2xl font-black tracking-tight">Stripe Payout Account</h3>
              
              {stripeChecking ? (
                <div className="flex items-center gap-2.5 text-indigo-200 text-sm">
                  <Loader2 size={18} className="animate-spin" />
                  <p>Verifying secure connection status...</p>
                </div>
              ) : stripeStatus === "connected" ? (
                <div className="flex items-center gap-3 text-emerald-300">
                  <CheckCircle2 size={22} className="text-emerald-400 shrink-0" />
                  <div>
                    <p className="font-bold text-base">Account Connected & Verified</p>
                    <p className="text-xs text-indigo-200">You are fully set up to receive direct payouts from client orders.</p>
                  </div>
                </div>
              ) : stripeStatus === "pending" ? (
                <div className="flex items-center gap-3 text-amber-300">
                  <AlertCircle size={22} className="text-amber-400 shrink-0" />
                  <div>
                    <p className="font-bold text-base">Verification In Progress</p>
                    <p className="text-xs text-indigo-200">Stripe is reviewing your documentation (usually takes 1-3 business days).</p>
                  </div>
                </div>
              ) : (
                <p className="text-indigo-200 text-sm leading-relaxed">
                  Link your bank account securely with Stripe to enable swift order payments and secure escrow releases.
                </p>
              )}
            </div>

            {stripeStatus !== "connected" && !stripeChecking && (
              <button
                onClick={handleStripeConnect}
                disabled={stripeLoading}
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-white text-indigo-950 font-bold text-sm rounded-2xl hover:bg-indigo-50 active:scale-95 disabled:opacity-50 transition-all duration-200 shadow-lg"
              >
                {stripeLoading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    Connect Stripe Account
                    <ArrowUpRight size={18} />
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white px-5 py-4 rounded-2xl shadow-sm border border-slate-200/60 hover:shadow-md transition-all duration-300 group">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-bold uppercase tracking-wider text-slate-500">Total Orders</span>
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <ShoppingBag size={18} />
              </div>
            </div>
            <p className="text-2xl font-black text-slate-900">{dashboardStats.totalOrders}</p>
          </div>

          <div className="bg-white px-5 py-4 rounded-2xl shadow-sm border border-slate-200/60 hover:shadow-md transition-all duration-300 group">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-bold uppercase tracking-wider text-slate-500">My Gigs</span>
              <div className="p-2 bg-purple-50 text-purple-600 rounded-xl group-hover:bg-purple-600 group-hover:text-white transition-colors">
                <Briefcase size={18} />
              </div>
            </div>
            <p className="text-2xl font-black text-slate-900">{dashboardStats.myGigs}</p>
          </div>

          <div className="bg-white px-5 py-4 rounded-2xl shadow-sm border border-slate-200/60 hover:shadow-md transition-all duration-300 group">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-bold uppercase tracking-wider text-slate-500">Active Orders</span>
              <div className="p-2 bg-sky-50 text-sky-600 rounded-xl group-hover:bg-sky-600 group-hover:text-white transition-colors">
                <ShoppingBag size={18} />
              </div>
            </div>
            <p className="text-2xl font-black text-slate-900">{dashboardStats.activeOrders}</p>
          </div>

          <div className="bg-white px-5 py-4 rounded-2xl shadow-sm border border-slate-200/60 hover:shadow-md transition-all duration-300 group">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-bold uppercase tracking-wider text-slate-500">Total Earned</span>
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <Wallet size={18} />
              </div>
            </div>
            <p className="text-2xl font-black text-slate-900">{money(dashboardStats.totalEarned)}</p>
            {dashboardStats.inEscrow > 0 && (
              <p className="text-[11px] font-semibold text-emerald-600 mt-0.5">
                {money(dashboardStats.inEscrow)} in escrow
              </p>
            )}
          </div>
        </div>
        
        {/* Recent Orders Table Section */}
        <div className="bg-white rounded-3xl shadow-lg border border-slate-200/60 overflow-hidden">
          <div className="px-6 py-3 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Recent Orders</h2>
              <p className="text-xs font-medium text-slate-500 mt-0.5">Track and manage your client order workflows</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-indigo-700 border-b border-slate-200/60 text-white text-xs uppercase tracking-wider font-extrabold">
                  <th className="text-left py-4 px-6">Order ID</th>
                  <th className="text-left py-4 px-6">Client</th>
                  <th className="text-left py-4 px-6">Gig Title</th>
                  <th className="text-left py-4 px-6">Plan</th>
                  <th className="text-left py-4 px-6">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {orderList.length > 0 ? (
                  orderList.map((list, index) => (
                    <tr
                      key={index}
                      className="hover:bg-indigo-200 transition-colors duration-150"
                    >
                      <td className="py-4 px-6 text-slate-500 font-bold">#{index + 1}</td>
                      <td className="py-4 px-6 font-semibold text-slate-800">{list?.client?.name}</td>
                      <td className="py-4 px-6 text-slate-600 max-w-xs truncate font-medium">{list?.gig?.title}</td>
                      <td className="py-4 px-6 text-slate-600 font-medium capitalize">{list?.plan}</td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-3 py-1 text-xs font-bold rounded-full border ${getStatusColor(list.status)}`}>
                          {list?.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-slate-400 font-medium">
                      No recent orders found.
                    </td>          
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  )
}

export default FreelancerDashboard