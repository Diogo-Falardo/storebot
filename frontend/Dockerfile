# Node base image
FROM node:20-alpine

WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

# Copy and install dependencies with npm
COPY frontend/package*.json ./
RUN npm ci

# Copy the rest of the source
COPY frontend/ .

# Build the app (for production)
RUN npm run build || true

EXPOSE 3000

# Default command (for production)
CMD ["npm", "start"]
