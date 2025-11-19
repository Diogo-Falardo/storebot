FROM node:20-alpine

# Set work dir
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Next.js dev server port
EXPOSE 3000

# Set env vars for Next.js
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

# Start dev server
CMD ["npm", "run", "dev"]
