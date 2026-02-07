FROM node:20-alpine

WORKDIR /app

# Install only production deps (none right now), but keep layer for future use
COPY package*.json ./
RUN npm install --omit=dev

# Copy source
COPY src ./src

# Default command: run CLI in the container
ENTRYPOINT ["node", "/app/src/cli.js"]
