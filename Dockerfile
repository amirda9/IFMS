FROM node:18-alpine as builder

RUN apk add --no-cache tzdata
ENV TZ Asia/Tehran

RUN mkdir app
COPY . ./app
WORKDIR /app

RUN npm config set strict-ssl false
RUN npm i
RUN npm run build

EXPOSE 80

FROM nginx
COPY ./default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /var/www/site
