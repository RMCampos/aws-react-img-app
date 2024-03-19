# Build static files
# Node Bullseye has npm
FROM node:18.19.0-bullseye-slim AS build

# Build
WORKDIR /app
COPY *.html *.json *.ts ./
COPY ./src ./src
COPY ./public ./public
RUN npm i 
RUN npm run build
RUN rm -rf node_modules

FROM node:18.19.0-bullseye-slim AS deploy
WORKDIR /app
COPY --from=build /app/dist/ .
RUN npm install --global react-inject-env serve && \
  chmod -R g+w .

# User, port and healthcheck
USER 1001
EXPOSE 5173
HEALTHCHECK CMD curl -f http://localhost:5173

CMD react-inject-env set -d . && \
  serve --no-clipboard --single .
