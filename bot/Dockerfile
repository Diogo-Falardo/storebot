# ────────────────────────────────────────────────
# Stage 1: Build
# ────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# ────────────────────────────────────────────────
# Stage 2: Production runtime
# ────────────────────────────────────────────────
FROM node:20-alpine

WORKDIR /app

# Only production dependencies
COPY --from=builder /app/package*.json ./
RUN npm ci --only=production --ignore-scripts --no-audit --prefer-offline

# Copy compiled output
COPY --from=builder /app/dist ./dist

# No EXPOSE needed if bot doesn't listen on any port 


# Production start command
CMD ["node", "dist/bot.js"]