# Use Node.js LTS version
FROM node:18-alpine

# Install dependencies for Puppeteer
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    freetype-dev \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    nodejs \
    yarn

# Create app directory
WORKDIR /usr/src/app

# Install PM2 globally
RUN npm install pm2 -g

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./
COPY ecosystem.config.js ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY src/ ./src/
COPY .env.production ./.env

# Build TypeScript code
RUN npm run build

# Expose port
EXPOSE 3001

# Set Chrome executable path for Puppeteer
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

# Use PM2 to run the application
CMD ["pm2-runtime", "ecosystem.config.js", "--env", "production"]
