# ────────────────────────────────────────────────
# Stage 1: Build the application
# ────────────────────────────────────────────────
FROM node:22-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Build for production
#   → runs tanstack-start build steps
RUN npm run build

# ────────────────────────────────────────────────
# Stage 2: Production image (small & optimized)
# ────────────────────────────────────────────────
FROM node:22-alpine

WORKDIR /app

# Copy only what's needed from builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.output ./.output          # ← common for tanstack-start

# Install only production dependencies
RUN npm ci --omit=dev --ignore-scripts --no-audit

# Expose the port (Railway will use $PORT env var if set)
EXPOSE 3000

# Start the production server
#   Most common options for TanStack Start:
CMD ["node", ".output/server/index.mjs"]

# Alternative commands you can try (pick ONE):
# CMD ["npm", "run", "start"]                     # if you have "start" script
# CMD ["npx", "serve", "-s", "dist", "-l", "3000"] # simple static serve (if no SSR)
# CMD ["npx", "vite", "preview", "--host", "0.0.0.0", "--port", "3000"] # vite preview (not recommended for prod)