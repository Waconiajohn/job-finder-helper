import OpenAI from 'openai';
import { toast } from 'sonner';

const getOpenAIClient = () => {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  
  if (!apiKey) {
    throw new Error('OpenAI API key is not configured. Please add VITE_OPENAI_API_KEY to your environment variables.');
  }

  return new OpenAI({
    apiKey,
    dangerouslyAllowBrowser: true
  });
};

export const matchResumeWithJob = async (resume: string, jobDescription: string) => {
  try {
    const openai = getOpenAIClient();
    
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a professional resume matcher. Analyze the resume and job description, then provide a match percentage and specific feedback."
        },
        {
          role: "user",
          content: `Resume: ${resume}\n\nJob Description: ${jobDescription}\n\nPlease analyze the match and provide feedback.`
        }
      ]
    });

    return response.choices[0].message.content;
  } catch (error) {
    if (error instanceof Error && error.message.includes('API key')) {
      toast.error('OpenAI API key is not configured. Please add your API key to continue.');
    } else {
      toast.error('Failed to analyze resume match');
    }
    throw error;
  }
};

export const submitDirectApplication = async (applicationData: {
  resume: string;
  jobId: string;
  platform: string;
  coverLetter?: string;
}) => {
  // This is a mock implementation - replace with actual ATS API integration
  const response = await fetch(`/api/apply/${applicationData.platform}/${applicationData.jobId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(applicationData),
  });

  if (!response.ok) {
    throw new Error('Failed to submit application');
  }

  return response.json();
};