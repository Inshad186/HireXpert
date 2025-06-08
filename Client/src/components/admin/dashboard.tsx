import { getDashboardStats } from '@/api/admin.api';
import React, {useEffect, useState} from 'react';
import { FaUsers, FaBriefcase, FaChartLine, FaChartBar, FaUserCheck } from 'react-icons/fa';


function DashboardComponent() {
    const [dashboardStats, setDashboardStats] = useState({
        totalUsers: 0,
        totalFreelancers: 0,
        totalClients: 0,
    })

    useEffect(()=>{
        const fetchDashboardData = async() => {
            try {
                const response = await getDashboardStats()
                console.log("GEt total users > ",response)
                if(response.success){
                    setDashboardStats(response.data)
                }
            } catch (error) {
                console.error("Error fetching dashboard stats", error);
            }
        }
        fetchDashboardData()
    },[])

  return (
    <div className="p-6 text-white">
      <h1 className='text-left text-2xl mb-6 font-bold'>Dashboard</h1>
      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6 mb-6">
        <div className="bg-white text-black p-4 rounded-2xl flex items-center gap-4">
          <FaUsers size={40} className="text-black" />
          <div>
            <h3 className="text-lg font-semibold">Total Users</h3>
            <p className="text-2xl font-bold">{dashboardStats.totalUsers}</p>
          </div>
        </div>

        <div className="bg-white text-black p-4 rounded-2xl flex items-center gap-4">
          <FaBriefcase size={40} className="text-black" />
          <div>
            <h3 className="text-lg font-semibold">Freelancers</h3>
            <p className="text-2xl font-bold">{dashboardStats.totalFreelancers}</p>
          </div>
        </div>

        <div className="bg-white text-black p-4 rounded-2xl flex items-center gap-4">
          <FaUsers size={40} className="text-black" />
          <div>
            <h3 className="text-lg font-semibold">Clients</h3>
            <p className="text-2xl font-bold">{dashboardStats.totalClients}</p>
          </div>
        </div>

        <div className="bg-white text-black p-4 rounded-2xl flex items-center gap-4">
          <FaChartBar size={40} className="text-black" />
          <div>
            <h3 className="text-lg font-semibold">Total Gigs</h3>
            <p className="text-2xl font-bold">{dashboardStats.totalFreelancers}</p>
          </div>
        </div>
      </div>

      {/* Graph cards */}
      {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white text-black p-4 rounded-2xl">
          <h3 className="text-lg font-semibold mb-2">Orders per day</h3>
          <img src="/graphs/orders.png" alt="Orders graph" className="w-full h-32 object-cover" />
        </div>
        <div className="bg-white text-black p-4 rounded-2xl">
          <h3 className="text-lg font-semibold mb-2">Earnings overview</h3>
          <img src="/graphs/earnings.png" alt="Earnings graph" className="w-full h-32 object-cover" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white text-black p-4 rounded-2xl">
          <h3 className="text-lg font-semibold mb-2">Active Users this week</h3>
          <img src="/graphs/active-users.png" alt="Active users graph" className="w-full h-32 object-cover" />
        </div>
        <div className="bg-white text-black p-4 rounded-2xl flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl font-bold mb-2">62%</div>
            <div className="text-sm text-gray-500">Engagement Rate</div>
          </div>
        </div>
      </div> */}
    </div>
  );
}

export default DashboardComponent;
