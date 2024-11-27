FROM node:latest AS build

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM node:latest
WORKDIR /usr/src/app
COPY --from=build /usr/src/app ./

EXPOSE 80

ENV PORT=80

CMD ["npm", "start"]
