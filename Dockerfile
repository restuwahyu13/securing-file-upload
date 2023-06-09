######################
# START STAGE 1
######################
FROM node:16.15.0-alpine as start
USER ${USER}
COPY ./package.*json ./
COPY . ./

#######################
# FINAL STAGE 2
#######################
FROM start as final
COPY --from=start . ./
RUN rm -rf node_modules \
  && npm cache clean -f \
  && npm config delete proxy \
  && npm config delete https-proxy \
  && npm config set fetch-retry-mintimeout 6000000 \
  && npm config set fetch-retry-maxtimeout 12000000 \
  && npm config set fetch-timeout 30000000 \
  && npm i --loglevel verbose \
  && npm run build
EXPOSE 3000
CMD npm run start