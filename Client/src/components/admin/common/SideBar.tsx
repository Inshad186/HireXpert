
function SideBar() {
  return (
    <div className="flex h-screen bg-[#2d2d2d] text-white">
      {/* Sidebar */}
      <aside className="w-56 bg-black flex flex-col p-4">
        <h1 className="text-2xl font-bold mb-10">HireXpert</h1>
        <nav className="flex flex-col gap-6">
          <a href="/admin/dashboard" className="hover:text-gray-400">Dashboard</a>
          <a href="/admin/users" className="hover:text-gray-400">User Management</a>
          <a href="/admin/gigs" className="hover:text-gray-400">Gig Management</a>
        </nav>
      </aside>
    </div>
  );
}

export default SideBar;
