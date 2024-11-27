export interface Location {
  city: string;
  radius: string;
}

export interface SearchParams {
  keywords?: string;
  location?: string;
  department?: string;
  employmentType?: string;
  postedAfter?: Date;
}

export interface JobDetail {
  sourceId: string;
  title: string;
  company: string;
  location: string;
  department?: string;
  employmentType?: string;
  description?: string;
  requirements?: string[];
  responsibilities?: string[];
  qualifications?: string[];
  salary?: {
    min?: number;
    max?: number;
    type?: string;
    currency?: string;
    text?: string;
  };
  benefits?: string[];
  remote?: boolean;
  workplaceType?: string;
  url: string;
  postedDate: Date;
  lastUpdated?: Date;
  source: string;
  applied?: boolean;
}

export interface HealthCheckResult {
  status: 'healthy' | 'degraded' | 'unhealthy';
  services: {
    [key: string]: {
      healthy: boolean;
      latency?: number;
      lastError?: string;
    };
  };
  timestamp: string;
}

export interface Alerter {
  send(level: 'info' | 'warning' | 'error', message: string, details?: any): Promise<void>;
}