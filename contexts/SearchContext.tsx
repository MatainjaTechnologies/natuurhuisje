"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SearchContextType {
  location: string;
  setLocation: (location: string) => void;
  guests: number;
  setGuests: (guests: number) => void;
  pets: boolean;
  setPets: (pets: boolean) => void;
  selectedStartDate: Date | null;
  setSelectedStartDate: (date: Date | null) => void;
  selectedEndDate: Date | null;
  setSelectedEndDate: (date: Date | null) => void;
  resetSearch: () => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: ReactNode }) {
  const [location, setLocation] = useState("");
  const [guests, setGuests] = useState(2);
  const [pets, setPets] = useState(false);
  const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(null);
  const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(null);

  const resetSearch = () => {
    setLocation("");
    setGuests(2);
    setPets(false);
    setSelectedStartDate(null);
    setSelectedEndDate(null);
  };

  return (
    <SearchContext.Provider
      value={{
        location,
        setLocation,
        guests,
        setGuests,
        pets,
        setPets,
        selectedStartDate,
        setSelectedStartDate,
        selectedEndDate,
        setSelectedEndDate,
        resetSearch,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
}
