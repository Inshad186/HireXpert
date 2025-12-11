import Sidebar from '../common/Sidebar'
import { freelancerDashStats, getOrderList } from '@/api/freelancer.api'
import { useEffect, useState } from 'react'
import { getProfileImage } from '@/api/user.api'
import { NotificationBell } from '../notificationBell'

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

interface PersistUser {
  _id: string
  name: string
  email: string
  role: string
}

  const [dashboardStats, setDashboardStats] = useState({
    totalOrders: 0,
    myGigs:0,
    activeOrders:0
  })
  const [profile, setProfile] = useState("")
  const [orderList, setOrderList] = useState<Order[]>([])
  const [userId, setUserId] = useState<string | null>(null)


    useEffect(() => {
    try {
      const persistuser = localStorage.getItem("persist:user")
      if (persistuser) {
        const user: PersistUser = JSON.parse(persistuser)
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
      
    }
    freelancerStats()
  },[])

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
                        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-yellow-200 text-yellow-700">
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
