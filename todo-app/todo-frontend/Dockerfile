# The first FROM is now a stage called build-stage
FROM node:16 AS build-stage

WORKDIR /usr/src/app

COPY package*.json ./

# Change npm ci to npm install since we are going to be in development mode
RUN npm ci

COPY . .

RUN CI=true npm test

RUN npm run build

ENV REACT_APP_BACKEND_URL=http://localhost:3001

# This is a new stage, everything before this is gone, except the files we want to COPY
FROM nginx:1.20.1

# COPY the directory build from build-stage to /usr/share/nginx/html
# The target location here was found from the docker hub page
COPY --from=build-stage /usr/src/app/build /usr/share/nginx/html