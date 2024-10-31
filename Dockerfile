# Usa uma imagem base do Node.js
FROM node:18

# Define o diretório de trabalho no container
WORKDIR /app

# Copia os arquivos de dependências
COPY package.json package-lock.json ./

# Instala as dependências do projeto
RUN npm install

# Copia o restante dos arquivos da aplicação para o container
COPY . .

# Expõe a porta 3000 que será usada pelo Vite
EXPOSE 3000

# Comando para iniciar o Vite em modo desenvolvimento
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
