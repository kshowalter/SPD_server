FROM node:8

WORKDIR /srv
RUN chown node:node /srv

RUN apt-get update && apt-get install -y \
  libaio1 \
  git \
  pdftk

COPY docker_install/instantclient_12_1 /opt/oracle/instantclient/
COPY docker_install/phantomjs /usr/local/bin/phantomjs

# env setup
ENV LD_LIBRARY_PATH=/opt/oracle/instantclient
ENV OCI_LIB_DIR=/opt/oracle/instantclient
ENV OCI_INC_DIR=/opt/oracle/instantclient/sdk/include
ENV port=3300
ENV NPM_CONFIG_PREFIX=/home/node/.npm-global
# optionally if you want to run npm global bin without specifying path
ENV PATH=$PATH:/home/node/.npm-global/bin

RUN npm install --global pm2

USER node

COPY package*.json /srv/
RUN cd /srv && npm install

COPY . /srv/
#CMD ["node", "app/server.js"]

EXPOSE 3333
CMD ["npm", "run", "serve_dev"]
