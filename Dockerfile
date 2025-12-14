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

ENV NODE_ENV=production
ENV PORT=3333

EXPOSE 3333

CMD ["node", "dist/http/server.js"]