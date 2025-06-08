import React, { useState } from "react";
import Icon from "../../atoms/Icons";

export default function TicketCard({ ticket }) {
  const [summary, setSummary] = useState("");
  const [isSummarizing, setIsSummarizing] = useState(false);

  const handleSummarize = async () => {
    setIsSummarizing(true);
    const prompt = `Summarize the following support ticket in a single, concise sentence. Ticket content: "Subject: ${ticket.subject}. Problem: ${ticket.snippet}. Resolution: ${ticket.resolution}"`;

    try {
      const chatHistory = [{ role: "user", parts: [{ text: prompt }] }];
      const payload = { contents: chatHistory };
      const apiKey = ""; // Leave blank for automatic key handling
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();

      if (result.candidates && result.candidates.length > 0) {
        setSummary(result.candidates[0].content.parts[0].text);
      } else {
        setSummary("Could not generate summary.");
      }
    } catch (error) {
      console.error("Summarization failed:", error);
      setSummary("Summarization failed due to an error.");
    } finally {
      setIsSummarizing(false);
    }
  };

  return (
    <div className="bg-white p-5 rounded-lg shadow-md border border-gray-200 flex flex-col h-full">
      <div className="flex-grow">
        <div className="flex justify-between items-start mb-2">
          <span className="text-sm font-semibold bg-purple-100 text-purple-700 py-1 px-2 rounded">
            {ticket.ticket_id}
          </span>
          <span
            className={`text-sm font-bold ${
              ticket.score > 0.9 ? "text-green-600" : "text-yellow-600"
            }`}
          >
            Score: {(ticket.score * 100).toFixed(1)}%
          </span>
        </div>
        <h3 className="font-bold text-gray-800 mb-2">{ticket.subject}</h3>
        <p className="text-sm text-gray-600 mb-3">
          <strong className="text-gray-700">Problem:</strong> {ticket.snippet}
        </p>
        <p className="text-sm text-gray-600">
          <strong className="text-gray-700">Resolution:</strong>{" "}
          {ticket.resolution}
        </p>
      </div>
      <div className="mt-4 pt-4 border-t border-gray-200">
        {summary ? (
          <div className="bg-purple-50 p-3 rounded-lg">
            <h4 className="font-bold text-sm text-purple-800 mb-1 flex items-center">
              <Icon name="Bot" size={16} className="mr-2" /> AI Summary
            </h4>
            <p className="text-sm text-purple-700">{summary}</p>
          </div>
        ) : (
          <button
            onClick={handleSummarize}
            disabled={isSummarizing}
            className="w-full text-sm font-semibold text-purple-600 hover:text-purple-800 disabled:text-gray-400 flex items-center justify-center p-2 rounded-md hover:bg-purple-50 transition-colors"
          >
            {isSummarizing ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600 mr-2"></div>
            ) : (
              <Icon name="Sparkles" size={16} className="mr-2" />
            )}
            {isSummarizing ? "Summarizing..." : "Summarize"}
          </button>
        )}
      </div>
    </div>
  );
}

TicketCard.displayName = "TicketCard";
