import React from 'react';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface FileUploadProps {
  onFileSelect: (content: string) => void;
}

export const FileUpload = ({ onFileSelect }: FileUploadProps) => {
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (!allowedTypes.includes(file.type)) {
      toast.error('Please upload a PDF, DOC, or DOCX file');
      return;
    }

    // For now, we'll just read text files. In a real implementation,
    // you'd want to use appropriate libraries to parse DOC/DOCX/PDF
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      onFileSelect(content);
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-4">
      <input
        type="file"
        accept=".pdf,.doc,.docx"
        onChange={handleFileChange}
        className="hidden"
        id="resume-upload"
      />
      <Button
        onClick={() => document.getElementById('resume-upload')?.click()}
        variant="outline"
        className="w-full"
      >
        Upload Resume (PDF, DOC, DOCX)
      </Button>
    </div>
  );
};