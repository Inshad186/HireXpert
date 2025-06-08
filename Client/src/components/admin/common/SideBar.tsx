function SideBar() {
  return (
    <aside className="w-56 bg-black text-white flex flex-col p-4">
      <h1 className="text-2xl font-bold mb-10">HireXpert</h1>
      <nav className="flex flex-col gap-6">
        <a href="/admin/dashboard" className="hover:text-gray-400">Dashboard</a>
        <a href="/admin/userManagement" className="hover:text-gray-400">User Management</a>
        <a href="/admin/gigs" className="hover:text-gray-400">Gig Management</a>
      </nav>
    </aside>
  );
}

export default SideBar;
