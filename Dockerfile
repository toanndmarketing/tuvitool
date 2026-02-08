FROM node:20-alpine

WORKDIR /app

# Install build tools for better-sqlite3
RUN apk add --no-cache python3 make g++

# Copy package files
COPY server/package.json ./server/
RUN cd server && npm install --production

# Copy application
COPY server/ ./server/
COPY public/ ./public/

# Create data directory
RUN mkdir -p /app/data

EXPOSE 8950

CMD ["node", "server/server.js"]
