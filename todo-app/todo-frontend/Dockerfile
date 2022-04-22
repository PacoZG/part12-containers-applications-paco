# The first FROM is now a stage called build-stage
FROM node:16

WORKDIR /usr/src/app

COPY . .

RUN npm ci

RUN npm run build

RUN CI=true npm test

ENV REACT_APP_BACKEND_URL=http://localhost:3001

RUN npm install -g serve

CMD ["serve", "build"]
