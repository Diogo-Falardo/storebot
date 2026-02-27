# ────────────────────────────────────────────────
# Stage 1: Build
# ────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Install all dependencies (needed for build)
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Build TypeScript → outputs to dist/
RUN npm run build

# ────────────────────────────────────────────────
# Stage 2: Production runtime
# ────────────────────────────────────────────────
FROM node:20-alpine

WORKDIR /app

# Copy package files and install ONLY production dependencies
COPY --from=builder /app/package*.json ./
RUN npm ci --only=production --ignore-scripts --no-audit --prefer-offline

# Copy compiled output
COPY --from=builder /app/dist ./dist

# Port (app uses 2109)
ENV PORT=2109
EXPOSE ${PORT}

# Production start command
CMD ["node", "dist/index.js"]