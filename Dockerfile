FROM node:22-alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev --ignore-scripts
COPY server.js admin-security.js ./
COPY www ./www
ENV NODE_ENV=production PORT=8080 TRUST_PROXY=1
USER node
EXPOSE 8080
CMD ["node", "server.js"]
