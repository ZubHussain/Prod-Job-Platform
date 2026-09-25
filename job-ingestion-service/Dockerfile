FROM node:22-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev
COPY . .

EXPOSE 5007
CMD ["npm", "start"]