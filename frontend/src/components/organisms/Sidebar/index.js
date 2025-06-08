import React from "react";
import Image from "next/image";
import Icon from "../../atoms/Icons";

export default function Sidebar({ isExpanded, setIsExpanded, setCurrentPage }) {
  const navItems = [
    {
      icon: <Icon name="Search" size={20} />,
      text: "Knowledge Base Search",
      page: "search",
    },
    {
      icon: <Icon name="Smile" size={20} />,
      text: "Sentiment Analysis",
      page: "sentiment",
    },
    {
      icon: <Icon name="BarChart3" size={20} />,
      text: "Analytics Dashboard",
      page: "analytics",
    },
    {
      icon: <Icon name="Rss" size={20} />,
      text: "Live Ticket Feed",
      page: "feed",
    },
    {
      icon: <Icon name="Settings" size={20} />,
      text: "Settings",
      page: "settings",
    },
  ];

  return (
    <div
      className={`relative flex flex-col bg-gray-800 text-gray-200 transition-all duration-300 ease-in-out ${
        isExpanded ? "w-64" : "w-20"
      }`}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        {isExpanded && <span className="text-xl font-bold">Support AI</span>}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-2 rounded-lg hover:bg-gray-700"
        >
          <Icon name={isExpanded ? "ChevronLeft" : "ChevronRight"} size={20} />
        </button>
      </div>
      <nav className="flex-1 px-2 py-4 space-y-2">
        {navItems.map((item, index) => (
          <a
            key={index}
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setCurrentPage(item.page);
            }}
            className="flex items-center p-3 rounded-lg hover:bg-gray-700"
          >
            {item.icon}
            {isExpanded && (
              <span className="ml-4 font-medium">{item.text}</span>
            )}
          </a>
        ))}
      </nav>
      <div className="p-4 border-t border-gray-700">
        {isExpanded ? (
          <div className="flex items-center">
            <Image
              className="w-10 h-10 rounded-full"
              src="https://placehold.co/100x100/7c3aed/ffffff?text=A"
              alt="Admin"
              width={40}
              height={40}
            />
            <div className="ml-3">
              <p className="font-semibold">Admin User</p>
              <p className="text-xs text-gray-400">admin@example.com</p>
            </div>
          </div>
        ) : (
          <Image
            className="w-10 h-10 rounded-full"
            src="https://placehold.co/100x100/7c3aed/ffffff?text=A"
            alt="Admin"
            width={40}
            height={40}
          />
        )}
      </div>
    </div>
  );
}

Sidebar.displayName = "Sidebar";
