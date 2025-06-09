FROM node:22.16.0
WORKDIR /var/www
COPY ./server ./server
COPY ./package.json ./package.json
COPY ./package-lock.json ./package-lock.json
CMD npm ci && node server