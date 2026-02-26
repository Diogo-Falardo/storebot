FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Keep container alive + hot reload
CMD ["npm", "run", "dev"]

EXPOSE 2109