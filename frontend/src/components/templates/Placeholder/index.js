import React from "react";

export default function PlaceholderPage({ title, description }) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-10">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">{title}</h1>
      <p className="text-lg text-gray-500 max-w-md">{description}</p>
      <div className="mt-8 p-8 border-4 border-dashed border-gray-300 rounded-lg">
        <p className="text-gray-400 font-medium">Future Content Area</p>
      </div>
    </div>
  );
}

PlaceholderPage.displayName = "PlaceholderPage";
