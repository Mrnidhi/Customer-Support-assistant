import React from "react";

export default function Button({ children, isLoading, disabled, ...props }) {
  return (
    <button
      disabled={isLoading || disabled}
      className="h-14 px-8 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 disabled:bg-purple-300 flex items-center justify-center transition-colors"
      {...props}
    >
      {isLoading ? (
        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
      ) : (
        children
      )}
    </button>
  );
}

Button.displayName = "Button";
