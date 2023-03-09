From node:19.4.0
WORKDIR /dashboard

COPY  package.json .
RUN npm install
COPY . .
CMD ["npm", "start"]