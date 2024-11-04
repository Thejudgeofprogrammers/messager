FROM node:18-alpine3.20 AS builder

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/
COPY protos ./protos/
RUN npm install && npx prisma generate

COPY . .
RUN npm run build

FROM node:18-alpine3.20

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/protos ./protos  
COPY --from=builder /app/prisma ./prisma

ENV DATABASE_URL="postgresql://admin:admin@postgres_server:5432/telegramm"

CMD ["node", "/app/dist/src/main.js"]
