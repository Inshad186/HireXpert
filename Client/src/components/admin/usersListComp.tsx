import { getUsersList } from '@/api/admin.api';
import React, { useState, useEffect } from 'react';
import { blockUsers } from '@/api/admin.api';
import toast from 'react-hot-toast';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  isBlocked: boolean;
}

interface UsersListComponentProps {
  role: "client" | "freelancer";
}


function UsersListComponent({role} : UsersListComponentProps) {

  const [viewModal, setViewModal] = useState(false)

  const [users, setUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("")
  const USERS_PER_PAGE = 7; 


  const fetchUsers = async (page: number, search: string, status: string) => {
    try {
      const response = await getUsersList(page, USERS_PER_PAGE, role, search, status);
      if (response.data.success) {
        setUsers(response.data.users);
        setTotalPages(response.data.totalPages);
        setCurrentPage(response.data.currentPage);
      }
    } catch (error) {
      console.error("Error in fetching users", error);
    }
  };

  const handleSearch = () => {
  setCurrentPage(1); 
  fetchUsers(1, searchTerm, statusFilter);
};


useEffect(() => {
  fetchUsers(currentPage, searchTerm, statusFilter);
}, [currentPage, role, statusFilter]);



const handleToggleBlock = async (userId: string) => {
  try {
    const response = await blockUsers(userId);

    if (response.data.success) {
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId ? { ...user, isBlocked: !user.isBlocked } : user
        )
      );
    }

  } catch (error) {
    console.error("Failed to toggle block status:", error);
  }
};


  return (
    <div className="p-6 text-white">
      <h1 className="text-left text-2xl mb-6 font-bold">User Management</h1>

      {/* Search Bar */}
      <div className="flex items-center mb-4">
        <input
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border border-gray-300 rounded-l-md w-1/3 text-black"
        />
        <button
        onClick={handleSearch}
        className="bg-black text-white px-4 py-2 rounded-r-md">Search</button>
        <div className="flex items-center gap-2 ml-auto">
          <label className="font-semibold text-lg text-white mr-2">Filter by:</label>
          <select
          onChange={(e) => setStatusFilter(e.target.value)}
            className="p-2 border-gray-300 rounded-md text-white bg-black"
          >
            <option value="">All</option>
            <option value="active">Active</option>
            <option value="blocked">Blocked</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto min-h-[450px]">
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-black text-white text-left">
              <th className="p-3">Id</th>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Role</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user, index) => (
                <tr key={user._id} className="border-b border-gray-300">
                  <td className="p-3">{(currentPage-1) * USERS_PER_PAGE + index + 1}</td>
                  <td className="p-3">{user.name}</td>
                  <td className="p-3">{user.email}</td>
                  <td className="p-3 capitalize">{user.role}</td>
                  <td className="p-3">{user.isBlocked ? 'Blocked' : 'Active'}</td>
                  <td className="p-3 space-x-2">
                    <button
                    onClick={() => {
                      setViewModal(true)
                    }}
                     className="bg-gray-300 text-black px-2 py-1 rounded">View</button>
                    <button className={`px-2 py-1 rounded ${user.isBlocked ? "bg-green-600" : "bg-red-700"}`} 
                      onClick={() => handleToggleBlock(user._id)}>
                      {user.isBlocked ? "Unblock" : "Block"}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="p-3 text-center text-gray-400">No users found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* { view Modal } */}

      {viewModal && (
        <div className='fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 '>
          <div className='bg-white rounded-lg p-6 w-96'>
            <h2 className="text-xl font-bold mb-4 text-black text-center">View Modal</h2>
            <div className='flex justify-center'>
              <button
                onClick={() => {
                  setViewModal(false)
                }}
                className='bg-green-500 px-4 py-2 rounded font-medium'
                >Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                />
              </PaginationItem>

              {Array.from({ length: totalPages }, (_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    href="#"
                    isActive={i + 1 === currentPage}
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={() =>
                    currentPage < totalPages && setCurrentPage(currentPage + 1)
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

    </div>
  );
}

export default UsersListComponent;
