# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /usr/src/app

# Install dependencies needed for Prisma
RUN apk add --no-cache openssl libc6-compat

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Stage 2: Run
FROM node:20-alpine AS runner
WORKDIR /usr/src/app

# Install runtime dependencies for Prisma
RUN apk add --no-cache openssl libc6-compat

ENV NODE_ENV=production

COPY package*.json ./
COPY prisma ./prisma
RUN npm ci --only=production

COPY --from=builder /usr/src/app/dist ./dist

EXPOSE 3000
CMD ["node", "dist/main.js"]
