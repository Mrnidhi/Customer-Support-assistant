import Head from "next/head";
import { useState, useEffect } from "react";
import { Sidebar } from "../components/organisms";
import { SearchPage, PlaceholderPage } from "../components/templates";

/**
 * Main Application Component
 * 
 * This is the root component of the SupportAI Knowledge Base application.
 * It manages the overall layout, navigation state, and renders the appropriate
 * page based on user selection.
 * 
 * Features:
 * - Responsive sidebar navigation
 * - Dynamic page rendering
 * - State management for UI interactions
 */
export default function Home() {
  // State management for navigation and UI
  const [currentPage, setCurrentPage] = useState("search");
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Handle window resize for responsive design
  useEffect(() => {
    const handleResize = () => {
      // Collapse sidebar on mobile devices
      if (window.innerWidth < 768) {
        setIsSidebarExpanded(false);
      }
    };

    // Set initial state based on screen size
    handleResize();
    window.addEventListener("resize", handleResize);
    
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Page rendering logic with enhanced descriptions
  const renderPage = () => {
    switch (currentPage) {
      case "search":
        return <SearchPage />;
      case "sentiment":
        return (
          <PlaceholderPage
            title="Sentiment Analysis"
            description="Analyze customer sentiment trends across support tickets to identify patterns and improve service quality. This feature will provide insights into customer satisfaction and emotional tone."
            icon="Smile"
            comingSoon={true}
          />
        );
      case "analytics":
        return (
          <PlaceholderPage
            title="Analytics Dashboard"
            description="Comprehensive analytics and reporting dashboard featuring interactive charts, trend analysis, ticket volume metrics, response time statistics, and performance KPIs."
            icon="BarChart3"
            comingSoon={true}
          />
        );
      case "feed":
        return (
          <PlaceholderPage
            title="Live Ticket Feed"
            description="Real-time monitoring of incoming support tickets with automatic classification, priority scoring, and instant notifications for high-priority issues."
            icon="Rss"
            comingSoon={true}
          />
        );
      case "settings":
        return (
          <PlaceholderPage
            title="System Settings"
            description="Configure data sources, manage API keys, set up user permissions, customize AI model parameters, and adjust system preferences."
            icon="Settings"
            comingSoon={true}
          />
        );
      default:
        return <SearchPage />;
    }
  };

  return (
    <>
      <Head>
        <title>SupportAI Knowledge Base</title>
        <meta
          name="description"
          content="AI-powered customer support analysis and knowledge base system using RAG technology"
        />
        <meta name="keywords" content="AI, customer support, knowledge base, RAG, natural language processing" />
        <meta name="author" content="SupportAI Team" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      
      <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100 font-sans antialiased">
        {/* Navigation Sidebar */}
        <Sidebar
          isExpanded={isSidebarExpanded}
          setIsExpanded={setIsSidebarExpanded}
          setCurrentPage={setCurrentPage}
          currentPage={currentPage}
        />
        
        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto">
          {/* Loading Overlay */}
          {isLoading && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading...</p>
              </div>
            </div>
          )}
          
          {/* Page Content */}
          <div className="min-h-full">
            {renderPage()}
          </div>
        </main>
      </div>
    </>
  );
}
