FROM node:16-alpine

WORKDIR /app

COPY package* ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 8001

CMD ["node", "dist/index.js"]
