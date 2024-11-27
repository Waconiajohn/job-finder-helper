import { Page } from 'puppeteer';

export const setupScraperPage = async (
  page: Page,
  getUserAgent: () => string,
  apiPathMatch: string,
  extraHeaders: Record<string, string> = {}
): Promise<void> => {
  await page.setUserAgent(getUserAgent());
  await page.setRequestInterception(true);

  page.on('request', request => {
    if (request.resourceType() === 'fetch' && request.url().includes(apiPathMatch)) {
      const headers = {
        ...request.headers(),
        'Accept': 'application/json',
        ...extraHeaders
      };
      request.continue({ headers });
    } else if (['image', 'stylesheet', 'font'].includes(request.resourceType())) {
      request.abort();
    } else {
      request.continue();
    }
  });
};