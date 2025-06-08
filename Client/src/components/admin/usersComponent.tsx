import { getUsersList } from '@/api/admin.api';
import React, { useState, useEffect } from 'react';
import { blockUsers } from '@/api/admin.api';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  isBlocked: boolean;
}


function UsersComponent() {
  const [users, setUsers] = useState<User[]>([]);


  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getUsersList();
        console.log("Users List %%% > : ", response.data);

        if (response.data.success) {
          setUsers(response.data.users); 
        }
      } catch (error) {
        console.error("Error in fetching users", error);
      }
    };

    fetchUsers();
  }, []);


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
          className="p-2 border border-gray-300 rounded-l-md w-1/3 text-black"
        />
        <button className="bg-black text-white px-4 py-2 rounded-r-md">Search</button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-black text-white text-left">
              <th className="p-3">UserID</th>
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
                  <td className="p-3">{index + 1}</td>
                  <td className="p-3">{user.name}</td>
                  <td className="p-3">{user.email}</td>
                  <td className="p-3 capitalize">{user.role}</td>
                  <td className="p-3">{user.isBlocked ? 'Blocked' : 'Active'}</td>
                  <td className="p-3 space-x-2">
                    <button className="bg-gray-300 text-black px-2 py-1 rounded">View</button>
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
    </div>
  );
}

export default UsersComponent;
