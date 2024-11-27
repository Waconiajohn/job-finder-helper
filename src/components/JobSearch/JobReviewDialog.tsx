import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, BookmarkPlus, XCircle } from "lucide-react";

interface JobReviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  job: {
    id: string;
    title: string;
    company: string;
    description: string;
    link: string;
    location?: string;
    salary?: string;
    postedDate?: string;
  };
  onSave: () => void;
  onReject: () => void;
}

export const JobReviewDialog = ({
  isOpen,
  onClose,
  job,
  onSave,
  onReject,
}: JobReviewDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{job.title}</DialogTitle>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-muted-foreground">{job.company}</span>
            {job.location && (
              <Badge variant="secondary">{job.location}</Badge>
            )}
            {job.salary && (
              <Badge variant="outline">{job.salary}</Badge>
            )}
          </div>
        </DialogHeader>
        
        <ScrollArea className="mt-4 h-[40vh]">
          <div className="space-y-4">
            <div className="prose prose-sm max-w-none">
              <div dangerouslySetInnerHTML={{ __html: job.description }} />
            </div>
            {job.postedDate && (
              <p className="text-sm text-muted-foreground">
                Posted: {job.postedDate}
              </p>
            )}
          </div>
        </ScrollArea>

        <DialogFooter className="flex justify-between mt-6">
          <div className="flex gap-2">
            <Button variant="outline" onClick={onReject}>
              <XCircle className="w-4 h-4 mr-2" />
              Not Interested
            </Button>
            <Button onClick={onSave}>
              <BookmarkPlus className="w-4 h-4 mr-2" />
              Save Job
            </Button>
          </div>
          <Button asChild>
            <a href={job.link} target="_blank" rel="noopener noreferrer">
              Apply Now
              <ExternalLink className="w-4 h-4 ml-2" />
            </a>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};