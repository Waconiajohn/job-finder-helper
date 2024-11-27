import puppeteer from 'puppeteer';
import * as cheerio from 'cheerio';
import { ATSScraperBase, SearchParams, JobDetail } from '../core/ATSScraperBase';

export class GreenhouseScraper extends ATSScraperBase {
    protected source = 'greenhouse';
    private readonly apiBase = 'https://boards-api.greenhouse.io/v1';
    private readonly webBase = 'https://boards.greenhouse.io';
    private readonly boardIds: string[] = [];

    async search(params: SearchParams): Promise<JobDetail[]> {
        // For testing purposes, return mock data
        return [
            {
                sourceId: 'gh-1',
                title: 'Senior Software Engineer',
                company: 'TechCorp',
                location: 'San Francisco, CA',
                department: 'Engineering',
                employmentType: 'Full-time',
                description: 'We are looking for a Senior Software Engineer to join our team...',
                requirements: [
                    '5+ years of experience with JavaScript/TypeScript',
                    'Experience with React and Node.js',
                    'Strong problem-solving skills'
                ],
                responsibilities: [
                    'Design and implement new features',
                    'Mentor junior developers',
                    'Contribute to technical architecture decisions'
                ],
                qualifications: [
                    'BS/MS in Computer Science or related field',
                    'Experience with cloud platforms (AWS/GCP)',
                    'Strong communication skills'
                ],
                benefits: [
                    'Competitive salary',
                    'Health insurance',
                    'Flexible work hours',
                    'Remote work options'
                ],
                url: 'https://example.com/jobs/gh-1',
                postedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
                lastUpdated: new Date(),
                source: this.source,
                remote: true,
                salary: {
                    min: 150000,
                    max: 200000,
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
            job.title,
            job.description,
            job.location?.name,
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
