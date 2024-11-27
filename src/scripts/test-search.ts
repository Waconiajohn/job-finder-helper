const dotenv = require('dotenv');
const axios = require('axios');

interface AxiosError {
    response?: {
        status: number;
        data: any;
    };
    message: string;
}

dotenv.config();

const API_URL = 'http://localhost:3001';

async function testJobSearch() {
    try {
        // Test health endpoint
        console.log('\nTesting health endpoint...');
        const healthResponse = await axios.get(`${API_URL}/api/health`);
        console.log('Health check response:', JSON.stringify(healthResponse.data, null, 2));

        // Test job search
        console.log('\nTesting job search...');
        const searchResponse = await axios.post(`${API_URL}/api/search-jobs`, {
            queries: ['software engineer', 'frontend developer'],
            platforms: ['greenhouse', 'lever'],
            dateRange: '7',
            workTypes: ['remote']
        });

        const { results, stats } = searchResponse.data;

        console.log('\nSearch Results Summary:');
        console.log('Total jobs found:', stats.total);
        console.log('Results by platform:', stats.byPlatform);

        if (results.length > 0) {
            console.log('\nSample job posting:');
            console.log(JSON.stringify(results[0], null, 2));
        }

    } catch (error: unknown) {
        if ((error as AxiosError).response) {
            console.error('API Error:', {
                status: (error as AxiosError).response?.status,
                data: (error as AxiosError).response?.data
            });
        } else {
            console.error('Error:', (error as Error).message);
        }
        process.exit(1);
    }
}

// Run the test
console.log('Starting integration test...');
testJobSearch().then(() => {
    console.log('\nTest completed');
    process.exit(0);
}).catch((error: unknown) => {
    console.error('Test failed:', (error as Error).message);
    process.exit(1);
});
