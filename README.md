# ResumeForge

> Plataforma full stack para criação e compartilhamento de currículos digitais profissionais.

Cada usuário cria uma conta, preenche seu currículo pelo dashboard e recebe uma URL pública — `resumeforge.vercel.app/u/seu-username` — para compartilhar com recrutadores.

---

## Stack

| Camada | Tecnologia |
|---|---|
| Backend | Node.js 18 · Express 5 · Sequelize 6 |
| Banco | PostgreSQL 16 |
| Auth | JWT (jsonwebtoken) · bcryptjs |
| Validação | express-validator |
| Frontend | Next.js 14 (App Router) · React 18 |
| Estilo | Tailwind CSS · Syne + DM Sans |
| Formulários | React Hook Form · Zod |
| HTTP Client | Axios |
| Deploy | Vercel (back + front) · Neon/Supabase (banco) |

---

## Funcionalidades

- **Autenticação completa** — registro, login e sessão via JWT
- **Dashboard protegido** — edição de dados pessoais, experiências, formação, skills, resumo e links externos
- **Página pública** em `/u/:username` — currículo renderizado via ISR do Next.js, compartilhável sem login
- **Controle de acesso por ownership** — cada usuário só edita o próprio currículo (403 para tentativas externas)
- **Rota pública de leitura** — `GET /people/u/:username` retorna o currículo sem autenticação

---

## Estrutura do repositório

```
resume-api/
├── back/                        # API REST
│   ├── api/
│   │   ├── controllers/         # Lógica de negócio (auth, people, skills...)
│   │   ├── middleware/          # authMiddleware, validationHandler
│   │   ├── models/              # Sequelize: User, Person, Experience...
│   │   ├── routes/              # Endpoints e roteamento aninhado
│   │   ├── utils/               # asyncHandler
│   │   ├── validators/          # Regras express-validator por entidade
│   │   └── index.js             # Entry point
│   ├── .env.sample
│   ├── vercel.json
│   └── package.json
│
└── front/                       # Aplicação Next.js
    ├── app/
    │   ├── page.tsx             # Landing page
    │   ├── auth/login/          # Tela de login
    │   ├── auth/register/       # Tela de cadastro
    │   ├── dashboard/           # Editor do currículo (rota protegida)
    │   └── u/[username]/        # Página pública do currículo
    ├── components/
    │   ├── dashboard/           # Formulários e componentes do editor
    │   └── resume/              # Visualização pública
    ├── hooks/useAuth.tsx        # Context de autenticação
    ├── lib/api.ts               # Axios com interceptors JWT
    ├── types/index.ts           # Tipos TypeScript
    └── package.json
```

---

## Rodando localmente

### Pré-requisitos

- Node.js 18+
- PostgreSQL rodando localmente **ou** conta no [Neon](https://neon.tech) / [Supabase](https://supabase.com) (free tier)

### Backend

```bash
cd back
npm install
cp .env.sample .env
```

Preencha o `.env`:

```env
PORT=3000
POSTGRES_URL=postgresql://usuario:senha@localhost:5432/resume_db
JWT_SECRET=sua_chave_secreta_longa
JWT_EXPIRES_IN=7d
ERASE_DATABASE=true
```

```bash
npm start
# 🚀 Resume API rodando na porta 3000
```

> Na primeira execução, `ERASE_DATABASE=true` cria as tabelas automaticamente.
> Após isso, mude para `false` e reinicie.

### Frontend

```bash
cd front
npm install
cp .env.local.sample .env.local
```

`.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

```bash
npm run dev
# ▲ Next.js rodando em http://localhost:3001
```

---

## Endpoints da API

### Auth

| Método | Rota | Descrição | Auth |
|---|---|---|---|
| POST | `/auth/register` | Cria conta + currículo | — |
| POST | `/auth/login` | Retorna JWT | — |
| GET | `/auth/me` | Usuário logado + currículo completo | ✅ |

### Currículo

| Método | Rota | Descrição | Auth |
|---|---|---|---|
| GET | `/people` | Lista todos os currículos | — |
| GET | `/people/:id` | Currículo por ID | — |
| GET | `/people/u/:username` | Currículo por username (página pública) | — |
| PUT | `/people/:id` | Atualiza dados pessoais | ✅ |
| DELETE | `/people/:id` | Remove currículo | ✅ |

### Sub-recursos (todos seguem o mesmo padrão)

```
GET    /people/:personId/experiences
POST   /people/:personId/experiences          ✅
PUT    /people/:personId/experiences/:id      ✅
DELETE /people/:personId/experiences/:id      ✅
```

Disponível para: `experiences`, `educations`, `skills`, `resumes`, `externallinks`

---

## Modelo de dados

```
User
 └── Person (1:1)
      ├── Resume       (1:N)
      ├── Experience   (1:N)
      ├── Education    (1:N)
      ├── Skill        (1:N)
      └── ExternalLink (1:N)
```

`User` armazena credenciais. `Person` armazena os dados públicos do currículo.
Deleção em cascata: remover um `User` remove tudo associado.

---

## Deploy

O projeto usa dois deploys separados na Vercel — um para o back, outro para o front.

### Backend (Vercel)

O `vercel.json` já está configurado. Adicione as variáveis de ambiente no painel da Vercel:

```
POSTGRES_URL
JWT_SECRET
JWT_EXPIRES_IN
FRONTEND_URL      ← URL do seu front em produção (para o CORS)
ERASE_DATABASE=false
```

### Frontend (Vercel)

Adicione no painel:

```
NEXT_PUBLIC_API_URL   ← URL do seu back em produção
```

---

## Autor

**Matheus Kauã**
Desenvolvedor Full Stack

[![GitHub](https://img.shields.io/badge/GitHub-mk--matheus-181717?style=flat&logo=github)](https://github.com/mk-matheus)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-mk--matheus-0A66C2?style=flat&logo=linkedin)](https://www.linkedin.com/in/mk-matheus)

---

## Licença

MIT — veja o arquivo [LICENSE](LICENSE) para detalhes.
