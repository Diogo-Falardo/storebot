# tanstack start app docker production file

FROM node:22-alpine AS builder

WORKDIR /app
COPY package*.json ./

# tells docker to create a persistent cach at /root/.npm 
# RUN --mount=type=cache,target=/root/.npm npm ci --prefer-offline
## to work on railway -> dont suport cache
RUN npm ci --prefer-offline

# create user and group
RUN addgroup -g 1001 appgroup && adduser -D -u 1001 -G appgroup appuser

COPY . .

RUN npm run build

# change ownership
RUN chown -R appuser:appgroup /app

# swith to non-root user
USER appuser

RUN echo "=== Build output ===" && ls -la .output

FROM node:22-alpine AS runner

WORKDIR /app

# copy only production dependencies and build output
COPY --from=builder /app/.output ./.output

ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0

EXPOSE 3000
HEALTHCHECK --interval=10s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1

CMD ["node", ".output/server/index.mjs", "--port", "3000"]