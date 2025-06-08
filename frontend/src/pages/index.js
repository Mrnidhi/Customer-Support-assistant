import Head from "next/head";
import { useState } from "react";
import { Sidebar } from "../components/organisms";
import { SearchPage, PlaceholderPage } from "../components/templates";

export default function Home() {
  const [currentPage, setCurrentPage] = useState("search");
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

  const renderPage = () => {
    switch (currentPage) {
      case "search":
        return <SearchPage />;
      case "sentiment":
        return <PlaceholderPage />;
      case "analytics":
        return (
          <PlaceholderPage
            title="Analytics Dashboard"
            description="This is where charts and graphs for trend analysis and ticket volume will be displayed."
          />
        );
      case "feed":
        return (
          <PlaceholderPage
            title="Live Ticket Feed"
            description="A future real-time feed of incoming support tickets, automatically classified and analyzed."
          />
        );
      case "settings":
        return (
          <PlaceholderPage
            title="Settings"
            description="Manage data sources, API keys, user permissions, and other application configurations here."
          />
        );
      default:
        return <SearchPage />;
    }
  };

  return (
    <>
      <Head>
        <title>Support AI Analyzer</title>
        <meta
          name="description"
          content="AI-powered customer support analysis tool"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex h-screen bg-gray-100 font-sans">
        <Sidebar
          isExpanded={isSidebarExpanded}
          setIsExpanded={setIsSidebarExpanded}
          setCurrentPage={setCurrentPage}
        />
        <main className="flex-1 overflow-y-auto">{renderPage()}</main>
      </div>
    </>
  );
}
