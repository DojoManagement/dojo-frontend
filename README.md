# Dojo Management - Frontend

Sistema de gerenciamento de academia de artes marciais (dojo) desenvolvido com React, TypeScript e Vite. Esta aplicação frontend se comunica com AWS Lambda functions via LocalStack para gerenciar atletas, turmas, matrículas e presenças.

---

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Arquitetura](#arquitetura)
- [Estrutura de Pastas](#estrutura-de-pastas)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Configuração do Ambiente](#configuração-do-ambiente)
- [Como Executar](#como-executar)
- [Detalhamento dos Componentes](#detalhamento-dos-componentes)
- [Fluxo de Dados](#fluxo-de-dados)
- [API e Endpoints](#api-e-endpoints)
- [Testes](#testes)
- [Deploy](#deploy)

---

## 🎯 Visão Geral

O **Dojo Management Frontend** é uma SPA (Single Page Application) que permite:

- **Gerenciar Atletas**: Cadastro, edição, listagem e exclusão de atletas
- **Gerenciar Turmas**: Controle de turmas por modalidade, nível e horário
- **Gerenciar Matrículas**: Vinculação de atletas às turmas
- **Gerenciar Presenças**: Registro de check-in/check-out de atletas nas aulas
- **Dashboard**: Visualização de métricas e estatísticas do dojo

### Principais Funcionalidades

- ✅ CRUD completo para todas as entidades
- ✅ Validação de formulários com Zod
- ✅ Gestão de estado assíncrono com React Query
- ✅ Interface responsiva com Material-UI
- ✅ Notificações de sucesso/erro com Notistack
- ✅ Roteamento SPA com React Router
- ✅ Integração com backend via proxy Vite → LocalStack

---

## 🏗️ Arquitetura

```
┌─────────────────┐
│   Browser       │
│  (React App)    │
└────────┬────────┘
         │ HTTP Requests (/api/*)
         ▼
┌─────────────────┐
│  Vite Dev Server│
│   (Proxy)       │
└────────┬────────┘
         │ Forwards to localstack:4566
         ▼
┌─────────────────┐
│   LocalStack    │
│  API Gateway    │
└────────┬────────┘
         │ Invokes Lambda
         ▼
┌─────────────────┐
│  Lambda Functions│
│  - Athlete MGMT │
│  - Class MGMT   │
│  - Enrollment   │
│  - Attendance   │
└────────┬────────┘
         │ Uses
         ▼
┌─────────────────┐
│  dojo-commons   │
│  (Repository)   │
└────────┬────────┘
         │ Queries
         ▼
┌─────────────────┐
│    DuckDB       │
│  (Persistent)   │
└─────────────────┘
```

### Camadas da Aplicação

1. **UI Layer** (`src/components/*`): Componentes React com Material-UI
2. **Data Layer** (`src/hooks/*`): Custom hooks com React Query para cache e mutações
3. **API Layer** (`src/services/api.ts`): Cliente Axios para comunicação HTTP
4. **Type Layer** (`src/types/*`): Definições TypeScript para tipagem estática
5. **Routing Layer** (`src/App.tsx`): Configuração de rotas e providers globais

---

## 📁 Estrutura de Pastas

```
dojo-frontend/
│
├── public/                      # Arquivos estáticos
│
├── src/
│   ├── components/              # Componentes React
│   │   ├── Layout/              # Layout principal com AppBar e Drawer
│   │   │   └── Layout.tsx
│   │   ├── Athletes/            # Módulo de Atletas
│   │   │   ├── AthletesPage.tsx      # Listagem de atletas
│   │   │   └── AthleteForm.tsx       # Formulário de criação/edição
│   │   ├── Classes/             # Módulo de Turmas
│   │   │   ├── ClassesPage.tsx       # Listagem de turmas
│   │   │   └── ClassForm.tsx         # Formulário de criação/edição
│   │   ├── Enrollments/         # Módulo de Matrículas
│   │   │   ├── EnrollmentsPage.tsx   # Listagem de matrículas
│   │   │   └── EnrollmentForm.tsx    # Formulário de criação/edição
│   │   ├── Attendances/         # Módulo de Presenças
│   │   │   ├── AttendancesPage.tsx   # Listagem de presenças
│   │   │   └── AttendanceForm.tsx    # Formulário de check-in/out
│   │   └── Dashboard/           # Dashboard com métricas
│   │       └── Dashboard.tsx
│   │
│   ├── hooks/                   # Custom hooks com React Query
│   │   ├── useAthletes.ts       # Hook para atletas (queries + mutations)
│   │   ├── useClasses.ts        # Hook para turmas
│   │   ├── useEnrollments.ts    # Hook para matrículas
│   │   └── useAttendances.ts    # Hook para presenças
│   │
│   ├── services/                # Serviços externos
│   │   └── api.ts               # Cliente Axios configurado
│   │
│   ├── types/                   # Definições de tipos TypeScript
│   │   ├── athlete.ts           # Interface Athlete
│   │   ├── class.ts             # Interface Class
│   │   ├── enrollment.ts        # Interface Enrollment
│   │   └── attendance.ts        # Interface Attendance
│   │
│   ├── App.tsx                  # Componente raiz com providers e rotas
│   ├── App.css                  # Estilos globais
│   └── main.tsx                 # Entry point da aplicação
│
├── docker-compose.yml           # Orquestração do frontend com LocalStack
├── Dockerfile                   # Imagem Docker para o frontend
├── vite.config.ts               # Configuração do Vite (proxy, build, etc)
├── tsconfig.json                # Configuração TypeScript
├── package.json                 # Dependências e scripts
└── README.md                    # Este arquivo
```
---

## 🔧 Tecnologias Utilizadas

### Core
- **React 18.2.0**: Biblioteca para construção de interfaces
- **TypeScript 5.3.3**: Superset JavaScript com tipagem estática
- **Vite 5.0.11**: Build tool e dev server com HMR

### UI & Styling
- **Material-UI 5.15.6**: Biblioteca de componentes React
  - `@mui/material`: Componentes core
  - `@mui/icons-material`: Ícones
  - `@mui/x-date-pickers`: Date/Time pickers
  - `@emotion/react` + `@emotion/styled`: CSS-in-JS

### State Management & Data Fetching
- **@tanstack/react-query 5.17.19**: Cache e sincronização de dados assíncronos
- **axios 1.6.5**: Cliente HTTP para comunicação com API

### Forms & Validation
- **react-hook-form 7.49.3**: Gerenciamento de formulários
- **@hookform/resolvers 3.3.4**: Adaptadores de validação
- **zod 3.22.4**: Schema validation e inferência de tipos

### Routing & Navigation
- **react-router-dom 6.21.3**: Roteamento SPA

### Notifications
- **notistack 3.0.1**: Sistema de notificações/snackbars

### Development Tools
- **ESLint**: Linter para qualidade de código
- **@vitejs/plugin-react**: Plugin Vite para Fast Refresh

---

## ⚙️ Configuração do Ambiente

### Pré-requisitos

- **Node.js**: >= 18.0.0
- **npm** ou **yarn**
- **Docker** e **Docker Compose** (para desenvolvimento com LocalStack)

### Variáveis de Ambiente

Atualmente não há variáveis de ambiente obrigatórias. A configuração do proxy Vite aponta para `localstack:4566` (dentro da rede Docker).

Se executar fora do Docker, ajuste o proxy em `vite.config.ts`:

\`\`\`typescript
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:4566', // LocalStack local
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
\`\`\`

---

## 🚀 Como Executar

### 1. Com Docker Compose (Recomendado)

Este método sobe o frontend junto com o LocalStack e outros serviços:

\`\`\`bash
# No diretório raiz do projeto (DojoManagement)
docker-compose up -d

# Ou especificamente no diretório dojo-frontend
cd dojo-frontend
docker-compose up -d
\`\`\`

O frontend estará disponível em: **http://localhost:5173**

### 2. Localmente (Desenvolvimento)

\`\`\`bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev
\`\`\`

O servidor Vite iniciará em `http://localhost:5173` com hot-reload habilitado.

### 3. Build de Produção

\`\`\`bash
# Gerar build otimizado
npm run build

# Preview da build
npm run preview
\`\`\`

O build será gerado em `dist/` e pode ser servido via S3, CloudFront, Nginx, etc.

---

## 📦 Detalhamento dos Componentes

### 🧱 Layout (`src/components/Layout/Layout.tsx`)

**Responsabilidade**: Estrutura principal da aplicação com AppBar e Drawer lateral.

**Características**:
- AppBar responsivo com menu hamburguer
- Drawer com navegação para:
  - Dashboard
  - Atletas
  - Turmas
  - Matrículas
  - Presenças
- Container centralizado para renderizar rotas filhas
- Ícones Material-UI para navegação

**Uso**:
\`\`\`tsx
<Layout>
  <Routes>
    <Route path="/" element={<Dashboard />} />
    {/* outras rotas */}
  </Routes>
</Layout>
\`\`\`

---

### 👤 Módulo Athletes

#### `AthletesPage.tsx`

**Responsabilidade**: Listagem e gerenciamento de atletas.

**Funcionalidades**:
- Tabela com colunas: Nome, CPF, Email, Telefone, Data de Nascimento, Ações
- Botão "Novo Atleta" → navega para `/athletes/new`
- Botão "Editar" → navega para `/athletes/:id`
- Botão "Excluir" → chama mutação `deleteAthlete` com confirmação
- Loading states e mensagens de erro
- Integração com `useAthletes` hook

**Principais componentes Material-UI**:
- `<Table>`, `<TableHead>`, `<TableBody>`, `<TableRow>`, `<TableCell>`
- `<Button>`, `<IconButton>`, `<CircularProgress>`, `<Alert>`

#### `AthleteForm.tsx`

**Responsabilidade**: Formulário de criação/edição de atletas.

**Características**:
- Validação com Zod schema:
  \`\`\`typescript
  const athleteSchema = z.object({
    name: z.string().min(1, 'Nome é obrigatório'),
    cpf: z.string().min(11, 'CPF deve ter 11 dígitos'),
    email: z.string().email('Email inválido'),
    phone: z.string().optional(),
    birth_date: z.string().optional(),
    address: z.string().optional(),
    belt_level: z.string().optional(),
  });
  \`\`\`
- Gerenciamento de formulário com `react-hook-form`
- Date picker com `@mui/x-date-pickers`
- Modo criação (`/athletes/new`) vs edição (`/athletes/:id`)
- Auto-carrega dados do atleta em modo edição via `getAthlete`
- Submissão com `createAthlete` ou `updateAthlete`
- Navegação automática após sucesso

**Campos**:
- Nome (obrigatório)
- CPF (obrigatório)
- Email (obrigatório)
- Telefone (opcional)
- Data de Nascimento (opcional)
- Endereço (opcional)
- Faixa (opcional)

---

### 🥋 Módulo Classes

#### `ClassesPage.tsx`

**Responsabilidade**: Listagem e gerenciamento de turmas.

**Funcionalidades**:
- Tabela com colunas: Modalidade, Nível, Instrutor, Horário, Dias, Capacidade, Ações
- CRUD completo para turmas
- Integração com `useClasses` hook

#### `ClassForm.tsx`

**Responsabilidade**: Formulário de criação/edição de turmas.

**Campos**:
- Modalidade (ex: Karatê, Jiu-Jitsu, Judô)
- Nível (Iniciante, Intermediário, Avançado)
- Instrutor
- Horário (ex: 18:00 - 19:00)
- Dias da semana (ex: Segunda, Quarta, Sexta)
- Capacidade máxima

**Validação Zod**:
\`\`\`typescript
const classSchema = z.object({
  modality: z.string().min(1, 'Modalidade é obrigatória'),
  level: z.string().min(1, 'Nível é obrigatório'),
  instructor: z.string().min(1, 'Instrutor é obrigatório'),
  schedule: z.string().min(1, 'Horário é obrigatório'),
  days_of_week: z.string().min(1, 'Dias são obrigatórios'),
  max_capacity: z.number().min(1, 'Capacidade deve ser maior que 0'),
});
\`\`\`

---

### 📝 Módulo Enrollments

#### `EnrollmentsPage.tsx`

**Responsabilidade**: Listagem de matrículas (vínculo atleta-turma).

**Funcionalidades**:
- Tabela com colunas: Atleta, Turma, Data de Matrícula, Status, Ações
- Visualização de matrículas ativas/inativas
- Integração com `useEnrollments` hook

#### `EnrollmentForm.tsx`

**Responsabilidade**: Formulário para matricular atleta em turma.

**Campos**:
- Seleção de Atleta (dropdown)
- Seleção de Turma (dropdown)
- Data de Matrícula (auto-preenchida com data atual)
- Status (Ativo/Inativo)

**Validação Zod**:
\`\`\`typescript
const enrollmentSchema = z.object({
  athlete_id: z.number().min(1, 'Atleta é obrigatório'),
  class_id: z.number().min(1, 'Turma é obrigatória'),
  enrollment_date: z.string(),
  status: z.enum(['active', 'inactive']),
});
\`\`\`

---

### ✅ Módulo Attendances

#### `AttendancesPage.tsx`

**Responsabilidade**: Listagem de presenças (check-in/check-out).

**Funcionalidades**:
- Tabela com colunas: Atleta, Turma, Data/Hora Check-in, Check-out, Ações
- Registro de presenças nas aulas
- Integração com `useAttendances` hook

#### `AttendanceForm.tsx`

**Responsabilidade**: Formulário para registrar presença.

**Campos**:
- Seleção de Matrícula (atleta + turma)
- Data/Hora Check-in
- Data/Hora Check-out (opcional)

**Validação Zod**:
\`\`\`typescript
const attendanceSchema = z.object({
  enrollment_id: z.number().min(1, 'Matrícula é obrigatória'),
  check_in: z.string(),
  check_out: z.string().optional(),
});
\`\`\`

---

### 📊 Dashboard (`src/components/Dashboard/Dashboard.tsx`)

**Responsabilidade**: Painel inicial com métricas do dojo.

**Métricas Exibidas**:
- Total de Atletas
- Total de Turmas
- Total de Matrículas Ativas
- Presenças do Dia

**Características**:
- Cards com `<Paper>` Material-UI
- Ícones representativos para cada métrica
- Cores diferenciadas (primary, secondary, success, warning)
- Carregamento assíncrono dos dados via React Query

**Exemplo de Card**:
\`\`\`tsx
<Paper sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
  <PersonIcon color="primary" sx={{ fontSize: 40 }} />
  <Box>
    <Typography variant="h4">{athletesData?.length || 0}</Typography>
    <Typography variant="body2" color="text.secondary">
      Total de Atletas
    </Typography>
  </Box>
</Paper>
\`\`\`

---

## 🔄 Fluxo de Dados

### Arquitetura de Estado

\`\`\`
Component (UI)
    ↓ triggers
useMutation (hook)
    ↓ calls
API Service (axios)
    ↓ HTTP POST/PUT/DELETE
Vite Proxy
    ↓ forwards to
LocalStack API Gateway
    ↓ invokes
Lambda Function
    ↓ uses
BaseRepository (dojo-commons)
    ↓ executes SQL
DuckDB
    ↓ returns data
Lambda → API Gateway → Vite → Component
    ↓ updates
React Query Cache
    ↓ re-renders
Component (UI)
\`\`\`

### Exemplo: Criar Atleta

1. **User Action**: Usuário preenche formulário em `AthleteForm` e clica "Salvar"
2. **Form Validation**: Zod valida os campos
3. **Mutation Trigger**: `createAthlete.mutate(data)` é chamado
4. **API Call**: `api.post('/api/athletes', data)` envia request
5. **Proxy Forwarding**: Vite proxy redireciona para `http://localstack:4566/athletes`
6. **Lambda Invocation**: API Gateway invoca `dojo-athlete-mgmt-lambda`
7. **Repository**: Lambda usa `AthleteRepository.create(athlete)`
8. **Auto-ID Generation**: `BaseRepository._generate_next_id()` gera ID único
9. **Database Insert**: DuckDB executa `INSERT INTO athletes ...`
10. **Response**: Lambda retorna `201 Created` com atleta criado
11. **Cache Update**: React Query invalida cache de `athletes`
12. **Re-fetch**: `useAthletes` re-fetcha lista atualizada
13. **UI Update**: Tabela de atletas mostra novo registro
14. **Navigation**: Usuário é redirecionado para `/athletes`
15. **Notification**: Snackbar exibe "Atleta criado com sucesso!"

---

## 🌐 API e Endpoints

### Base URL

- **Development (Docker)**: `http://localhost:5173/api`
- **Vite Proxy**: Redireciona para `http://localstack:4566`
- **LocalStack**: Simula API Gateway AWS

### Endpoints

#### Athletes (`/api/athletes`)

| Método | Endpoint          | Descrição                |
|--------|-------------------|--------------------------|
| GET    | `/api/athletes`   | Listar todos os atletas  |
| GET    | `/api/athletes/:id` | Buscar atleta por ID   |
| POST   | `/api/athletes`   | Criar novo atleta        |
| PUT    | `/api/athletes/:id` | Atualizar atleta       |
| DELETE | `/api/athletes/:id` | Deletar atleta         |

**Payload POST/PUT**:
\`\`\`json
{
  "name": "João Silva",
  "cpf": "12345678901",
  "email": "joao@example.com",
  "phone": "11987654321",
  "birth_date": "2000-01-15",
  "address": "Rua A, 123",
  "belt_level": "Faixa Azul"
}
\`\`\`

#### Classes (`/api/classes`)

| Método | Endpoint          | Descrição                |
|--------|-------------------|--------------------------|
| GET    | `/api/classes`    | Listar todas as turmas   |
| GET    | `/api/classes/:id` | Buscar turma por ID     |
| POST   | `/api/classes`    | Criar nova turma         |
| PUT    | `/api/classes/:id` | Atualizar turma         |
| DELETE | `/api/classes/:id` | Deletar turma           |

**Payload POST/PUT**:
\`\`\`json
{
  "modality": "Karatê",
  "level": "Iniciante",
  "instructor": "Sensei Takeda",
  "schedule": "18:00 - 19:00",
  "days_of_week": "Segunda, Quarta, Sexta",
  "max_capacity": 20
}
\`\`\`

#### Enrollments (`/api/enrollments`)

| Método | Endpoint             | Descrição                   |
|--------|----------------------|-----------------------------|
| GET    | `/api/enrollments`   | Listar todas as matrículas  |
| GET    | `/api/enrollments/:id` | Buscar matrícula por ID   |
| POST   | `/api/enrollments`   | Criar nova matrícula        |
| PUT    | `/api/enrollments/:id` | Atualizar matrícula       |
| DELETE | `/api/enrollments/:id` | Deletar matrícula         |

**Payload POST/PUT**:
\`\`\`json
{
  "athlete_id": 1,
  "class_id": 2,
  "enrollment_date": "2024-01-15",
  "status": "active"
}
\`\`\`

#### Attendances (`/api/attendances`)

| Método | Endpoint             | Descrição                   |
|--------|----------------------|-----------------------------|
| GET    | `/api/attendances`   | Listar todas as presenças   |
| GET    | `/api/attendances/:id` | Buscar presença por ID    |
| POST   | `/api/attendances`   | Criar nova presença         |
| PUT    | `/api/attendances/:id` | Atualizar presença        |
| DELETE | `/api/attendances/:id` | Deletar presença          |

**Payload POST/PUT**:
\`\`\`json
{
  "enrollment_id": 5,
  "check_in": "2024-01-15T18:05:00Z",
  "check_out": "2024-01-15T19:00:00Z"
}
\`\`\`

### Tratamento de Erros

A API retorna erros HTTP padrão:

- **400 Bad Request**: Dados inválidos no payload
- **404 Not Found**: Recurso não encontrado
- **500 Internal Server Error**: Erro no servidor/lambda

Exemplo de resposta de erro:
\`\`\`json
{
  "error": "Validation error",
  "details": {
    "name": "Nome é obrigatório"
  }
}
\`\`\`

---

## 🧪 Testes

### Estrutura de Testes (Sugestão)

Atualmente não há testes implementados. Recomendação de estrutura:

\`\`\`
tests/
├── unit/
│   ├── components/
│   │   ├── AthleteForm.test.tsx
│   │   ├── ClassForm.test.tsx
│   │   └── ...
│   └── hooks/
│       ├── useAthletes.test.ts
│       └── ...
├── integration/
│   └── api/
│       └── athletes.test.ts
└── e2e/
    └── athletes-flow.test.ts
\`\`\`

### Ferramentas Recomendadas

- **Vitest**: Framework de testes compatível com Vite
- **React Testing Library**: Testes de componentes
- **MSW (Mock Service Worker)**: Mock de APIs para testes
- **Playwright**: Testes E2E

### Comandos de Teste (Exemplo)

\`\`\`bash
# Instalar Vitest
npm install -D vitest @testing-library/react @testing-library/jest-dom

# Adicionar script em package.json
"scripts": {
  "test": "vitest",
  "test:ui": "vitest --ui",
  "test:coverage": "vitest --coverage"
}

# Executar testes
npm test
\`\`\`

---

## 🚢 Deploy

### Deploy no S3 + CloudFront (AWS)

#### 1. Build de Produção

\`\`\`bash
npm run build
\`\`\`

O build será gerado em `dist/`.

#### 2. Criar Bucket S3

\`\`\`bash
aws s3 mb s3://dojo-frontend-app
aws s3 website s3://dojo-frontend-app --index-document index.html
\`\`\`

#### 3. Fazer Upload dos Arquivos

\`\`\`bash
aws s3 sync dist/ s3://dojo-frontend-app --delete
\`\`\`

#### 4. Configurar Política de Bucket

\`\`\`json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::dojo-frontend-app/*"
    }
  ]
}
\`\`\`

#### 5. CloudFront (Opcional)

Criar distribuição CloudFront apontando para o bucket S3 para:
- CDN global
- HTTPS
- Cache otimizado

### Deploy com Docker

#### Dockerfile para Produção

\`\`\`dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
\`\`\`

#### nginx.conf

\`\`\`nginx
server {
  listen 80;
  server_name _;
  root /usr/share/nginx/html;
  index index.html;

  location / {
    try_files $uri $uri/ /index.html;
  }

  location /api {
    proxy_pass http://api-gateway-url;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
  }
}
\`\`\`

#### Build e Run

\`\`\`bash
docker build -t dojo-frontend .
docker run -p 8080:80 dojo-frontend
\`\`\`

### Deploy com Terraform (dojo-infra)

Integrar com o módulo `dojo-infra` para provisionamento automatizado:

\`\`\`hcl
module "frontend" {
  source = "../dojo-tf-modules/dojo-s3-website"
  
  bucket_name = "dojo-frontend-app"
  index_document = "index.html"
  error_document = "index.html"
}
\`\`\`

---

## 📝 Scripts Disponíveis

| Script          | Comando             | Descrição                              |
|-----------------|---------------------|----------------------------------------|
| `dev`           | `npm run dev`       | Inicia servidor de desenvolvimento     |
| `build`         | `npm run build`     | Gera build de produção                 |
| `preview`       | `npm run preview`   | Preview da build localmente            |
| `lint`          | `npm run lint`      | Executa ESLint                         |

---

## 🤝 Contribuindo

### Fluxo de Desenvolvimento

1. Crie uma branch a partir de `main`:
   \`\`\`bash
   git checkout -b feature/minha-feature
   \`\`\`

2. Faça suas alterações seguindo os padrões:
   - Components em PascalCase
   - Hooks com prefixo `use`
   - Types em `src/types/`
   - Validação com Zod

3. Commit com mensagens descritivas:
   \`\`\`bash
   git commit -m "feat: adiciona filtro de atletas por faixa"
   \`\`\`

4. Push e abra Pull Request:
   \`\`\`bash
   git push origin feature/minha-feature
   \`\`\`

### Padrões de Código

- **ESLint**: Seguir regras definidas em `eslint.config.js`
- **TypeScript**: Sem uso de `any`, sempre tipar interfaces
- **Material-UI**: Usar componentes MUI sempre que possível
- **React Query**: Centralizar lógica de API nos hooks

---

## 📚 Recursos Adicionais

- [Documentação React](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vitejs.dev/guide/)
- [Material-UI Docs](https://mui.com/material-ui/getting-started/)
- [React Query Docs](https://tanstack.com/query/latest/docs/react/overview)
- [React Hook Form](https://react-hook-form.com/)
- [Zod Documentation](https://zod.dev/)

---

## 🐛 Troubleshooting

### Erro: "Cannot connect to LocalStack"

**Solução**:
- Verifique se o LocalStack está rodando:
  \`\`\`bash
  docker-compose ps
  \`\`\`
- Verifique o proxy em `vite.config.ts`
- Confirme que a rede Docker está configurada corretamente

### Erro: "Module not found"

**Solução**:
- Limpe cache e reinstale dependências:
  \`\`\`bash
  rm -rf node_modules package-lock.json
  npm install
  \`\`\`

### Hot Reload não funciona

**Solução**:
- Em `vite.config.ts`, habilite polling:
  \`\`\`typescript
  export default defineConfig({
    server: {
      watch: {
        usePolling: true,
      },
    },
  })
  \`\`\`

### CORS Error

**Solução**:
- O proxy Vite resolve CORS em desenvolvimento
- Em produção, configure CORS no API Gateway/Lambda:
  \`\`\`python
  return {
      'statusCode': 200,
      'headers': {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
      },
      'body': json.dumps(data)
  }
  \`\`\`

---

## �� Licença

Este projeto é licenciado sob a licença MIT.

---

## 👥 Autores

- **Henrique W. Alves** - Desenvolvimento inicial

---

## 🙏 Agradecimentos

- Equipe dojo-commons
- Comunidade Material-UI
- Contribuidores do React Query

---

**Última atualização**: Janeiro 2025
