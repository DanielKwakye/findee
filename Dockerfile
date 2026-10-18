# Build image:
# docker buildx build --platform linux/amd64 -t danielkwakye1000/findee:v23 --push .


# -----------------------------
# 1. Dependencies Install Stage
# -----------------------------
FROM node:24-alpine AS deps

WORKDIR /app

# Add compatibility libs for Next.js
RUN apk add --no-cache libc6-compat

# Copy npm manifest and lockfile
COPY package.json package-lock.json ./

# Install dependencies from the npm lockfile
RUN npm ci


# -----------------------------
# 2. Builder Stage
# -----------------------------
FROM node:24-alpine AS builder

WORKDIR /app

# Add compatibility libs for Next.js
RUN apk add --no-cache libc6-compat

# Declare variables used at build stage.
# (eg. envs used during pre-rendering, envs called outside functions)
#ENV NODE_ENV=production # nextjs already defaults the node_env to production

# Copy Next.js config first to bust cache when it changes
COPY next.config.ts ./

# Copy deps
COPY --from=deps /app/node_modules ./node_modules

# Copy app source
COPY . .

# Ensure Next.js build cache directory exists
RUN mkdir -p .next/cache

# Build full Next.js app
ARG DATABASE_URL=mongodb://localhost:27017/findee
ARG NEXT_PUBLIC_TURNSTILE_SITE_KEY=0x4AAAAAAFZdOyFh6GkHLAir
ARG NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyABUSoalZcZVWBVF7y8iOAiPG62aV0MRQg
ARG NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=findmus-a2b4d.firebaseapp.com
ARG NEXT_PUBLIC_FIREBASE_PROJECT_ID=findmus-a2b4d
ARG NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=findmus-a2b4d.firebasestorage.app
ARG NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=482723483117
ARG NEXT_PUBLIC_FIREBASE_APP_ID=1:482723483117:web:0ae78606f0b3cfbfcfabe4
ARG NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-JRZD45BKFR
RUN npm run build

# Remove development dependencies before copying dependencies to the runtime stage
RUN npm prune --omit=dev


# -----------------------------
# 3. Production Runtime Stage
# -----------------------------
FROM node:24-alpine AS runner

WORKDIR /app

# Add compatibility libs for Next.js
RUN apk add --no-cache libc6-compat

# Runtime env variables can be omitted here if supplied during docker run.
ENV NODE_ENV=production
# Disable anonymous usage statistics sent to the Next.js team
ENV NEXT_TELEMETRY_DISABLED=1

# Create lightweight non-root user
# group id = 1001
# user id = 1001
# add user to the group
RUN addgroup -g 3002 findeeGroup && \
    adduser -u 3002 -G findeeGroup -s /bin/sh -D findeeUser

# Copy production files
COPY --from=builder /app/next.config.ts ./next.config.ts
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma/generated ./prisma/generated
COPY --from=builder /app/package*.json ./

# Include the stylesheet loaded from disk when rendering notification emails.
COPY --from=builder /app/src/features/notifications/components/ui/notification-email.module.css ./src/features/notifications/components/ui/notification-email.module.css

# Fix permissions
RUN mkdir -p .next/cache && \
    chown -R findeeUser:findeeGroup /app

USER findeeUser

EXPOSE 3002

CMD ["npm", "run", "start"]
