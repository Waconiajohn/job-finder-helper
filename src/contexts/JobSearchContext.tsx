import React, { createContext, useContext, useState } from "react";
import { ATS_PLATFORMS } from "@/lib/constants";
import { Location } from "@/types";

interface JobSearchContextType {
  jobTitles: string;
  setJobTitles: (titles: string) => void;
  locations: Location[];
  setLocations: (locations: Location[]) => void;
  selectedWorkLocations: string[];
  setSelectedWorkLocations: (locations: string[]) => void;
  dateRange: string;
  setDateRange: (range: string) => void;
  selectedPlatforms: string[];
  setSelectedPlatforms: (platforms: string[]) => void;
  recentSearches: string[];
  addRecentSearch: (search: string) => void;
  clearForm: () => void;
}

const JobSearchContext = createContext<JobSearchContextType | undefined>(undefined);

export const JobSearchProvider = ({ children }: { children: React.ReactNode }) => {
  const [jobTitles, setJobTitles] = useState("");
  const [locations, setLocations] = useState<Location[]>([{ city: "", radius: "25" }]);
  const [selectedWorkLocations, setSelectedWorkLocations] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState("7");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(
    ATS_PLATFORMS.map(platform => platform.id)
  );
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const addRecentSearch = (search: string) => {
    setRecentSearches(prev => {
      const newSearches = [search, ...prev.filter(s => s !== search)].slice(0, 5);
      return newSearches;
    });
  };

  const clearForm = () => {
    setJobTitles("");
    setLocations([{ city: "", radius: "25" }]);
    setSelectedWorkLocations([]);
    setDateRange("7");
    setSelectedPlatforms(ATS_PLATFORMS.map(platform => platform.id));
  };

  return (
    <JobSearchContext.Provider
      value={{
        jobTitles,
        setJobTitles,
        locations,
        setLocations,
        selectedWorkLocations,
        setSelectedWorkLocations,
        dateRange,
        setDateRange,
        selectedPlatforms,
        setSelectedPlatforms,
        recentSearches,
        addRecentSearch,
        clearForm,
      }}
    >
      {children}
    </JobSearchContext.Provider>
  );
};

export const useJobSearch = () => {
  const context = useContext(JobSearchContext);
  if (context === undefined) {
    throw new Error("useJobSearch must be used within a JobSearchProvider");
  }
  return context;
};