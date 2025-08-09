import { Home, MessageSquare, Users, Calendar } from "lucide-react";

const NavBar = () => {
  const navItems = [
    { id: 1, icon: <Home size={24} />, label: "Home" },
    { id: 2, icon: <MessageSquare size={24} />, label: "Chat" },
    { id: 3, icon: <Users size={24} />, label: "Teams" },
    { id: 4, icon: <Calendar size={24} />, label: "Calendar" },
  ];

  return (
    <div className="w-14 bg-gray-900 text-white flex flex-col items-center py-4 space-y-6">
      {navItems.map((item) => (
        <button
          key={item.id}
          className="flex flex-col items-center hover:bg-gray-800 p-2 rounded-lg transition-colors"
        >
          {item.icon}
          <span className="text-[10px] mt-1">{item.label}</span>
        </button>
      ))}
    </div>
  );
};

export default NavBar;