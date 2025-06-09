FROM node:22.16.0
WORKDIR /var/www
COPY ./server ./server
CMD node server