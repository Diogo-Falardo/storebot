FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Assuming your "dev" script runs the bot forever (or use nodemon/ts-node-dev)
CMD ["npm", "run", "dev"]