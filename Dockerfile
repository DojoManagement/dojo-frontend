FROM node:20-alpine

WORKDIR /app

# Copia package.json e package-lock.json
COPY package*.json ./

# Instala dependências
RUN npm install --legacy-peer-deps

# Copia o código fonte
COPY . .

# Expõe a porta do Vite
EXPOSE 5173

# Comando para rodar em modo dev com hot-reload
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]