import { useState } from "react";
import { useNavigate } from "react-router-dom";
function SideBar() {

  const [activeTab, setActiveTab] = useState("dashboard")
  const navigate = useNavigate()

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-60 bg-gray-900 text-white p-6">
        <h1 className="text-2xl font-bold mb-8">Admin Panel</h1>
        <nav className="space-y-4">
          {[
            {id:"dashboard", label: "Dashboard", icon: "📊" },
            {id:"freelancers", label: "Freelancers", icon: "👨‍💻" },
            {id:"clients", label: "Clients", icon: "🧑‍🤝‍🧑" },
            {id:"skills", label: "Skill & Category", icon: "🧠" },
            {id:"orders", label: "Orders", icon: "📦" },
            {id:"payments", label: "Payments", icon: "💳" },
          ].map(item => (
            <button
            key={item.id}
            onClick={() => {
              setActiveTab(item.id)
              navigate(`/admin/${item.id}`)
            }
            }
            className={`w-full text-left px-4 py-3 text-white rounded-lg 
            ${item.id === activeTab? "bg-blue-600" : 'hover:bg-gray-800'}`}>
              <span className="mr-2">{item.icon}</span> {item.label}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}

export default SideBar;
