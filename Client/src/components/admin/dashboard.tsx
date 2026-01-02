import { getDashboardStats, getOrdersList } from '@/api/admin.api';
import { useEffect, useState } from 'react';
import { FaUsers, FaBriefcase } from 'react-icons/fa';
import { BsPersonWorkspace } from "react-icons/bs";
import { FaUsersBetweenLines } from "react-icons/fa6";
import { ChevronDown, Users, ShoppingCart, DollarSign, TrendingUp, Eye, CheckCircle, Clock, XCircle, MessageSquare } from 'lucide-react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";

interface OrderDetail {
  _id: string;
  freelancer: {
    name: string;
  };
  client: {
    name: string;
  };
  gig: {
    title: string;
    pricing: {
      basic: {
        price: number;
      };
    };
  };
  status: string;
  requirements: string;
}

function DashboardComponent() {
  const [order, setOrder] = useState<OrderDetail[]>([]);
  const [viewModal, setViewModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderDetail | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [dashboardStats, setDashboardStats] = useState({
    totalUsers: 0,
    totalFreelancers: 0,
    totalClients: 0,
    totalGigs: 0
  });
  const ORDERS_PER_PAGE = 7;

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await getDashboardStats();
        if (response.success) {
          setDashboardStats(response.data);
        }
      } catch (error) {
        console.error("Error fetching dashboard stats", error);
      }
    };

    const fetchOrdersList = async (page: number, limit: number) => {
      try {
        const res = await getOrdersList(page, limit);
        if (res.success) {
          setOrder(res.data.orderDetails);
          setTotalPages(res.data.totalPages);
          setCurrentPage(res.data.currentPage);
        }
      } catch (error) {
        console.error("Error fetching order detail", error);
      }
    };

    fetchDashboardData();
    fetchOrdersList(currentPage, ORDERS_PER_PAGE);
  }, [currentPage]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING": return 'bg-yellow-100 text-yellow-800';
      case "ACCEPTED": return 'bg-blue-100 text-blue-800';
      case "IN_PROGRESS": return 'bg-purple-100 text-purple-800';
      case "COMPLETED": return 'bg-green-100 text-green-800';
      case "CANCELLED": return 'bg-red-100 text-red-800';
      default: return "bg-black text-red-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PENDING": return <Clock className='w-4 h-4' />;
      case "ACCEPTED": return <CheckCircle className='w-4 h-4' />;
      case "IN_PROGRESS": return <Eye className='w-4 h-4' />;
      case "COMPLETED": return <CheckCircle className='w-4 h-4' />;
      case "CANCELLED": return <XCircle className='w-4 h-4' />;
      default: return "bg-black text-red-800";
    }
  };

  const handleView = (orderItem: OrderDetail) => {
    setSelectedOrder(orderItem);
    setViewModal(true);
  };

  // Generate pagination items
  const getPaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        items.push(i);
      }
    } else {
      items.push(1);
      if (currentPage > 3) {
        items.push('...');
      }
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        items.push(i);
      }
      if (currentPage < totalPages - 2) {
        items.push('...');
      }
      items.push(totalPages);
    }
    return items;
  };

  return (
    <div className="p-6 text-white">
      <h1 className='text-left text-2xl mb-6 font-bold'>Dashboard</h1>

      <div className='flex items-center mb-6'>
        <input 
          type="text" 
          name="search"
          placeholder='Search' 
          className="rounded-l-md p-2 w-1/3 bg-white text-gray-900"
        />
        <button 
          className='px-4 py-2 bg-gray-900 rounded-r-md'>
          Search
        </button>

        <div className='flex items-center gap-2 ml-auto'>
          <span className='text-lg font-medium'>Filter by:</span>
          <select className='text-white p-2 rounded-md bg-gray-900'>
            <option value="">All</option>
            <option value="">PENDING</option>
            <option value="">COMPLETED</option>
            <option value="">IN-PROGRESS</option>
            <option value="">REJECTED</option>
          </select>
        </div>
      </div>

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
          <BsPersonWorkspace size={40} className="text-black" />
          <div>
            <h3 className="text-lg font-semibold">Freelancers</h3>
            <p className="text-2xl font-bold">{dashboardStats.totalFreelancers}</p>
          </div>
        </div>

        <div className="bg-white text-black p-4 rounded-2xl flex items-center gap-4">
          <FaUsersBetweenLines size={40} className="text-black" />
          <div>
            <h3 className="text-lg font-semibold">Clients</h3>
            <p className="text-2xl font-bold">{dashboardStats.totalClients}</p>
          </div>
        </div>

        <div className="bg-white text-black p-4 rounded-2xl flex items-center gap-4">
          <FaBriefcase size={40} className="text-black" />
          <div>
            <h3 className="text-lg font-semibold">Total Gigs</h3>
            <p className="text-2xl font-bold">{dashboardStats.totalGigs}</p>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className='bg-gray-900 rounded-lg shadow'>
        <div className='p-6 border-b border-gray-200'>
          <h3 className='text-xl font-semibold text-white'>Recent Orders</h3>
        </div>
        <div className="overflow-x-auto">
          <table className='w-full'>
            <thead>
              <tr className='bg-black border-b'>
                <th className='px-6 py-3 text-left text-sm font-semibold text-white'>Order ID</th>
                <th className='px-6 py-3 text-left text-sm font-semibold text-white'>Freelancer</th>
                <th className='px-6 py-3 text-left text-sm font-semibold text-white'>Client</th>
                <th className='px-6 py-3 text-left text-sm font-semibold text-white'>Project</th>
                <th className='px-6 py-3 text-left text-sm font-semibold text-white'>Amount</th>
                <th className='px-6 py-3 text-left text-sm font-semibold text-white'>Status</th>
                <th className='px-6 py-3 text-left text-sm font-semibold text-white'>Action</th>
              </tr>
            </thead>
            <tbody>
              {order?.length > 0 ? (
                order?.map((item, index) => (
                  <tr key={item._id}>
                    <td className='px-6 py-4 font-medium text-sm text-white'>{(currentPage - 1) * ORDERS_PER_PAGE + index + 1}</td>
                    <td className='px-6 py-4 text-sm text-white'>{item.freelancer?.name}</td>
                    <td className='px-6 py-4 text-sm text-white'>{item.client?.name}</td>
                    <td className='px-6 py-4 text-sm text-white'>{item.gig?.title}</td>
                    <td className='px-6 py-4 text-sm font-semibold text-green-600'>₹{item.gig?.pricing?.basic?.price}</td>
                    <td className='px-6 py-4 text-sm'>
                      <span className={`inline-flex items-center gap-1 font-medium px-3 py-1 rounded-full text-xs ${getStatusColor(item.status)}`}>
                        {getStatusIcon(item.status)} {item.status}
                      </span>
                    </td>
                    <td className='px-6 py-4 text-base font-medium'>
                      <button
                        className='text-blue-700 capitalize'
                        onClick={() => handleView(item)}>
                        view
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="p-4 text-center text-lg text-gray-500">
                    No orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className='p-6 border-t border-gray-200'>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {e.preventDefault();
                      if (currentPage > 1) setCurrentPage(currentPage - 1);
                    }}
                    className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                  />
                </PaginationItem>

                {getPaginationItems().map((item, index) => (
                  <PaginationItem key={index}>
                    {item === '...' ? (
                      <PaginationEllipsis />
                    ) : (
                      <PaginationLink
                        href="#"
                        isActive={item === currentPage}
                        onClick={(e) => { e.preventDefault();
                          if (typeof item === 'number') setCurrentPage(item);
                        }}
                      >
                        {item}
                      </PaginationLink>
                    )}
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                    }}
                    className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {viewModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800">Order Details</h3>
              <button 
                onClick={() => setViewModal(false)}
                className="text-gray-500 hover:text-red-600 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6 bg-white p-4 rounded-lg border">
                <div>
                  <p className="text-gray-600 text-sm">Order ID</p>
                  <p className="text-lg font-semibold text-gray-800">{selectedOrder._id}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Status</p>
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedOrder.status)}`}>
                    {getStatusIcon(selectedOrder.status)}
                    {selectedOrder.status}
                  </span>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Client</p>
                  <p className="text-lg font-semibold text-gray-800">{selectedOrder.client?.name}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Freelancer</p>
                  <p className="text-lg font-semibold text-gray-800">{selectedOrder.freelancer?.name}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Project</p>
                  <p className="text-lg font-semibold text-gray-800">{selectedOrder.gig?.title}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Amount</p>
                  <p className="text-lg font-semibold text-green-600">₹{selectedOrder.gig?.pricing?.basic?.price}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-gray-600 text-sm">Requirements</p>
                  <p className="text-gray-800 mt-2 bg-gray-100 p-3 rounded capitalize">{selectedOrder.requirements}</p>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Message Freelancer
              </button>
              <button 
                className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                onClick={() => setViewModal(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DashboardComponent;