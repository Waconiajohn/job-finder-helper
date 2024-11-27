# Sharing Guide for Job Finder Helper

## Before Sharing

1. **Remove Sensitive Information**
   - Delete or sanitize `.env` and `.env.production` files
   - Create `.env.example` with placeholder values
   - Remove any hardcoded API keys or credentials
   - Check configuration files for sensitive data

2. **Update Documentation**
   - Ensure README.md is complete and up-to-date
   - Include setup instructions
   - Document API endpoints
   - List prerequisites and dependencies

3. **Add License**
   - Choose appropriate license (e.g., MIT, Apache)
   - Add LICENSE file
   - Update package.json with license information

## Checklist Before Pushing to Public Repository

- [ ] Remove all `.env` files except `.env.example`
- [ ] Remove any API keys and credentials
- [ ] Remove any internal URLs or endpoints
- [ ] Remove any internal documentation
- [ ] Remove any test data with sensitive information
- [ ] Update package.json with public information
- [ ] Add proper LICENSE file
- [ ] Update README.md for public consumption
- [ ] Remove any internal deployment configurations
- [ ] Remove any internal team information

## Files to Create/Update

1. `.env.example`:
   ```
   # Server Configuration
   PORT=3001
   NODE_ENV=development

   # Security
   ALLOWED_ORIGINS=http://localhost:3000
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100

   # Greenhouse Configuration
   GREENHOUSE_API_KEY=your_greenhouse_api_key
   GREENHOUSE_BOARD_IDS=your_board_ids

   # Lever Configuration
   LEVER_API_KEY=your_lever_api_key
   LEVER_COMPANY_IDS=your_company_ids
   ```

2. `.gitignore`:
   ```
   # Environment
   .env
   .env.*
   !.env.example

   # Dependencies
   node_modules/
   
   # Build
   dist/
   build/
   
   # Logs
   logs/
   *.log
   
   # IDE
   .idea/
   .vscode/
   *.swp
   
   # OS
   .DS_Store
   Thumbs.db
   ```

3. Update README.md with:
   - Project description
   - Setup instructions
   - API documentation
   - Contributing guidelines
   - License information

## Recommended Sharing Platforms

1. **GitHub**
   - Create new public repository
   - Add proper .gitignore
   - Add GitHub Actions for CI/CD
   - Enable security features

2. **NPM**
   - If sharing as package
   - Update package.json
   - Add proper npmignore

## Security Considerations

1. **API Keys**
   - Never commit real API keys
   - Use environment variables
   - Document required API permissions

2. **Rate Limiting**
   - Document rate limit configurations
   - Explain API quotas

3. **Dependencies**
   - Keep dependencies updated
   - Document version requirements
   - Use package-lock.json

## Legal Considerations

1. **License**
   - Choose appropriate license
   - Add license file
   - Update package.json

2. **Attribution**
   - Credit third-party code
   - Document external APIs
   - List all licenses

## Support

1. **Documentation**
   - API documentation
   - Setup guide
   - Troubleshooting guide

2. **Contributing**
   - Contributing guidelines
   - Code of conduct
   - Pull request template
   - Issue templates
