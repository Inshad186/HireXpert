import Sidebar from '../common/Sidebar'
import { freelancerDashStats, getOrderList, startStripeOnboarding, getStripeStatus } from '@/api/freelancer.api'
import { useEffect, useState } from 'react'
import { getProfileImage } from '@/api/user.api'
import { NotificationBell } from '../notificationBell'
import toast from 'react-hot-toast'
import { CheckCircle, AlertCircle, Loader } from 'lucide-react'

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

  const [dashboardStats, setDashboardStats] = useState({ totalOrders: 0, myGigs:0, activeOrders:0 })
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
        console.log("User ID from localStorage:", user._id)
      }
    } catch (error) {
      console.error("Error parsing persistuser:", error)
    }
  }, [])

  useEffect(() => {
    const freelancerStats = async() =>{
      const dashRes = await freelancerDashStats()
      if(dashRes.success){
        setDashboardStats(dashRes.data)
      }
      const profileRes = await getProfileImage()
      if(profileRes.success){
        setProfile(profileRes.data.user.profilePicture)
      }
      const orderRes = await getOrderList()
      if(orderRes.success){
        setOrderList(orderRes.data.orderDetails)
      }
      await checkStripeStatus()
    }
    freelancerStats()
  },[])

  const checkStripeStatus = async() => {
    try {
      setStripeChecking(true)
      const response = await getStripeStatus()
      if(response.success){
        setStripeStatus(response.data.status)
      }
    } catch (error) {
      console.error("Error checking Stripe status:", error)
      setStripeStatus("not_connected")
    } finally {
      setStripeChecking(false)
    }
  }

  const handleStripeConnect = async() => {
    try {
      setStripeLoading(true)
      const response = await startStripeOnboarding()
      console.log("Stripe Connect Response",response.data)
      if(response.success && response.data.result.onboardingUrl){
        window.location.href = response.data.result.onboardingUrl
      }else{
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
      case 'PENDING': return 'bg-yellow-100 text-yellow-700';
      case 'ACCEPTED': return 'bg-blue-100 text-blue-700';
      case 'IN_PROGRESS': return 'bg-purple-100 text-purple-700';
      case 'DELIVERED': return 'bg-green-100 text-green-700';
      case 'COMPLETED': return 'bg-emerald-100 text-emerald-700';
      default: return 'bg-gray-200 text-gray-700';
    }
  };

  return (
    <div className="flex h-[85vh] mt-16 bg-gradient-to-br from-gray-50 to-gray-100 shadow-xl max-w-7xl mx-auto rounded-2xl overflow-hidden">
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col p-8 overflow-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Freelancer Dashboard</h1>

          {/* Right Section (Bell + Profile Image) */}
          <div className="flex items-center gap-4">
            {userId && <NotificationBell userId={userId} />}

            <img
              className="h-10 w-10 rounded-full border-2 shadow-sm hover:scale-150 duration-300"
              src={profile || "image"}
              alt="Freelancer"
            />
          </div>
        </div>

        {/* STRIPE CONNECTION CARD - ADD THIS */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-6 mb-8 shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-800 mb-2">💳 Stripe Account</h3>
              
              {stripeChecking ? (
                <div className="flex items-center gap-2 text-gray-600">
                  <Loader size={18} className="animate-spin" />
                  <p>Checking account status...</p>
                </div>
              ) : stripeStatus === "connected" ? (
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle size={20} />
                  <div>
                    <p className="font-semibold">Account Connected ✓</p>
                    <p className="text-sm">Ready to receive payments!</p>
                  </div>
                </div>
              ) : stripeStatus === "pending" ? (
                <div className="flex items-center gap-2 text-orange-600">
                  <AlertCircle size={20} />
                  <div>
                    <p className="font-semibold">Verification Pending</p>
                    <p className="text-sm">Stripe is verifying your account (1-3 business days)</p>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="text-gray-700 mb-3">Connect your bank account to receive payments from clients</p>
                  <button
                    onClick={handleStripeConnect}
                    disabled={stripeLoading}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 font-semibold transition duration-200"
                  >
                    {stripeLoading ? "Connecting..." : "Connect Stripe Account"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
          {[
            { title: "Total Orders", value: dashboardStats.totalOrders },
            { title: "My Gigs", value: dashboardStats.myGigs },
            { title: "Active Orders", value: dashboardStats.activeOrders },
            { title: "Earnings", value: "₹1,240" },
          ].map((item, index) => (
            <div
              key={index}
              className="bg-white shadow-lg rounded-xl p-6 hover:scale-[1.02] hover:shadow-2xl transition-all duration-300"
            >
              <p className="text-gray-500 font-medium">{item.title}</p>
              <p className="text-3xl font-semibold text-gray-800 mt-2">{item.value}</p>
            </div>
          ))}
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Recent Orders</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-500 border-b border-gray-300 text-white text-sm">
                  <th className="text-left p-4 font-semibold">Order ID</th>
                  <th className="text-left p-4 font-semibold">Client</th>
                  <th className="text-left p-4 px-28 font-semibold">Gig</th>
                  <th className="text-left p-4 font-semibold">Plan</th>
                  <th className="text-left p-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {orderList.length > 0 ? (
                  orderList.map((list, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-200 hover:bg-gray-100 transition-colors duration-200"
                    >
                      <td className="p-4 text-gray-700 font-medium">#{index + 1}</td>
                      <td className="p-4 text-gray-600">{list?.client?.name}</td>
                      <td className="p-4 text-gray-600">{list?.gig?.title}</td>
                      <td className="p-4 text-gray-600">{list?.plan}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(list.status)}`}>
                          {list?.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="p-4 text-center text-gray-500">
                      No orders found
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
