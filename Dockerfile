# Build stage
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Install dependencies first (better caching)
COPY package*.json ./
RUN npm ci

# Copy rest of the application
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:18-alpine AS runner

WORKDIR /app

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3030

# Copy necessary files from builder
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Set labels for container
LABEL org.opencontainers.image.source="https://github.com/rizo8107/skidyy"
LABEL org.opencontainers.image.description="SKiddy V2 Learning Platform"
LABEL org.opencontainers.image.licenses="MIT"
LABEL org.opencontainers.image.vendor="rizo8107"
LABEL org.opencontainers.image.visibility="public"

# Expose the port
EXPOSE 3030

# Start the application
CMD ["npm", "start"]
