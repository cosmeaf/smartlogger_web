#!/bin/bash

# Função para exibir mensagens de erro e sair
function error_exit {
  echo "$1" 1>&2
  exit 1
}

# Verifica se o Docker está rodando
if ! systemctl is-active --quiet docker; then
  error_exit "Erro: O Docker não está ativo. Inicie o serviço Docker."
else
  echo "Docker está ativo."
fi

# Pega a versão do package.json usando Node.js
VERSION_TAG=$(node -p "require('./package.json').version")
if [ $? -ne 0 ]; then
  error_exit "Erro ao obter versão do package.json"
fi

# Pega a versão do package.json usando o script Node.js getVersion.js
echo "Incrementando versão no package.json..."
node getVersion.js

# Exibe a versão atual sendo usada
echo "Usando versão: $VERSION_TAG"

# Passo 1: Parar e remover o container antigo (se existir)
echo "Parando container existente, se houver..."
docker stop smartlogger 2>/dev/null || echo "Nenhum container ativo para parar."
docker rm smartlogger 2>/dev/null || echo "Nenhum container existente para remover."

# Passo 2: Remover a imagem Docker antiga (se existir)
echo "Removendo imagem Docker antiga, se houver..."
docker rmi smartlogger:$VERSION_TAG 2>/dev/null || echo "Nenhuma imagem antiga encontrada para remover."

# Passo 3: Build da nova imagem Docker
echo "Construindo a nova imagem Docker..."
docker build -t smartlogger:$VERSION_TAG . || error_exit "Erro ao construir a imagem Docker."

# Passo 4: Tag da imagem para o Docker Hub
echo "Tagging imagem Docker..."
docker tag smartlogger:$VERSION_TAG cosmeaf/smartlogger:$VERSION_TAG || error_exit "Erro ao marcar a imagem."

# Passo 5: Push da imagem para o Docker Hub
echo "Enviando imagem para o Docker Hub..."
docker push cosmeaf/smartlogger:$VERSION_TAG || error_exit "Erro ao enviar a imagem para o Docker Hub."

# Passo 6: Rodar o novo container
echo "Iniciando o novo container..."
docker run -d \
  --name smartlogger \
  --hostname smartlogger \
  --network app-network \
  --ip 172.16.0.100 \
  --restart always \
  -p 3000:3000 \
  smartlogger:$VERSION_TAG || error_exit "Erro ao iniciar o container."

# Passo 7: Tag "latest" e Push
echo "Atualizando tag 'latest' e enviando para o Docker Hub..."
docker tag smartlogger:$VERSION_TAG cosmeaf/smartlogger:latest || error_exit "Erro ao marcar como 'latest'."
docker push cosmeaf/smartlogger:latest || error_exit "Erro ao enviar a tag 'latest' para o Docker Hub."

echo "Deploy completo com sucesso! Versão atual: $VERSION_TAG"
