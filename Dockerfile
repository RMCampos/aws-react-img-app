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

# Deploy container
FROM nginx:alpine

# Copy files and run formatting
COPY --from=build /app/dist/ /usr/share/nginx/html

# User, port and healthcheck
EXPOSE 80
HEALTHCHECK CMD curl -f http://localhost:5173
#USER 1001

CMD ["nginx", "-g", "daemon off;"]