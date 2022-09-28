# syntax=docker/dockerfile:1

FROM node:16.16-alpine
ENV NODE_ENV=development
WORKDIR /var/www/basket-service
COPY ["./basket-service/package.json", "./basket-service/package-lock.json*", "./"]
COPY ["./core-lib", "../core-lib"]
RUN npm install ../core-lib --install-links
COPY ["./basket-service/index.js", "index.js"]
COPY ["./basket-service/tracing.js", "tracing.js"]
COPY ["./basket-service/src", "./src"]
CMD ["node", "--require", "./tracing.js", "./index.js"]
