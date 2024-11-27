import React, { createContext, useContext, useState } from 'react';

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

interface JobManagementContextType {
  savedJobs: Job[];
  rejectedJobs: Job[];
  saveJob: (job: Job) => void;
  rejectJob: (job: Job) => void;
  isJobProcessed: (jobId: string) => boolean;
}

const JobManagementContext = createContext<JobManagementContextType | undefined>(undefined);

export const JobManagementProvider = ({ children }: { children: React.ReactNode }) => {
  const [savedJobs, setSavedJobs] = useState<Job[]>([]);
  const [rejectedJobs, setRejectedJobs] = useState<Job[]>([]);

  const saveJob = (job: Job) => {
    setSavedJobs(prev => [...prev, job]);
  };

  const rejectJob = (job: Job) => {
    setRejectedJobs(prev => [...prev, job]);
  };

  const isJobProcessed = (jobId: string) => {
    return savedJobs.some(job => job.id === jobId) || 
           rejectedJobs.some(job => job.id === jobId);
  };

  return (
    <JobManagementContext.Provider
      value={{
        savedJobs,
        rejectedJobs,
        saveJob,
        rejectJob,
        isJobProcessed,
      }}
    >
      {children}
    </JobManagementContext.Provider>
  );
};

export const useJobManagement = () => {
  const context = useContext(JobManagementContext);
  if (context === undefined) {
    throw new Error('useJobManagement must be used within a JobManagementProvider');
  }
  return context;
};