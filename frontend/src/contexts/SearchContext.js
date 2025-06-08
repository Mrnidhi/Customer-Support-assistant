import React, { createContext, useContext, useState } from "react";

const SearchContext = createContext();

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearch must be used within a SearchProvider");
  }
  return context;
};

export const SearchProvider = ({ children }) => {
  const [searchState, setSearchState] = useState({
    query: "",
    results: null,
    isLoading: false,
  });

  const updateSearchState = (newState) => {
    setSearchState((prev) => ({ ...prev, ...newState }));
  };

  const clearSearchState = () => {
    setSearchState({
      query: "",
      results: null,
      isLoading: false,
    });
  };

  return (
    <SearchContext.Provider
      value={{
        searchState,
        updateSearchState,
        clearSearchState,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};
