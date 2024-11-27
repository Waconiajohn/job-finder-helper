import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { constructSearchQuery } from "@/lib/utils";
import { toast } from "sonner";
import { LocationInputs } from "./LocationInputs";
import { WorkTypeSelector } from "./WorkTypeSelector";
import { DateRangeSelector } from "./DateRangeSelector";
import { PlatformSelector } from "./PlatformSelector";
import { useJobSearch } from "@/contexts/JobSearchContext";
import { ATS_PLATFORMS } from "@/lib/constants";
import { Location } from "@/types";

interface JobFinderProps {
  onSearch: (query: string | string[]) => void;
}

export const JobFinder = ({ onSearch }: JobFinderProps) => {
  const {
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
    addRecentSearch,
    clearForm,
  } = useJobSearch();

  const handleAddLocation = () => {
    setLocations([...locations, { city: "", radius: "25" }]);
  };

  const handleRemoveLocation = (index: number) => {
    setLocations(locations.filter((_, i) => i !== index));
  };

  const handleLocationChange = (index: number, field: keyof Location, value: string) => {
    const newLocations = [...locations];
    newLocations[index] = { ...newLocations[index], [field]: value };
    setLocations(newLocations);
  };

  const handleWorkLocationToggle = (value: string) => {
    setSelectedWorkLocations(
      selectedWorkLocations.includes(value)
        ? selectedWorkLocations.filter(loc => loc !== value)
        : [...selectedWorkLocations, value]
    );
  };

  const handlePlatformToggle = (platformId: string) => {
    setSelectedPlatforms(
      selectedPlatforms.includes(platformId)
        ? selectedPlatforms.filter(id => id !== platformId)
        : [...selectedPlatforms, platformId]
    );
  };

  const handleSearch = () => {
    if (!jobTitles.trim()) {
      toast.error("Please enter at least one job title");
      return;
    }

    if (!locations[0].city && selectedWorkLocations.length === 0) {
      toast.error("Please enter at least one location or select a work type");
      return;
    }

    const locationString = locations
      .filter(loc => loc.city.trim())
      .map(loc => `${loc.city.trim()} within ${loc.radius} miles`)
      .join(", ");

    const platformDomains = ATS_PLATFORMS
      .filter(platform => selectedPlatforms.includes(platform.id))
      .map(platform => platform.domain);

    const queries = constructSearchQuery(
      jobTitles,
      locationString,
      selectedWorkLocations.join(" OR "),
      platformDomains
    );

    if (dateRange !== "0") {
      queries.forEach((query, index) => {
        queries[index] = `${query} after:${dateRange}d`;
      });
    }

    queries.forEach(query => addRecentSearch(query));
    onSearch(queries);
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Job Search Parameters</CardTitle>
        <Button variant="outline" onClick={clearForm}>
          Clear All
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Job Titles</label>
          <Input
            placeholder="e.g., Software Engineer, Data Analyst (comma-separated)"
            value={jobTitles}
            onChange={(e) => setJobTitles(e.target.value)}
            aria-label="Job titles"
          />
        </div>

        <LocationInputs
          locations={locations}
          onLocationChange={handleLocationChange}
          onAddLocation={handleAddLocation}
          onRemoveLocation={handleRemoveLocation}
        />

        <WorkTypeSelector
          selectedTypes={selectedWorkLocations}
          onToggle={handleWorkLocationToggle}
        />

        <DateRangeSelector
          value={dateRange}
          onChange={setDateRange}
        />

        <PlatformSelector
          selectedPlatforms={selectedPlatforms}
          onToggle={handlePlatformToggle}
        />

        <Button onClick={handleSearch} className="w-full">
          Search Jobs
        </Button>
      </CardContent>
    </Card>
  );
};

export default JobFinder;