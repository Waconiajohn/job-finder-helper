import puppeteer from 'puppeteer';
import * as cheerio from 'cheerio';
import { ATSScraperBase, SearchParams, JobDetail } from '../core/ATSScraperBase';

export class LeverScraper extends ATSScraperBase {
    protected source = 'lever';
    private readonly apiBase = 'https://api.lever.co/v0';
    private readonly webBase = 'https://jobs.lever.co';
    private readonly companyIds: string[] = [];

    async search(params: SearchParams): Promise<JobDetail[]> {
        // For testing purposes, return mock data
        return [
            {
                sourceId: 'lv-1',
                title: 'Full Stack Developer',
                company: 'StartupCo',
                location: 'New York, NY',
                department: 'Engineering',
                employmentType: 'Full-time',
                description: 'Join our dynamic team as a Full Stack Developer...',
                requirements: [
                    '3+ years of full-stack development experience',
                    'Strong knowledge of React and Node.js',
                    'Experience with TypeScript and GraphQL'
                ],
                responsibilities: [
                    'Build and maintain web applications',
                    'Collaborate with cross-functional teams',
                    'Optimize application performance'
                ],
                qualifications: [
                    'BS/MS in Computer Science',
                    'Experience with modern web technologies',
                    'Strong problem-solving skills'
                ],
                benefits: [
                    'Competitive salary and equity',
                    'Health and dental insurance',
                    'Unlimited PTO',
                    'Remote work options'
                ],
                url: 'https://example.com/jobs/lv-1',
                postedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
                lastUpdated: new Date(),
                source: this.source,
                remote: true,
                salary: {
                    min: 120000,
                    max: 180000,
                    currency: 'USD',
                    type: 'yearly'
                }
            }
        ];
    }

    private parseLocation(location: any): string {
        if (!location) return 'Remote';
        
        if (typeof location === 'string') {
            return location.trim() || 'Remote';
        }

        const parts = [
            location.city,
            location.state,
            location.region,
            location.country
        ].filter(Boolean);
        
        return parts.join(', ') || 'Remote';
    }

    private isRemotePosition(job: any): boolean {
        const searchText = [
            job.text,
            job.description,
            job.categories?.location?.name,
            job.workplaceType,
            job.remote,
            job.workplace
        ].filter(Boolean).join(' ').toLowerCase();

        return job.remote === true ||
               searchText.includes('remote') ||
               searchText.includes('work from home') ||
               searchText.includes('wfh');
    }
}
