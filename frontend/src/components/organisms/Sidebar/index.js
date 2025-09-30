import React from "react";
import Image from "next/image";
import Icon from "../../atoms/Icons";

/**
 * Sidebar Navigation Component
 * 
 * A responsive sidebar navigation that provides access to different
 * sections of the SupportAI Knowledge Base application. Features
 * collapsible design for mobile and desktop use.
 * 
 * Features:
 * - Responsive design with expand/collapse functionality
 * - Active page highlighting
 * - User profile section
 * - Smooth animations and transitions
 */
export default function Sidebar({ isExpanded, setIsExpanded, setCurrentPage, currentPage }) {
  const navItems = [
    {
      icon: "Search",
      text: "Knowledge Base Search",
      page: "search",
      description: "Search support tickets with AI",
      badge: "Active"
    },
    {
      icon: "Smile",
      text: "Sentiment Analysis",
      page: "sentiment",
      description: "Analyze customer sentiment",
      badge: "Coming Soon"
    },
    {
      icon: "BarChart3",
      text: "Analytics Dashboard",
      page: "analytics",
      description: "View trends and metrics",
      badge: "Coming Soon"
    },
    {
      icon: "Rss",
      text: "Live Ticket Feed",
      page: "feed",
      description: "Real-time ticket monitoring",
      badge: "Coming Soon"
    },
    {
      icon: "Settings",
      text: "System Settings",
      page: "settings",
      description: "Configure the application",
      badge: "Coming Soon"
    },
  ];

  return (
    <div
      className={`relative flex flex-col bg-gradient-to-b from-gray-800 to-gray-900 text-gray-200 transition-all duration-300 ease-in-out shadow-xl ${
        isExpanded ? "w-72" : "w-20"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        {isExpanded && (
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center mr-3">
              <Icon name="Zap" size={18} className="text-white" />
            </div>
            <div>
              <span className="text-xl font-bold text-white">SupportAI</span>
              <p className="text-xs text-gray-400">Knowledge Base</p>
            </div>
          </div>
        )}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-2 rounded-lg hover:bg-gray-700 transition-colors duration-200 group"
          title={isExpanded ? "Collapse sidebar" : "Expand sidebar"}
        >
          <Icon 
            name={isExpanded ? "ChevronLeft" : "ChevronRight"} 
            size={20} 
            className="group-hover:text-white transition-colors"
          />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-2 overflow-y-auto">
        {navItems.map((item, index) => {
          const isActive = currentPage === item.page;
          const isComingSoon = item.badge === "Coming Soon";
          
          return (
            <button
              key={index}
              onClick={() => {
                if (!isComingSoon) {
                  setCurrentPage(item.page);
                }
              }}
              disabled={isComingSoon}
              className={`w-full flex items-center p-3 rounded-xl transition-all duration-200 group relative ${
                isActive 
                  ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg" 
                  : isComingSoon
                  ? "opacity-60 cursor-not-allowed"
                  : "hover:bg-gray-700 hover:text-white"
              }`}
              title={isExpanded ? "" : item.text}
            >
              <Icon 
                name={item.icon} 
                size={20} 
                className={`transition-colors ${
                  isActive ? "text-white" : "text-gray-400 group-hover:text-white"
                }`}
              />
              
              {isExpanded && (
                <div className="ml-4 flex-1 text-left">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">{item.text}</span>
                    {item.badge && (
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        item.badge === "Active" 
                          ? "bg-green-100 text-green-800" 
                          : "bg-yellow-100 text-yellow-800"
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </div>
                  {item.description && (
                    <p className="text-xs text-gray-400 mt-1">{item.description}</p>
                  )}
                </div>
              )}
              
              {/* Tooltip for collapsed state */}
              {!isExpanded && (
                <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                  {item.text}
                  <div className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 rotate-45"></div>
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* User Profile Section */}
      <div className="p-4 border-t border-gray-700">
        {isExpanded ? (
          <div className="flex items-center p-3 rounded-xl bg-gray-700 hover:bg-gray-600 transition-colors duration-200 cursor-pointer group">
            <div className="relative">
              <Image
                className="w-10 h-10 rounded-full border-2 border-purple-500"
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
                alt="User Profile"
                width={40}
                height={40}
              />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-gray-700 rounded-full"></div>
            </div>
            <div className="ml-3 flex-1">
              <p className="font-semibold text-sm text-white">Alex Johnson</p>
              <p className="text-xs text-gray-400">Support Team Lead</p>
            </div>
            <Icon name="MoreVertical" size={16} className="text-gray-400 group-hover:text-white transition-colors" />
          </div>
        ) : (
          <div className="flex justify-center">
            <Image
              className="w-10 h-10 rounded-full border-2 border-purple-500 cursor-pointer hover:border-purple-400 transition-colors"
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
              alt="User Profile"
              width={40}
              height={40}
              title="Alex Johnson - Support Team Lead"
            />
          </div>
        )}
      </div>
    </div>
  );
}

Sidebar.displayName = "Sidebar";
