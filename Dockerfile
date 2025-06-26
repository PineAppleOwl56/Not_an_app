FROM node:lts-alpine3.21
WORKDIR /DEVOPS
COPY package*json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["node", "index.js"]
