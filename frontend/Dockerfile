FROM node:24-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

FROM node:24-alpine

RUN npm install -g serve

WORKDIR /app

COPY --from=builder /app/dist ./build

EXPOSE 5173

CMD ["serve", "-s", "build", "-l", "8080"]