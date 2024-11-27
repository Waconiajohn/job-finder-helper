import React from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface ResumeEditorProps {
  content: string;
  onChange: (content: string) => void;
  onExport: () => void;
}

export const ResumeEditor = ({ content, onChange, onExport }: ResumeEditorProps) => {
  return (
    <div className="space-y-4">
      <Textarea
        value={content}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-[400px] font-mono"
        placeholder="Your resume content..."
      />
      <div className="flex justify-end">
        <Button onClick={onExport}>
          Export Resume
        </Button>
      </div>
    </div>
  );
};