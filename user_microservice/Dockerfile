FROM node:18-alpine3.20

WORKDIR /app

COPY package*.json .

RUN npm install

COPY . .

RUN apk add --no-cache bash && \
    (sleep 20 && npm run start:migrate) && \
    npm run start:generate

CMD ["npm","run","start"]