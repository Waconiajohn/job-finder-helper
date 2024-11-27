# Job Finder Helper

A comprehensive job search application that aggregates job postings from multiple Applicant Tracking Systems (ATS).

## Features

- Supports multiple ATS platforms:
  - Greenhouse
  - Lever
  - Workable
  - BreezyHR
  - SmartRecruiters
  - Ashby
  - BambooHR
  - Workday
  - JazzHR
  - Jobvite
  - PeopleSoft
  - Oracle Recruiting
  - ADP
  - Taleo
  - Recruitee
  - Pinpoint
  - Cornerstone
  - iCIMS Enterprise

- Advanced search capabilities:
  - Keyword search
  - Location filtering
  - Remote work options
  - Date range filtering
  - Platform-specific filtering

- Job management features:
  - Save interesting positions
  - Track application status
  - Filter out rejected positions

## Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/job-finder-helper.git
   cd job-finder-helper
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   - Copy `.env.example` to `.env`
   - Add your API keys and configuration for the ATS platforms you want to use
   ```bash
   cp .env.example .env
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Environment Variables

Configure the following environment variables in your `.env` file:

### Server Configuration
- `PORT`: Server port (default: 3001)
- `NODE_ENV`: Environment (development/production)

### ATS Platform Configuration
Each ATS platform requires specific configuration:

#### Greenhouse
- `GREENHOUSE_API_KEY`: Your Greenhouse API key
- `GREENHOUSE_BOARD_IDS`: Comma-separated list of board IDs

#### Lever
- `LEVER_API_KEY`: Your Lever API key
- `LEVER_COMPANY_IDS`: Comma-separated list of company IDs

(See .env file for all available configuration options)

## API Endpoints

### Search Jobs
```http
POST /api/search-jobs
```

Request body:
```json
{
  "queries": ["software engineer", "frontend developer"],
  "platforms": ["greenhouse", "lever"],
  "dateRange": "7",
  "workTypes": ["remote", "hybrid"]
}
```

### Health Check
```http
GET /api/health
```

## Development

1. Start the development server:
   ```bash
   npm run dev
   ```

2. The server will be available at `http://localhost:3001`

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
