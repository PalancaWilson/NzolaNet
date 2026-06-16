# NzolaNet

Rede social angolana moderna — **Frontend Angular 21.2** + **Backend Laravel 12**.

---

## Stack

### Frontend

| Camada        | Tecnologia                              |
|---------------|-----------------------------------------|
| Framework     | Angular 21.2 (standalone components)    |
| Linguagem     | TypeScript 5.9 (strict)                 |
| State         | Signals (`signal`/`computed`/`effect`)  |
| Testes        | Vitest via `@angular/build:unit` (jsdom)|
| Estilos       | CSS + Bootstrap 5.3 + Bootstrap Icons   |
| Formatação    | Prettier (single quotes, printWidth 100)|

### Backend

| Camada        | Tecnologia                              |
|---------------|-----------------------------------------|
| Framework     | Laravel 12                              |
| Linguagem     | PHP ^8.2                                |
| Base de dados | MySQL                                   |
| Testes        | PHPUnit ^11.5                           |

---

## Comandos

### Frontend (`nzolanet/`)

```sh
npm start           # ng serve (dev → http://localhost:4200, proxy :8000)
npm test            # ng test  (Vitest)
npm run build       # ng build (produção → dist/nzolanet/browser/)
npm run watch       # ng build --watch --configuration development
npx prettier . --check   # verificar formatação
npx prettier . --write   # corrigir formatação
```

### Backend (`SistemaNzola/`)

```sh
php artisan serve   # dev → http://127.0.0.1:8000
php artisan migrate # executar migrations
php artisan db:seed # popular com dados de teste
php artisan test    # PHPUnit
```

---

## Arquitectura — Frontend

### Routing

- Rotas públicas (`guestGuard`): `/login`, `/register`, `/recuperar-senha`, `/nova-senha/:token`
- Rotas protegidas (`authGuard`): todas as restantes, dentro do layout `AppShell`
- Rotas de administrador (`adminGuard`): `/admin/dashboard`, `/admin/utilizadores`, `/admin/publicacoes`, `/admin/comentarios`, `/admin/denuncias`
- Todas as páginas usam `loadComponent` (lazy loading)
- `withComponentInputBinding()` — parâmetros de rota ligados directamente a `@Input()`
- `withViewTransitions()` — transições animadas entre rotas

### Layouts

- **`auth-layout`** — páginas públicas (login/register/recuperar-senha/nova-senha), fundo gradiente
- **`app-shell`** — páginas autenticadas, inclui `Topbar`, `Sidebar`, `BottomNav` mobile, `RightSidebar` e modal global

### Páginas

| Rota                   | Componente          | Descrição                                        |
|------------------------|---------------------|--------------------------------------------------|
| `/login`               | Login               | Autenticação com email + senha                   |
| `/register`            | Register            | Registo em 2 passos com validação async          |
| `/recuperar-senha`     | RecuperarSenha      | Pedido de redefinição de senha                   |
| `/nova-senha/:token`   | NovaSenha           | Redefinição de senha via token                   |
| `/feed`                | Feed                | Feed principal com criação + listagem            |
| `/explorar`            | Explore             | Pesquisa de pessoas, posts, tendências           |
| `/post/:id`            | PostDetail          | Publicação individual + comentários              |
| `/profile`             | Profile             | Perfil próprio (editar capa/avatar)              |
| `/profile/:id`         | ProfileId           | Perfil de outro utilizador                       |
| `/notifications`       | Notification        | Lista de notificações com filtros                |
| `/guardados`           | Stored              | Publicações guardadas                            |
| `/mensagens`           | Mensagens           | Chat de mensagens directas (rota comentada)      |
| `/settings`            | Settings (shell)    | Definições de conta/notificações/privacidade/aparência/idioma |
| `/settings/conta`      | Conta               | Editar nome, email, senha                        |
| `/settings/notificacoes` | Notificacoes      | Toggles de notificações                          |
| `/settings/privado`    | Privado             | Privacidade do perfil                            |
| `/settings/aparencia`  | Aparencia           | Modo escuro                                      |
| `/settings/idiomas`    | Idiomas             | Idioma e região                                  |
| `/admin/dashboard`     | AdminDashboard      | Estatísticas da plataforma                       |
| `/admin/utilizadores`  | AdminUsers          | Gerir utilizadores (bloquear/remover)            |
| `/admin/publicacoes`   | AdminPosts          | Moderar publicações                              |
| `/admin/comentarios`   | AdminComments       | Moderar comentários                              |
| `/admin/denuncias`     | AdminDenuncias      | Gerir denúncias (resolver/rejeitar/remover)      |
| `/sobre`               | Sobre               | Sobre o NzolaNet                                 |
| `/termos`              | Termos              | Termos de serviço                                |
| `/404`                 | NotFound            | Página não encontrada                            |

### Serviços

| Serviço              | Responsabilidade                                      |
|----------------------|-------------------------------------------------------|
| `AuthService`        | Login, registo, logout, sessão (token + localStorage) |
| `UserService`        | Perfil do utilizador logado (carregar, actualizar)    |
| `PostService`        | CRUD de publicações, bazes, repostar, guardar         |
| `SettingsService`    | Definições do utilizador (dark mode, notificações)    |
| `LayoutService`      | Estado do layout (sidebar visível)                    |
| `AdminService`       | Estatísticas, gestão de utilizadores, moderação       |
| `ModalService`       | Modal global de confirmação/prompt/alert              |

### Interceptors

- **`authInterceptor`** — anexa token Bearer a todas as requests; redirecciona para `/login` em 401
- **`httpErrorInterceptor`** — loga erros 500+ e de rede; re-lança excepção

### Componentes partilhados

| Componente         | Uso                                            |
|--------------------|------------------------------------------------|
| `PostCard`         | Card de publicação com edição inline           |
| `CreatePost`       | Formulário de nova publicação                  |
| `SearchUser`       | Input de pesquisa com selecção de utilizador   |
| `RightSidebar`     | Sugestões de utilizadores + notificações       |
| `Sidebar`          | Navegação lateral com badge de denúncias       |
| `Topbar`           | Barra superior com pesquisa rápida             |
| `Modal`            | Modal reutilizável (confirm/prompt/alert)      |
| `NotificationCard` | Card de notificação individual                 |

---

## Arquitectura — Backend

### Padrão

Repository + Service + Interface com injecção de dependência:

- **Controllers** — validação HTTP, delegam para Services
- **Services** — lógica de negócio, orquestram repositórios
- **Repositories** — queries Eloquent, implementam interfaces
- **Interfaces** — contratos para repositórios
- **DTOs** — objectos de transferência tipados

### Autenticação

Sistema custom com token de 60 caracteres (`api_token`):

- Registo com password forte (8+ chars, maiúscula, número, especial)
- Login verifica `Hash::check()` contra `senha_hash` (Bcrypt 12 rounds)
- Middleware `AutenticacaoMiddleware` lê `Authorization: Bearer <token>`
- Middleware `RoleMiddleware` verifica `role` (`utilizador` / `administrador`)
- Contas bloqueadas (`bloqueado = true`) impedem login

### Base de dados (13 tabelas)

| Tabela           | Descrição                                    |
|------------------|----------------------------------------------|
| `utilizadores`   | Utilizadores com token, role, bloqueio       |
| `seguidores`     | Relação de seguir (com约束 self-follow)       |
| `publicacoes`    | Posts com texto, imagem, vídeo               |
| `bazes`          | Likes (toggle, um por user por post)         |
| `comentarios`    | Comentários em publicações                   |
| `notificacoes`   | Notificações de baze/comentário/seguidor     |
| `conversas`      | Conversations entre 2 utilizadores            |
| `mensagens`      | Mensagens dentro de conversas                |
| `denuncias`      | Denúncias polimórficas (post/comentário/user)|
| `sessions`       | Sessões Laravel                              |

### API Endpoints

**Públicos:**

| Método | Rota                              | Acção                  |
|--------|-----------------------------------|------------------------|
| POST   | `/api/auth/registar`              | Registar utilizador    |
| POST   | `/api/auth/login`                 | Login                  |
| GET    | `/api/auth/verificar-email`       | Verificar email único  |
| GET    | `/api/auth/verificar-nome`        | Verificar nome único   |

**Autenticados:**

| Método | Rota                                    | Acção                        |
|--------|-----------------------------------------|------------------------------|
| POST   | `/api/auth/logout`                      | Logout                       |
| GET    | `/api/utilizadores/me`                  | Perfil atual                 |
| GET    | `/api/utilizadores`                     | Listar utilizadores          |
| GET    | `/api/utilizadores/{id}`                | Ver perfil                   |
| PUT    | `/api/utilizadores/{id}`                | Atualizar perfil             |
| DELETE | `/api/utilizadores/{id}`                | Apagar conta                 |
| POST   | `/api/utilizadores/{id}/foto-perfil`    | Upload foto de perfil        |
| POST   | `/api/utilizadores/{id}/foto-capa`      | Upload foto de capa          |
| GET    | `/api/utilizadores/{id}/seguidores`     | Listar seguidores            |
| GET    | `/api/utilizadores/{id}/seguindo`       | Listar a seguir              |
| POST   | `/api/utilizadores/{id}/seguir`         | Seguir                       |
| DELETE | `/api/utilizadores/{id}/deixar-de-seguir`| Deixar de seguir            |
| GET    | `/api/utilizadores/{id}/publicacoes`    | Publicações do utilizador    |
| GET    | `/api/publicacoes`                      | Feed de publicações          |
| POST   | `/api/publicacoes`                      | Criar publicação             |
| GET    | `/api/publicacoes/{id}`                 | Ver publicação               |
| PUT    | `/api/publicacoes/{id}`                 | Editar publicação            |
| DELETE | `/api/publicacoes/{id}`                 | Apagar publicação            |
| POST   | `/api/publicacoes/{id}/baze`            | Toggle baze (like)           |
| GET    | `/api/publicacoes/{id}/comentarios`     | Listar comentários           |
| POST   | `/api/publicacoes/{id}/comentarios`     | Criar comentário             |
| PUT    | `/api/comentarios/{id}`                 | Editar comentário            |
| DELETE | `/api/comentarios/{id}`                 | Apagar comentário            |
| GET    | `/api/notificacoes`                     | Listar notificações          |
| GET    | `/api/notificacoes/nao-lidas`           | Contar não lidas             |
| PUT    | `/api/notificacoes/{id}/ler`            | Marcar como lida             |
| GET    | `/api/conversas`                        | Listar conversas             |
| POST   | `/api/conversas`                        | Criar conversa               |
| POST   | `/api/conversas/{id}/mensagens`         | Enviar mensagem              |
| POST   | `/api/denuncias`                        | Denunciar conteúdo           |
| GET    | `/api/settings`                         | Ver definições               |
| PUT    | `/api/settings`                         | Atualizar definições         |

**Admin:**

| Método | Rota                                    | Acção                        |
|--------|-----------------------------------------|------------------------------|
| GET    | `/api/admin/estatisticas`               | Estatísticas da plataforma   |
| GET    | `/api/admin/utilizadores`               | Listar utilizadores (admin)  |
| POST   | `/api/admin/utilizadores/{id}/bloquear` | Bloquear utilizador          |
| POST   | `/api/admin/utilizadores/{id}/desbloquear`| Desbloquear utilizador     |
| DELETE | `/api/admin/utilizadores/{id}`          | Remover utilizador           |
| GET    | `/api/admin/publicacoes`                | Listar publicações (admin)   |
| DELETE | `/api/admin/publicacoes/{id}`           | Remover publicação           |
| GET    | `/api/admin/comentarios`                | Listar comentários (admin)   |
| DELETE | `/api/admin/comentarios/{id}`           | Remover comentário           |
| GET    | `/api/admin/denuncias`                  | Listar denúncias             |
| POST   | `/api/admin/denuncias/{id}/resolver`    | Resolver denúncia            |
| POST   | `/api/admin/denuncias/{id}/rejeitar`    | Rejeitar denúncia            |
| DELETE | `/api/admin/denuncias/{id}/conteudo`    | Remover conteúdo denunciado  |

---

## Funcionalidades

### Autenticação e Conta
- Login com email + senha
- Registo em 2 passos com validação de senha forte
- Verificação de unicidade de email/nome em tempo real
- Recuperação de senha por email
- Sessão persistente em localStorage
- Logout

### Publicações (Posts)
- Criar com texto, imagem, vídeo, emojis
- Feed com listagem cronológica
- Edição inline (texto + imagem, apenas dono)
- Eliminação com confirmação (apenas dono)
- Baze (like) com toggle optimista
- Repostar com confirmação
- Guardar (local, sem backend)
- Partilhar (Web Share API ou clipboard)
- Denunciar à moderação

### Comentários
- Criar comentários em publicações
- Responder a comentários
- Editar inline (apenas dono)
- Apagar (dono ou admin)
- Baze em comentários

### Seguir
- Seguir/deixar de seguir utilizadores
- Lista de seguidores e seguidos
- Notificação ao ser seguido
- Conta privada

### Notificações
- Lista com filtros (todas, bazes, comentários, seguidores, menções)
- Marcação individual como lida
- Contagem de não lidas
- Badge na sidebar de administração

### Mensagens Directas
- Lista de conversas com última mensagem
- Criar nova conversa (pesquisar utilizador)
- Enviar mensagens em tempo real
- Indicador de online

### Pesquisa e Descoberta
- Pesquisa global por utilizadores
- Explorar com separadores (tudo, pessoas, posts, tendências)
- Tópicos em alta (hardcoded)

### Perfil
- Foto de perfil e foto de capa (upload + preview)
- Bio, data de nascimento, género
- Separadores: publicações, multimédia, bazes
- Seguir/deixar seguir (perfil alheio)
- Denunciar utilizador

### Administração
- Dashboard com estatísticas (utilizadores, posts, comentários, bazes, denúncias)
- Gestão de utilizadores (bloquear/desbloquear/remover)
- Moderação de publicações e comentários
- Gestão de denúncias (resolver/rejeitar/remover conteúdo)
- Badge de denúncias pendentes na sidebar

### Definições
- Conta: nome, email, senha
- Notificações: toggles por tipo
- Privacidade: conta privada, mostrar email
- Aparência: modo escuro
- Idioma e região

### Experiência do Utilizador
- Modal global (confirmar/prompt/alertar)
- Modo escuro com persistência
- Transições de rota animadas (View Transitions API)
- Responsivo (mobile/desktop)
- Skeletons de carregamento
- Estados vazios com ícones
- Contadores de caracteres
- Indicador de força de senha
- Validação em tempo real

---

## Configuração do Ambiente

### Proxy

O `angular.json` faz proxy de `/api` para o backend Laravel:

```json
{
  "/api": { "target": "http://127.0.0.1:8000" }
}
```

### Ambientes

| Ficheiro           | Ambiente | `apiUrl`                              |
|--------------------|----------|----------------------------------------|
| `environment.ts`      | Dev      | `/api` (proxy)                         |
| `environment.prod.ts` | Produção | `https://api.nzolanet.app/api`         |

---

## Contas de Teste (seeded)

| Nome           | Email                  | Password    | Role           |
|----------------|------------------------|-------------|----------------|
| Administrador  | admin@nzolanet.app     | Admin123    | administrador  |
| Joao Silva     | joao@email.com         | 123456      | utilizador     |
| Maria Santos   | maria@email.com        | 123456      | utilizador     |

---

## Estado da Integração

| Funcionalidade          | Frontend | Backend |
|-------------------------|----------|---------|
| Autenticação (login/registo) | ✅    | ✅      |
| Publicações (CRUD)      | ✅       | ✅      |
| Edição inline de posts  | ✅       | ✅      |
| Comentários (CRUD)      | ✅       | ✅      |
| Bazes (likes)           | ✅       | ✅      |
| Seguir/Deixar seguir    | ✅       | ✅      |
| Notificações            | ✅       | ✅      |
| Foto de perfil          | ✅       | ✅      |
| Foto de capa            | ✅       | ✅      |
| Definições              | ✅       | ✅      |
| Mensagens directas      | ✅ (rota comentada) | ✅ |
| Denúncias               | ✅       | ✅      |
| Moderação admin         | ✅       | ✅      |
| Recuperação de senha    | ✅ (mock) | ⚠️ Pendente |
| Guardar publicação      | ⚠️ Local-only | ❌ |

---

## Testes

### Frontend
- Vitest com jsdom
- Especificações co-localizadas (`*.spec.ts`)
- `ng test` para executar

### Backend
- PHPUnit
- `php artisan test` para executar
