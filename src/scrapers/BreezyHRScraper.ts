import { ATSScraperBase } from '../core/ATSScraperBase';
import { JobDetail, SearchParams } from '../types';
import type { Browser, Page } from 'puppeteer';
import puppeteer from 'puppeteer';
import { load } from 'cheerio';
import { BreezyParser } from './utils/breezyParser';
import { BreezyJobResponse, JobDetailsError } from './utils/breezyTypes';

export class BreezyHRScraper extends ATSScraperBase {
    protected source = 'breezyhr';
    private readonly apiBase = 'https://api.breezy.hr/v3';
    private readonly webBase = 'https://careers.breezy.hr';
    private readonly companyIds: string[] = [];
    private parser: BreezyParser;

    constructor() {
        super();
        this.parser = new BreezyParser();
    }

    protected cleanText(text: string): string {
        return text
            ?.replace(/[\n\r\t]+/g, ' ')
            .replace(/\s+/g, ' ')
            .trim() || '';
    }

    private buildJobDetailsUrl(jobId: string): string {
        return `${this.apiBase}/positions/${jobId}`;
    }

    private parseSalary(details: any): any {
        if (!details.salary) return null;

        return {
            min: details.salary.min,
            max: details.salary.max,
            type: details.salary.type?.toLowerCase(),
            currency: details.salary.currency || 'USD',
            text: details.salary.description
        };
    }

    private isRemotePosition(details: any): boolean {
        return details.remote ||
               details.name?.toLowerCase().includes('remote') ||
               details.description?.toLowerCase().includes('remote position');
    }

    private parseWorkplaceType(details: any): string {
        return details.workplace_type || 'On-site';
    }

    async search(params: SearchParams): Promise<JobDetail[]> {
        return this.retryManager.retry(async () => {
            const browser = await puppeteer.launch({
                headless: true,
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            });

            try {
                const page = await browser.newPage();
                await this.setupBreezyPage(page);
                return await this.scrapeAllCompanies(page, params);
            } finally {
                await browser.close();
            }
        });
    }

    private async enrichWithDetails(page: Page, job: JobDetail): Promise<JobDetail> {
        const detailsUrl = this.buildJobDetailsUrl(job.sourceId);
        const details = await this.fetchJobDetails(page, detailsUrl);
        
        if (!details) return job;

        const $ = load(details.description || '');

        return {
            ...job,
            description: this.parser.parseDescription($),
            requirements: this.parser.parseRequirements($, details),
            responsibilities: this.parser.parseResponsibilities($, details),
            qualifications: this.parser.parseQualifications($, details),
            benefits: this.parser.parseBenefits($, details),
            salary: this.parseSalary(details),
            remote: this.isRemotePosition(details),
            workplaceType: this.parseWorkplaceType(details)
        };
    }

    private async setupBreezyPage(page: Page): Promise<void> {
        await page.setUserAgent(this.getUserAgent());
        await page.setRequestInterception(true);

        page.on('request', request => {
            if (request.resourceType() === 'fetch' && request.url().includes('/v3/')) {
                const headers = {
                    ...request.headers(),
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${this.getApiKey()}`
                };
                request.continue({ headers });
            } else if (['image', 'stylesheet', 'font'].includes(request.resourceType())) {
                request.abort();
            } else {
                request.continue();
            }
        });
    }

    private async fetchJobDetails(page: Page, url: string): Promise<any> {
        try {
            const response = await page.goto(url, { waitUntil: 'networkidle0' });
            const data = await response.json();
            
            if ('error' in data) {
                throw new Error((data as JobDetailsError).error);
            }
            
            return data;
        } catch (error) {
            console.error(`Error fetching job details from ${url}:`, error);
            return null;
        }
    }

    private async scrapeAllCompanies(page: Page, params: SearchParams): Promise<JobDetail[]> {
        const allJobs: JobDetail[] = [];
        
        for (const companyId of this.companyIds) {
            try {
                const jobs = await this.scrapeCompanyJobs(page, companyId, params);
                allJobs.push(...jobs);
            } catch (error) {
                console.error(`Error scraping company ${companyId}:`, error);
                continue;
            }
        }

        return allJobs;
    }

    private async scrapeCompanyJobs(
        page: Page,
        companyId: string,
        params: SearchParams
    ): Promise<JobDetail[]> {
        const searchUrl = this.buildSearchUrl(companyId, params);
        const jobsData = await this.fetchJobsPage(page, searchUrl);

        if (!Array.isArray(jobsData)) {
            return [];
        }

        const basicJobs = this.parser.parseJobsData(jobsData, companyId, this.source);
        return Promise.all(basicJobs.map(job => this.enrichWithDetails(page, job)));
    }

    private async fetchJobsPage(page: Page, url: string): Promise<any[]> {
        const response = await page.goto(url, { waitUntil: 'networkidle0' });
        return await response.json();
    }

    private getApiKey(): string {
        return process.env.BREEZY_API_KEY || '';
    }

    protected buildSearchParams(params: SearchParams): Record<string, string> {
        const searchParams: Record<string, string> = {};
        if (params.keywords) searchParams.q = params.keywords;
        if (params.location) searchParams.location = params.location;
        if (params.department) searchParams.department = params.department;
        if (params.employmentType) searchParams.type = params.employmentType;
        return searchParams;
    }

    private buildSearchUrl(companyId: string, params: SearchParams): string {
        const searchParams = this.buildSearchParams(params);
        const queryString = new URLSearchParams(searchParams).toString();
        return `${this.apiBase}/companies/${companyId}/positions?${queryString}`;
    }
}
