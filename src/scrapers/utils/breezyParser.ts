import type { CheerioAPI } from 'cheerio/lib/cheerio';
import { JobDetail } from '../../types';
import { BreezyJobResponse } from './breezyTypes';

export class BreezyParser {
    parseJobsData(jobs: BreezyJobResponse[], companyId: string, source: string): JobDetail[] {
        return jobs.map(job => ({
            sourceId: job._id,
            title: job.name,
            company: job.company.name,
            location: this.parseLocation(job.location),
            department: job.department,
            employmentType: job.type,
            url: `https://careers.breezy.hr/${companyId}/positions/${job._id}`,
            postedDate: new Date(job.creation_date),
            source: source
        }));
    }

    parseDescription($: CheerioAPI): string {
        $('[class*="requirements"], [class*="responsibilities"], [class*="qualifications"], [class*="benefits"]').remove();
        return this.cleanText($('body').html() || '');
    }

    parseRequirements($: CheerioAPI, details: BreezyJobResponse): string[] {
        const fromHTML = $('[class*="requirements"] li, [data-section*="requirements"] li')
            .toArray()
            .map(el => $(el).text().trim());

        const fromFields = Array.isArray(details.requirements)
            ? details.requirements
            : (details.requirements?.split('\n') || []);

        return [...new Set([...fromHTML, ...fromFields])]
            .filter((item): item is string => Boolean(item));
    }

    parseResponsibilities($: CheerioAPI, details: BreezyJobResponse): string[] {
        const fromHTML = $('[class*="responsibilities"] li, [data-section*="responsibilities"] li')
            .toArray()
            .map(el => $(el).text().trim());

        const fromFields = Array.isArray(details.responsibilities)
            ? details.responsibilities
            : (details.responsibilities?.toString().split('\n') || []);

        return [...new Set([...fromHTML, ...fromFields])]
            .filter((item): item is string => Boolean(item));
    }

    parseQualifications($: CheerioAPI, details: BreezyJobResponse): string[] {
        const fromHTML = $('[class*="qualifications"] li, [data-section*="qualifications"] li')
            .toArray()
            .map(el => $(el).text().trim());

        const fromFields = Array.isArray(details.qualifications)
            ? details.qualifications
            : (details.qualifications?.toString().split('\n') || []);

        return [...new Set([...fromHTML, ...fromFields])]
            .filter((item): item is string => Boolean(item));
    }

    parseBenefits($: CheerioAPI, details: BreezyJobResponse): string[] {
        const fromHTML = $('[class*="benefits"] li, [data-section*="benefits"] li')
            .toArray()
            .map(el => $(el).text().trim());

        const fromFields = Array.isArray(details.benefits)
            ? details.benefits
            : (details.benefits?.toString().split('\n') || []);

        return [...new Set([...fromHTML, ...fromFields])]
            .filter((item): item is string => Boolean(item));
    }

    private cleanText(text: string): string {
        return text
            ?.replace(/[\n\r\t]+/g, ' ')
            .replace(/\s+/g, ' ')
            .trim() || '';
    }

    private parseLocation(location?: BreezyJobResponse['location']): string {
        if (!location) return 'Remote';
        const parts = [location.city, location.state, location.country].filter(Boolean);
        return parts.join(', ');
    }
}