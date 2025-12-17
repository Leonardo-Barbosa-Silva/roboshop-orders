FROM node:22-alpine3.21 AS builder
WORKDIR /src/app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

FROM node:22-alpine3.21 AS runner
WORKDIR /src/app

COPY --from=builder /src/app/package*.json ./

RUN npm ci --omit=dev && npm cache clean --force

COPY --from=builder /src/app/dist ./dist

USER node

EXPOSE 3333

CMD ["node", "dist/server.js"]