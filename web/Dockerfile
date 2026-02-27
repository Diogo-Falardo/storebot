# ARG to bust cache – change the number (or date) when you want to force full rebuild
ARG CACHE_BUST=2026-02-27-v2

# ────────────────────────────────────────────────
# Stage 1: Build the application
# ────────────────────────────────────────────────
FROM node:22-alpine AS builder

WORKDIR /app

# Install ALL dependencies needed for build
COPY package*.json ./
RUN npm ci --prefer-offline

# Copy source code
COPY . .

# Build (vite + nitro)
RUN npm run build

# ── Debug: show exactly what the build produced ──
RUN echo "=== Build artifacts after npm run build ===" && \
    ls -la . && \
    echo "=== Looking for .output ===" && \
    (ls -la .output 2>/dev/null || echo ".output NOT FOUND!") && \
    echo "=== Looking for .output/server ===" && \
    (ls -la .output/server 2>/dev/null || echo "server folder NOT FOUND!") && \
    echo "=== Looking for index.mjs ===" && \
    (find .output -name index.mjs || echo "index.mjs NOT FOUND!") || true

# ────────────────────────────────────────────────
# Stage 2: Production runtime (small & optimized)
# ────────────────────────────────────────────────
FROM node:22-alpine

WORKDIR /app

# Copy package files first → better layer caching
COPY --from=builder /app/package*.json ./

# Install ONLY production dependencies
RUN npm ci --omit=dev --ignore-scripts --no-audit --prefer-offline

# Copy the built artifacts (the important part)
COPY --from=builder /app/.output ./.output

# ── Debug in final image (optional – remove later if not needed) ──
RUN echo "=== Final image contents ===" && \
    ls -la .output 2>/dev/null || echo ".output missing in final image!"

# Railway uses $PORT environment variable – respect it
ENV PORT=3000
EXPOSE ${PORT}

# Start the Nitro server
CMD ["sh", "-c", "node .output/server/index.mjs --port ${PORT}"]

# Optional: Healthcheck so Railway knows when the app is ready
HEALTHCHECK --interval=10s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:${PORT}/ || exit 1