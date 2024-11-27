import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { z } from 'zod';
import { createScraper } from '../scrapers';
import { getEnabledScrapers, getScraperConfig } from '../config/scrapers';
import { SearchParams } from '../core/ATSScraperBase';

// Validate required environment variables
const requiredEnvVars = ['NODE_ENV'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);
if (missingEnvVars.length > 0) {
    console.error('Missing required environment variables:', missingEnvVars.join(', '));
    process.exit(1);
}

const app = express();
const defaultPort = 3001;
const port = parseInt(process.env.PORT || defaultPort.toString(), 10);

// Middleware
app.use(cors());
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// Request validation schemas
const searchRequestSchema = z.object({
    queries: z.union([z.string(), z.array(z.string())]),
    platforms: z.array(z.string()).optional(),
    dateRange: z.string().optional(),
    workTypes: z.array(z.string()).optional()
});

type SearchRequest = z.infer<typeof searchRequestSchema>;

// Initialize scrapers based on configuration
const initializeScrapers = () => {
    const enabledScrapers = getEnabledScrapers();
    console.log('Initializing scrapers:', enabledScrapers);
    
    return enabledScrapers.map(platform => {
        try {
            const config = getScraperConfig(platform);
            if (!config.apiKey && !config.username) {
                console.warn(`Missing credentials for ${platform}`);
                return null;
            }
            return {
                platform,
                scraper: createScraper(platform)
            };
        } catch (error) {
            console.error(`Failed to initialize ${platform} scraper:`, error);
            return null;
        }
    }).filter(Boolean);
};

const scrapers = initializeScrapers();

// Error handling middleware
const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction): void => {
    console.error('Server error:', err);
    
    // Handle specific error types
    if (err instanceof z.ZodError) {
        res.status(400).json({
            success: false,
            error: 'Invalid request data',
            details: err.errors
        });
        return;
    }

    // Default error response
    res.status(500).json({
        success: false,
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
};

app.use(errorHandler);

// Job search endpoint
app.post('/api/search-jobs', async (req: Request<{}, {}, SearchRequest>, res: Response, next: NextFunction) => {
    try {
        // Validate request
        const validatedData = searchRequestSchema.parse(req.body);
        const { queries, platforms = [], dateRange, workTypes = [] } = validatedData;

        // Convert frontend search parameters to scraper SearchParams
        const searchParams: SearchParams = {
            keywords: Array.isArray(queries) ? queries[0] : queries,
            postedAfter: dateRange ? new Date(Date.now() - (parseInt(dateRange) * 24 * 60 * 60 * 1000)) : undefined,
            remote: workTypes.includes('remote')
        };

        // Filter scrapers based on selected platforms
        const activePlatforms = platforms.length > 0
            ? scrapers.filter(s => s && platforms.includes(s.platform))
            : scrapers;

        if (activePlatforms.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'No active scrapers available for the selected platforms'
            });
        }

        // Run searches in parallel across all selected platforms
        const searchPromises = activePlatforms.map(async (scraperInfo) => {
            if (!scraperInfo) return [];
            
            const { platform, scraper } = scraperInfo;
            try {
                console.log(`Searching ${platform}...`);
                const jobs = await scraper.search(searchParams);
                console.log(`Found ${jobs.length} jobs from ${platform}`);
                return jobs.map(job => ({
                    id: job.sourceId,
                    title: job.title,
                    company: job.company,
                    description: job.description,
                    link: job.url,
                    location: job.location,
                    salary: job.salary ? `${job.salary.min}-${job.salary.max} ${job.salary.currency}/${job.salary.type}` : undefined,
                    postedDate: job.postedDate?.toISOString(),
                    platform,
                    requirements: job.requirements,
                    responsibilities: job.responsibilities,
                    qualifications: job.qualifications,
                    benefits: job.benefits,
                    remote: job.remote
                }));
            } catch (error) {
                console.error(`Error with ${platform} scraper:`, error);
                return [];
            }
        });

        // Wait for all scraper results
        const results = await Promise.all(searchPromises);
        
        // Flatten and sort results by posted date
        const allJobs = results
            .flat()
            .sort((a, b) => {
                if (!a.postedDate || !b.postedDate) return 0;
                return new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime();
            });

        res.json({ 
            success: true, 
            results: allJobs,
            stats: {
                total: allJobs.length,
                byPlatform: activePlatforms.reduce((acc, info) => {
                    if (info) {
                        acc[info.platform] = results.flat().filter(job => job.platform === info.platform).length;
                    }
                    return acc;
                }, {} as Record<string, number>)
            }
        });
    } catch (error) {
        next(error);
    }
});

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
    res.json({ 
        status: 'healthy',
        environment: process.env.NODE_ENV,
        scrapers: scrapers
            .filter(Boolean)
            .map(info => ({
                platform: info?.platform,
                status: 'ready'
            }))
    });
});

// Start server
let server: any = null;

function startServer(retries = 3) {
    const tryPort = port + (3 - retries);
    
    try {
        server = app.listen(tryPort, () => {
            console.log(`Server running in ${process.env.NODE_ENV} mode on port ${tryPort}`);
            console.log(`Available scrapers: ${scrapers.map(s => s?.platform).join(', ')}`);
        });

        server.on('error', (error: any) => {
            if (error.code === 'EADDRINUSE' && retries > 0) {
                console.log(`Port ${tryPort} in use, trying port ${port + (4 - retries)}`);
                startServer(retries - 1);
            } else {
                console.error('Server error:', error);
                process.exit(1);
            }
        });
    } catch (error) {
        if (retries > 0) {
            console.log(`Failed to start server on port ${tryPort}, trying again...`);
            startServer(retries - 1);
        } else {
            console.error('Failed to start server:', error);
            process.exit(1);
        }
    }
}

startServer();

// Handle graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    if (server) {
        server.close(() => {
            console.log('HTTP server closed');
            process.exit(0);
        });
    } else {
        process.exit(0);
    }
});
