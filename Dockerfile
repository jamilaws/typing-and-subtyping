# Stage 1

FROM node:16 as build-step

RUN mkdir -p /app

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . /app

RUN npm run build

# Stage 2

FROM nginx:latest

COPY --from=build-step /app/dist/typing-tutor /usr/share/nginx/html

EXPOSE 80