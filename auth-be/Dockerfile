FROM node:16-alpine

WORKDIR /app

COPY package* ./
COPY ./prisma .

RUN npm install
RUN npx prisma generate

COPY . .

RUN npm run build

EXPOSE 8000

CMD ["node", "dist/index.js"]
