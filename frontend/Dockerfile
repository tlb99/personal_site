# ── Stage 1: Build Angular ──────────────────────────────────────────────────
FROM node:20-slim AS builder

WORKDIR /app

COPY package.json ./
RUN npm install --no-audit

COPY . .
RUN npm run build

# ── Stage 2: Serve with Nginx ────────────────────────────────────────────────
FROM nginx:1.25-alpine

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built Angular files
COPY --from=builder /app/dist/personal-site/browser /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
