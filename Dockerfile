FROM node:lts-alpine


ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV
RUN npm i npm@latest -g
WORKDIR /app
COPY package*.json  ./
RUN npm install --no-optional && npm cache clean --force
COPY . ./
RUN npm run build

CMD ["npm", "run", "start"]