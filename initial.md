cd DojoManagement

# Cria projeto React + TypeScript com Vite
npm create vite@latest dojo-frontend -- --template react-ts

cd dojo-frontend

# Instala dependências
npm install

# Instala bibliotecas extras
npm install @mui/material @emotion/react @emotion/styled
npm install @mui/icons-material
npm install react-router-dom
npm install @tanstack/react-query
npm install axios
npm install date-fns  # Para formatação de datas

# .env.development
VITE_API_BASE_URL=http://localhost:4566/restapis/<API_ID>/dev/_user_request_
VITE_API_TIMEOUT=10000


# .env.production
VITE_API_BASE_URL=https://api.dojomanagement.com
VITE_API_TIMEOUT=30000