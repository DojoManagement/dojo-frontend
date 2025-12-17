#!/bin/bash

set -e  # Para no primeiro erro

# ========================================
# CONFIGURAÇÕES
# ========================================
ENV=${1:-dev}  # Ambiente (dev, staging, prd)
BUCKET_NAME="dojo-frontend-${ENV}"
REGION="sa-east-1"

echo "========================================="
echo "🚀 Deploy Frontend para S3"
echo "========================================="
echo "📦 Ambiente: $ENV"
echo "🪣 Bucket: $BUCKET_NAME"
echo "🌎 Região: $REGION"
echo "========================================="

# ========================================
# 1. VERIFICAR DEPENDÊNCIAS
# ========================================
echo ""
echo "🔍 Verificando dependências..."

if ! command -v aws &> /dev/null; then
    echo "❌ AWS CLI não encontrado. Instale com: pip install awscli"
    exit 1
fi

if ! command -v node &> /dev/null; then
    echo "❌ Node.js não encontrado. Instale Node.js 18+"
    exit 1
fi

echo "✅ Dependências OK"

# ========================================
# 2. INSTALAR DEPENDÊNCIAS NPM
# ========================================
echo ""
echo "📦 Instalando dependências NPM..."

if [ ! -d "node_modules" ]; then
    npm ci
else
    echo "✅ node_modules já existe, pulando..."
fi

# ========================================
# 3. BUILD DA APLICAÇÃO
# ========================================
echo ""
echo "🏗️  Buildando aplicação (NODE_ENV=production)..."

# Limpar build anterior
rm -rf dist

# Build
NODE_ENV=production npm run build

# Verificar se dist foi criado
if [ ! -d "dist" ]; then
    echo "❌ Erro: pasta dist/ não foi criada!"
    exit 1
fi

echo "✅ Build concluído!"
echo "📊 Tamanho da dist/:"
du -sh dist

# ========================================
# 4. UPLOAD DOS ARQUIVOS
# ========================================
echo ""
echo "📤 Fazendo upload para S3..."

aws s3 sync dist/ "s3://$BUCKET_NAME" \
    --delete \
    --cache-control "public, max-age=31536000" \
    --exclude "index.html" \
    --exclude "*.map"

# index.html com cache curto (para permitir updates rápidos)
aws s3 cp dist/index.html "s3://$BUCKET_NAME/index.html" \
    --cache-control "public, max-age=300, must-revalidate" \
    --content-type "text/html"

echo "✅ Upload concluído!"

# ========================================
# 5. MOSTRAR URL DO SITE
# ========================================
echo ""
echo "========================================="
echo "✅ DEPLOY CONCLUÍDO COM SUCESSO!"
echo "========================================="
echo ""
echo "🌐 URL do site:"
echo "   http://$BUCKET_NAME.s3-website-$REGION.amazonaws.com"
echo ""
echo "📊 Estatísticas:"
aws s3 ls "s3://$BUCKET_NAME" --recursive --human-readable --summarize | tail -2
echo ""
echo "========================================="