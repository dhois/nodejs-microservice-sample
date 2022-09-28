# syntax=docker/dockerfile:1

FROM node:16.16-alpine
ENV NODE_ENV=development
WORKDIR /var/www/order-service
COPY ["./order-service/package.json", "./order-service/package-lock.json*", "./"]
COPY ["./core-lib", "../core-lib"]
RUN npm install ../core-lib --install-links
COPY ["./order-service/index.js", "index.js"]
COPY ["./order-service/tracing.js", "tracing.js"]
COPY ["./order-service/src", "./src"]
CMD ["node", "--require", "./tracing.js", "./index.js"]
