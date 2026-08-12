# Dev ve prod ayni Dockerfile'dan cikar; hangi asamanin kullanilacagini compose
# `target` ile secer: docker-compose.yml -> dev, docker-compose.prod.yml -> prod.
# Hedef verilmezse Docker son asamayi (prod) kurar.

FROM node:22-alpine AS dev
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

# Vite ortam degiskenlerini derleme aninda pakete gomer. Bu yuzden VITE_API_URL
# calisma zamani environment'i degil, build arg'i olarak gelmek zorunda --
# statik dosyalar uretildikten sonra degistirilemez.
FROM dev AS build
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

FROM nginx:1.27-alpine AS prod
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
