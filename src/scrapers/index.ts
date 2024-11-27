import { ATSScraperBase } from '../core/ATSScraperBase';
import { GreenhouseScraper } from './GreenhouseScraper';
import { LeverScraper } from './LeverScraper';

const scrapers: { [key: string]: new () => ATSScraperBase } = {
    'greenhouse': GreenhouseScraper,
    'lever': LeverScraper
};

export function createScraper(source: string): ATSScraperBase {
    const ScraperClass = scrapers[source.toLowerCase()];
    if (!ScraperClass) {
        throw new Error(`Unsupported ATS source: ${source}`);
    }
    return new ScraperClass();
}

export type { ATSScraperBase };
export type { SearchParams, JobDetail } from '../core/ATSScraperBase';
