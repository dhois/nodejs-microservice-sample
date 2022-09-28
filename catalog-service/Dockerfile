# syntax=docker/dockerfile:1

FROM node:16.16-alpine
ENV NODE_ENV=development
WORKDIR /var/www/catalog-service
COPY ["./catalog-service/package.json", "./catalog-service/package-lock.json*", "./"]
COPY ["./core-lib", "../core-lib"]
RUN npm install ../core-lib --install-links
COPY ["./catalog-service/index.js", "index.js"]
COPY ["./catalog-service/tracing.js", "tracing.js"]
COPY ["./catalog-service/src", "./src"]
CMD ["node", "--require", "./tracing.js", "./index.js"]
