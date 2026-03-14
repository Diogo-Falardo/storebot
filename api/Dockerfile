# ────────────────────────────────────────────────
# Stage 1: Build
# ────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Install ALL dependencies (dev + prod) needed for tsc/build
COPY package*.json ./
RUN npm ci --prefer-offline

# Copy source code (ts files, tsconfig.json, etc.)
COPY . .

# Run the build → should create ./dist/ according to your tsconfig.json
RUN npm run build

# ── Very important debug step ──
# This prints what actually exists after build → helps us see if dist/ was created
RUN echo "=== DEBUG: Files after npm run build ===" && \
    ls -la && \
    echo "=== DEBUG: Contents of dist/ (if exists) ===" && \
    (ls -la dist 2>/dev/null || echo "dist/ NOT FOUND!") && \
    echo "=== DEBUG: Looking for index.js ===" && \
    (find . -name index.js 2>/dev/null || echo "No index.js found!") || true

# ────────────────────────────────────────────────
# Stage 2: Lightweight production image
# ────────────────────────────────────────────────
FROM node:20-alpine

WORKDIR /app

# Copy only package files first → better layer caching for future builds
COPY --from=builder /app/package*.json ./

# Install ONLY production dependencies (faster & smaller image)
RUN npm ci --only=production --ignore-scripts --no-audit --prefer-offline

# Copy the compiled output (this is what failed before)
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/drizzle ./drizzle

# Optional final debug (can be removed later)
RUN echo "=== DEBUG: Final runtime - dist/ contents ===" && \
    ls -la dist 2>/dev/null || echo "dist/ missing in runtime stage!"

# Railway dynamically assigns PORT via environment variable
ENV PORT=2109
ENV NODE_ENV=production
EXPOSE ${PORT}

# Start the compiled server
# Uses $PORT if set by Railway, otherwise falls back to 2109
CMD ["sh", "-c", "node dist/index.js --port ${PORT:-2109}"]

# Optional: Healthcheck (helps Railway know when your API is ready)
# Assumes your API responds to /health or root path – adjust if needed
HEALTHCHECK --interval=10s --timeout=5s --start-period=5s --retries=5 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:${PORT}/ || exit 1
