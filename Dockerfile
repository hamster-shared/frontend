FROM node:14 as builder

WORKDIR /app

ADD . /app


RUN npm install

RUN npm run build


FROM nginx

RUN rm -rf /usr/share/nginx/html/*

COPY --from=builder /app/dist /usr/share/nginx/html

COPY default.conf /etc/nginx/conf.d/default.conf

COPY ./start.sh /app/

ENTRYPOINT ["/app/start.sh"]

