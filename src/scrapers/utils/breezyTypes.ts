export interface JobDetailsError {
    error: string;
    statusCode: number;
}

export interface BreezyJobResponse {
    _id: string;
    name: string;
    company: {
        name: string;
    };
    location?: {
        city?: string;
        state?: string;
        country?: string;
    };
    department?: string;
    type?: string;
    creation_date: string;
    requirements?: string[] | string;
    responsibilities?: string[] | string;
    qualifications?: string[] | string;
    benefits?: string[] | string;
    description?: string;
    remote?: boolean;
    workplace_type?: string;
    salary?: {
        min?: number;
        max?: number;
        type?: string;
        currency?: string;
        description?: string;
    };
}