import React, { useState } from "react";
import { JobFinder } from "@/components/JobSearch/JobFinder";
import { JobCard } from "@/components/JobSearch/JobCard";
import { toast } from "sonner";
import { JobSearchProvider } from "@/contexts/JobSearchContext";
import { useJobManagement } from "@/contexts/JobManagementContext";
import axios from "axios";

interface Job {
  id: string;
  title: string;
  company: string;
  description: string;
  link: string;
  location?: string;
  salary?: string;
  postedDate?: string;
}

const Index = () => {
  const [searchResults, setSearchResults] = useState<Job[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const { saveJob, rejectJob, isJobProcessed } = useJobManagement();

  const handleSearch = async (queries: string | string[]) => {
    setIsSearching(true);
    const queryArray = Array.isArray(queries) ? queries : [queries];
    
    try {
      const response = await axios.post('http://localhost:3001/api/search-jobs', {
        queries: queryArray
      });

      if (response.data.success) {
        const validResults = response.data.results.filter((job: Job) => !isJobProcessed(job.id));
        setSearchResults(prev => [...prev, ...validResults]);
        
        if (validResults.length > 0) {
          toast.success("Job postings found!");
        } else {
          toast.info("No new job postings found for your search criteria.");
        }
      } else {
        toast.error("Failed to fetch job postings");
      }
    } catch (error) {
      console.error('Search error:', error);
      toast.error("Error performing job search");
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <JobSearchProvider>
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Job Search Assistant
          </h1>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <JobFinder onSearch={handleSearch} />
            </div>
            <div className="lg:col-span-2">
              <div className="space-y-4">
                {isSearching ? (
                  <div className="text-center text-gray-500 py-8">
                    Searching for jobs...
                  </div>
                ) : searchResults.length > 0 ? (
                  searchResults.map((job) => (
                    <JobCard
                      key={job.id}
                      job={job}
                      onSave={saveJob}
                      onReject={rejectJob}
                    />
                  ))
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    No job results to display. Start a search to see jobs here.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </JobSearchProvider>
  );
};

export default Index;