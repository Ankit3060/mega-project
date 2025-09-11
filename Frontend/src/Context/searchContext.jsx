import React, { createContext, useContext, useState } from 'react';

// Create the Search Context
const SearchContext = createContext();

// Custom hook to use search context
export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};

// Search Provider Component
export const SearchProvider = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const clearSearch = () => {
    setSearchQuery('');
  };

  const value = {
    searchQuery,
    setSearchQuery,
    clearSearch
  };

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  );
};