import React from 'react';
import { Outlet } from 'react-router-dom';
import SideBar from '@/components/admin/common/SideBar';

function AdminLayout() {
  return (
    <div className="flex h-screen bg-[#2d2d2d] text-white">
      <SideBar />
      <div className="flex-1 flex flex-col">
        <Outlet />
      </div>
    </div>
  );
}

export default AdminLayout;
