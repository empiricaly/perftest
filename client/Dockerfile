FROM bitnami/node:12.9.1

WORKDIR /app

COPY package*.json /app/

RUN npm install --unsafe-perm=true

COPY . /app

ENTRYPOINT ["npm", "run", "start"]
