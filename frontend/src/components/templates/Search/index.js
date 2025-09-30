import React, { useState, useEffect, useRef } from "react";
import Icon from "../../atoms/Icons";
import Button from "../../atoms/Buttons";
import TicketCard from "../../molecules/TicketCard";
import { useSearch } from "@/contexts/SearchContext";

/**
 * Search Page Component
 * 
 * The main search interface for the SupportAI Knowledge Base. This component
 * provides a user-friendly interface for querying the support ticket database
 * using natural language questions.
 * 
 * Features:
 * - Natural language query input
 * - Real-time search results
 * - AI-generated answers with source citations
 * - Responsive design for all devices
 */
export default function SearchPage() {
  const { searchState, updateSearchState } = useSearch();
  const [localQuery, setLocalQuery] = useState("");
  const [searchHistory, setSearchHistory] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const inputRef = useRef(null);

  // Sample search suggestions for better UX
  const sampleQueries = [
    "How to reset password?",
    "SSL certificate expired",
    "Database connection issues",
    "API rate limiting problems",
    "User authentication failed"
  ];

  useEffect(() => {
    setLocalQuery(searchState.query);
    
    // Focus input on component mount
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [searchState.query]);

  // Handle search with enhanced error handling and user feedback
  const handleSearch = async (e) => {
    e.preventDefault();
    const trimmedQuery = localQuery.trim();
    
    if (!trimmedQuery) {
      alert("Please enter a question to search for.");
      return;
    }

    // Add to search history
    const newHistory = [trimmedQuery, ...searchHistory.filter(q => q !== trimmedQuery)].slice(0, 5);
    setSearchHistory(newHistory);
    localStorage.setItem('searchHistory', JSON.stringify(newHistory));

    updateSearchState({ isLoading: true, query: trimmedQuery });

    try {
      const payload = {
        question: trimmedQuery,
        top_k: 5,
      };

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout

      const response = await fetch("http://localhost:8000/answer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      updateSearchState({ results: data, isLoading: false });
      
    } catch (error) {
      console.error("Search failed:", error);
      
      let errorMessage = "Search failed. Please try again.";
      if (error.name === 'AbortError') {
        errorMessage = "Search timed out. Please try a shorter query.";
      } else if (error.message.includes('Failed to fetch')) {
        errorMessage = "Unable to connect to the server. Please check if the backend is running.";
      }
      
      updateSearchState({ 
        isLoading: false, 
        error: errorMessage 
      });
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    setLocalQuery(suggestion);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Handle history click
  const handleHistoryClick = (query) => {
    setLocalQuery(query);
    updateSearchState({ query });
  };

  // Load search history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('searchHistory');
    if (savedHistory) {
      setSearchHistory(JSON.parse(savedHistory));
    }
  }, []);

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-3 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          SupportAI Knowledge Base
        </h1>
        <p className="text-lg text-gray-600 leading-relaxed">
          Ask any question about support tickets and get AI-powered answers based on our comprehensive knowledge base.
        </p>
        <div className="mt-4 flex items-center text-sm text-gray-500">
          <Icon name="Zap" className="mr-2" size={16} />
          <span>Powered by RAG technology and Google Gemini AI</span>
        </div>
      </div>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="mb-8">
        <div className="relative">
          <Icon
            name="Search"
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-10"
            size={20}
          />
          <input
            ref={inputRef}
            type="text"
            value={localQuery}
            onChange={(e) => setLocalQuery(e.target.value)}
            placeholder="e.g., How to fix an expired SSL certificate?"
            className="w-full h-16 pl-12 pr-32 text-lg text-gray-800 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:outline-none transition-all duration-200 shadow-sm hover:shadow-md"
          />
          <Button 
            type="submit" 
            isLoading={searchState.isLoading}
            className="absolute right-2 top-2 bottom-2 px-6"
          >
            {searchState.isLoading ? "Searching..." : "Search"}
          </Button>
        </div>
      </form>

      {/* Search Suggestions */}
      {!searchState.results && !searchState.isLoading && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Try asking:</h3>
          <div className="flex flex-wrap gap-2">
            {sampleQueries.map((query, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(query)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm transition-colors duration-200 border border-gray-200 hover:border-gray-300"
              >
                {query}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Search History */}
      {searchHistory.length > 0 && !searchState.results && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Recent searches:</h3>
          <div className="flex flex-wrap gap-2">
            {searchHistory.map((query, index) => (
              <button
                key={index}
                onClick={() => handleHistoryClick(query)}
                className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-sm transition-colors duration-200 border border-blue-200 hover:border-blue-300"
              >
                <Icon name="Clock" className="inline mr-2" size={14} />
                {query}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Error Display */}
      {searchState.error && (
        <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <Icon name="AlertCircle" className="text-red-500 mr-3" size={20} />
            <div>
              <h3 className="text-red-800 font-semibold">Search Error</h3>
              <p className="text-red-700">{searchState.error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {searchState.isLoading && (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mb-4"></div>
          <p className="text-gray-600 text-lg">Searching knowledge base...</p>
          <p className="text-gray-500 text-sm mt-2">This may take a few moments</p>
        </div>
      )}

      {/* Results */}
      {searchState.results && (
        <div className="space-y-8 animate-fade-in">
          {/* AI Answer Section */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-4">
              <h2 className="text-xl font-bold text-white flex items-center">
                <Icon name="MessageSquare" className="mr-3" size={24} />
                AI-Generated Answer
              </h2>
            </div>
            <div className="p-6">
              <p className="text-lg text-gray-700 leading-relaxed whitespace-pre-wrap">
                {searchState.results.answer}
              </p>
              {searchState.results.processing_time && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <span className="text-sm text-gray-500">
                    Generated in {searchState.results.processing_time}s
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Source Documents */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <Icon name="FileText" className="text-gray-600 mr-3" size={24} />
              Source Documents
              <span className="ml-3 text-lg font-normal text-gray-500">
                ({searchState.results.matches.length} relevant tickets found)
              </span>
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {searchState.results.matches.map((ticket, index) => (
                <TicketCard key={index} ticket={ticket} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

SearchPage.displayName = "SearchPage";
