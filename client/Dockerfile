FROM bitnami/node:12.9.1

WORKDIR /app

COPY package*.json /app/

RUN npm install --unsafe-perm=true

RUN apt-get update && apt-get install -y libatk1.0-0 libnss3 libasound2 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates \
  && rm -rf /var/lib/apt/lists/*

RUN  apt-get update && apt-get install -y gconf-service libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 fonts-liberation libappindicator1 lsb-release xdg-utils wget \
  && rm -rf /var/lib/apt/lists/*

COPY . /app

ENTRYPOINT ["npm", "run", "start"]
