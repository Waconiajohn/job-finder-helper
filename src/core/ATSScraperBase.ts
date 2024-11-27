export interface SearchParams {
    keywords?: string;
    location?: string;
    department?: string;
    employmentType?: string;
    postedAfter?: Date;
    remote?: boolean;
    page?: number;
    limit?: number;
}

export interface JobDetail {
    sourceId: string;
    title: string;
    company: string;
    location: string;
    department?: string;
    employmentType?: string;
    description?: string;
    url: string;
    postedDate: Date;
    lastUpdated?: Date;
    source: string;
    remote?: boolean;
    salary?: {
        min?: number;
        max?: number;
        currency?: string;
        type?: string;
    };
    requirements?: string[];
    responsibilities?: string[];
    qualifications?: string[];
    benefits?: string[];
}

export abstract class ATSScraperBase {
    protected abstract source: string;
    protected retryAttempts = 3;
    protected retryDelay = 1000;

    abstract search(params: SearchParams): Promise<JobDetail[]>;

    protected getUserAgent(): string {
        return 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';
    }

    protected cleanText(text: string | null): string {
        if (!text) return '';
        return text
            .replace(/<[^>]*>/g, ' ')
            .replace(/[\n\r\t]+/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
    }

    protected async handleRateLimit(): Promise<void> {
        await new Promise(resolve => setTimeout(resolve, this.retryDelay));
    }

    protected async retry<T>(fn: () => Promise<T>): Promise<T> {
        let lastError: Error | undefined;

        for (let attempt = 1; attempt <= this.retryAttempts; attempt++) {
            try {
                return await fn();
            } catch (error: any) {
                lastError = error;
                if (!this.isRetryableError(error)) {
                    throw error;
                }
                if (attempt < this.retryAttempts) {
                    await this.handleRateLimit();
                }
            }
        }

        throw lastError;
    }

    protected isRetryableError(error: any): boolean {
        if (error.retryable !== undefined) {
            return error.retryable;
        }
        
        const retryableStatusCodes = [408, 429, 500, 502, 503, 504];
        return error.statusCode ? retryableStatusCodes.includes(error.statusCode) : false;
    }
}
