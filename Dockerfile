FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npx prisma generate

EXPOSE 3000

CMD ["npm", "run", "start"]

# para buil img:
    # -t: tag de la img
    # .: busca el Dockerfile en la carpeta actual
# docker build -t alelex10/backend-crm .
# para listar las img
# docker images
# para correr la img con comando tradicional
# docker run -d -p 3001:3000 alelex10/backend-crm
# o con comando estructurado y moderno
# docker container run -d -p 3001:3000 alelex10/backend-crm