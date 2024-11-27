export interface ScraperConfig {
    enabled: boolean;
    apiKey?: string;
    username?: string;
    password?: string;
    companyIds?: string[];
    boardIds?: string[];
    domains?: string[];
}

export interface ScrapersConfig {
    [key: string]: ScraperConfig;
}

const config: ScrapersConfig = {
    greenhouse: {
        enabled: true,
        apiKey: process.env.GREENHOUSE_API_KEY,
        boardIds: process.env.GREENHOUSE_BOARD_IDS?.split(',') || []
    },
    lever: {
        enabled: true,
        apiKey: process.env.LEVER_API_KEY,
        companyIds: process.env.LEVER_COMPANY_IDS?.split(',') || []
    },
    workable: {
        enabled: false,
        apiKey: process.env.WORKABLE_API_KEY
    },
    breezyhr: {
        enabled: false,
        apiKey: process.env.BREEZYHR_API_KEY
    },
    smartrecruiters: {
        enabled: false,
        apiKey: process.env.SMARTRECRUITERS_API_KEY
    },
    ashby: {
        enabled: false,
        apiKey: process.env.ASHBY_API_KEY
    },
    bamboohr: {
        enabled: false,
        apiKey: process.env.BAMBOOHR_API_KEY,
        domains: process.env.BAMBOOHR_DOMAINS?.split(',') || []
    },
    workday: {
        enabled: false,
        apiKey: process.env.WORKDAY_API_TOKEN
    },
    jazzhr: {
        enabled: false,
        apiKey: process.env.JAZZHR_API_KEY
    },
    jobvite: {
        enabled: false,
        apiKey: process.env.JOBVITE_API_TOKEN
    },
    peoplesoft: {
        enabled: false,
        username: process.env.PEOPLESOFT_USERNAME,
        password: process.env.PEOPLESOFT_PASSWORD
    },
    'oracle-recruiting': {
        enabled: false,
        username: process.env.ORACLE_USERNAME,
        password: process.env.ORACLE_PASSWORD
    },
    adp: {
        enabled: false,
        apiKey: process.env.ADP_API_TOKEN
    },
    taleo: {
        enabled: false,
        apiKey: process.env.TALEO_API_TOKEN
    },
    recruitee: {
        enabled: false,
        apiKey: process.env.RECRUITEE_API_TOKEN
    },
    pinpoint: {
        enabled: false,
        apiKey: process.env.PINPOINT_API_KEY
    },
    cornerstone: {
        enabled: false,
        apiKey: process.env.CORNERSTONE_API_TOKEN
    },
    'icims-enterprise': {
        enabled: false,
        apiKey: process.env.ICIMS_ENTERPRISE_API_TOKEN
    }
};

export function getEnabledScrapers(): string[] {
    return Object.entries(config)
        .filter(([_, cfg]) => cfg.enabled)
        .map(([key]) => key);
}

export function getScraperConfig(source: string): ScraperConfig {
    const cfg = config[source];
    if (!cfg) {
        throw new Error(`No configuration found for scraper: ${source}`);
    }
    return cfg;
}

export default config;
