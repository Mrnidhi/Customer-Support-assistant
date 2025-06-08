import React, { useState, useEffect } from "react";
import Icon from "../../atoms/Icons";
import Button from "../../atoms/Buttons";
import TicketCard from "../../molecules/TicketCard";
import { useSearch } from "@/contexts/SearchContext";

export default function SearchPage() {
  const { searchState, updateSearchState } = useSearch();
  const [localQuery, setLocalQuery] = useState("");

  useEffect(() => {
    setLocalQuery(searchState.query);
  }, [searchState.query]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!localQuery.trim()) return;

    updateSearchState({ isLoading: true, query: localQuery });

    try {
      const payload = {
        question: localQuery,
        top_k: 5,
      };
      const response = await fetch("http://localhost:8000/answer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      updateSearchState({ results: data, isLoading: false });
    } catch (error) {
      console.error("Search failed:", error);
      updateSearchState({ isLoading: false });
    }
  };

  return (
    <div className="p-6 md:p-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">
        Knowledge Base Search
      </h1>
      <p className="text-gray-500 mb-8">
        Ask a question to get an answer based on historical support tickets.
      </p>
      <form onSubmit={handleSearch} className="flex items-center gap-3 mb-10">
        <div className="relative flex-grow">
          <Icon
            name="Search"
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            value={localQuery}
            onChange={(e) => setLocalQuery(e.target.value)}
            placeholder="e.g., How to fix an expired SSL certificate?"
            className="w-full h-14 pl-12 pr-4 text-lg text-black bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
          />
        </div>
        <Button type="submit" isLoading={searchState.isLoading}>
          Search
        </Button>
      </form>
      {searchState.results && (
        <div className="space-y-8 animate-fade-in">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <Icon name="MessageSquare" className="text-purple-600 mr-3" /> AI
              Generated Answer
            </h2>
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <p className="text-lg text-gray-700 leading-relaxed">
                {searchState.results.answer}
              </p>
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <Icon name="FileText" className="text-gray-500 mr-3" /> Source
              Documents
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
