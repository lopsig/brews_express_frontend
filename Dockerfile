# syntax=docker/dockerfile:1
FROM node:20-alpine AS build
WORKDIR /app

# Install system dependencies
RUN apk add --no-cache libc6-compat python3 make g++

# Set memory limit
ENV NODE_OPTIONS=--max-old-space-size=4096

# Copy package files
COPY package.json yarn.lock* ./

# Debug: Show package.json content
RUN echo "=== PACKAGE.JSON CONTENT ===" && \
    cat package.json

# Install dependencies
RUN yarn install --frozen-lockfile --network-timeout 300000

# Copy source code
COPY . .

# Debug: Show file structure
RUN echo "=== FILE STRUCTURE ===" && \
    find . -maxdepth 2 -type f -name "*.js" -o -name "*.jsx" -o -name "*.json" -o -name "*.html" | head -20

# Debug: Check if vite is installed
RUN echo "=== CHECKING VITE INSTALLATION ===" && \
    yarn list vite && \
    which vite || echo "vite command not found" && \
    yarn vite --version || echo "vite not accessible via yarn"

# Debug: Check scripts
RUN echo "=== AVAILABLE SCRIPTS ===" && \
    yarn run

# Try build with detailed error output
RUN echo "=== ATTEMPTING BUILD ===" && \
    yarn build --verbose 2>&1 | tee build-output.log || \
    (echo "=== BUILD FAILED - ERROR LOG ===" && \
     cat build-output.log && \
     echo "=== NODE MODULES CHECK ===" && \
     ls -la node_modules/.bin/ | grep vite && \
     echo "=== MEMORY INFO ===" && \
     free -h && \
     exit 1)

# Check build output
RUN echo "=== BUILD SUCCESS - CHECKING OUTPUT ===" && \
    ls -la dist/

# Production stage
FROM nginx:alpine
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80