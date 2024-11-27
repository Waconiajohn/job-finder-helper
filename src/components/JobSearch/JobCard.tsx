import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { ArrowRight, Eye } from "lucide-react";
import { JobReviewDialog } from "./JobReviewDialog";
import { toast } from "sonner";

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

interface JobCardProps {
  job: Job;
  onSave: (job: Job) => void;
  onReject: (job: Job) => void;
}

export const JobCard = ({ job, onSave, onReject }: JobCardProps) => {
  const [isReviewOpen, setIsReviewOpen] = useState(false);

  const handleSave = () => {
    onSave(job);
    setIsReviewOpen(false);
    toast.success("Job saved to your list");
  };

  const handleReject = () => {
    onReject(job);
    setIsReviewOpen(false);
    toast.success("Job removed from results");
  };

  return (
    <>
      <Card className="w-full transition-all hover:shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-bold">{job.title}</CardTitle>
          <p className="text-sm text-muted-foreground">{job.company}</p>
        </CardHeader>
        <CardContent>
          <p className="text-sm line-clamp-3">{job.description}</p>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" size="sm" onClick={() => setIsReviewOpen(true)}>
            <Eye className="w-4 h-4 mr-2" />
            Review
          </Button>
          <Button size="sm" asChild>
            <a href={job.link} target="_blank" rel="noopener noreferrer">
              View <ArrowRight className="w-4 h-4 ml-2" />
            </a>
          </Button>
        </CardFooter>
      </Card>

      <JobReviewDialog
        isOpen={isReviewOpen}
        onClose={() => setIsReviewOpen(false)}
        job={job}
        onSave={handleSave}
        onReject={handleReject}
      />
    </>
  );
};