# NzolaNet — Frontend

Rede social moderna construída com **Angular 21.2**, **Signals**, **SSR** e **Bootstrap 5.3**.

---

## Stack

| Camada        | Tecnologia                              |
|---------------|-----------------------------------------|
| Framework     | Angular 21.2 (standalone components)    |
| Linguagem     | TypeScript 5.9 (strict)                 |
| State         | Signals (`signal`/`computed`/`effect`)  |
| SSR           | `@angular/ssr` + Express               |
| Testes        | Vitest via `@angular/build:unit`        |
| Estilos       | CSS + Bootstrap 5.3 + Bootstrap Icons   |
| Formatação    | Prettier (single quotes, printWidth 100)|

---

## Comandos

```sh
npm start           # ng serve (dev → http://localhost:4200, proxy :8000)
npm test            # ng test  (Vitest)
npm run build       # ng build (produção com SSR)
npm run watch       # ng build --watch --configuration development
npm run serve:ssr   # node dist/nzolanet/server/server.mjs (:4000)
npx prettier . --check   # verificar formatação
npx prettier . --write   # corrigir formatação
```

---

## Arquitectura

### Routing
- Rotas públicas (`guestGuard`): login, register, recuperar-senha, nova-senha
- Rotas protegidas (`authGuard`): tudo dentro do layout `AppShell` (topbar + sidebar fixos)
- Todas as páginas usam `loadComponent` (lazy loading)
- `withComponentInputBinding()` — parâmetros de rota (ex: `profile/:id`) ligados directamente a `@Input()`
- `withViewTransitions()` — transições animadas entre rotas

### Layouts
- `auth-layout` — páginas públicas (login/register), fundo gradiente, sem autenticação
- `app-shell` — páginas autenticadas (feed, profile, mensagens, etc.), inclui `Topbar`, `Sidebar`, `BottomNav` e `RightSidebar`
- `dashboard-layout` — (deprecated, a ser removido)

### Pages

| Rota               | Página               | Descrição                                      |
|--------------------|----------------------|------------------------------------------------|
| `/login`           | Login                | Autenticação com email + senha                 |
| `/register`        | Register             | Registo com validação de senha forte           |
| `/recuperar-senha` | RecuperarSenha       | Pedido de redefinição de senha                 |
| `/nova-senha/:token` | NovaSenha          | Redefinição de senha via token                 |
| `/feed`            | Feed                 | Feed principal com publicações                 |
| `/explorar`        | Explore              | Pesquisar utilizadores                         |
| `/post/:id`        | PostDetail           | Ver publicação individual + comentários        |
| `/profile`         | Profile              | Perfil do próprio utilizador (editar capa/avatar) |
| `/profile/:id`     | ProfileId            | Perfil de outro utilizador                     |
| `/mensagens`       | Mensagens            | Chat com mensagens directas                    |
| `/notifications`   | Notification         | Lista de notificações                          |
| `/guardados`       | Stored               | Publicações guardadas                          |
| `/sobre`           | Sobre                | Sobre o NzolaNet                               |
| `/termos`          | Termos               | Termos de serviço                              |
| `/settings`        | Settings             | Definições (conta, notificações, privacidade, aparência, idioma) |
| `/edit-profile`    | EditProfile          | Editar perfil                                  |
| `/404`             | NotFound             | Página não encontrada                          |

### Services

| Serviço                    | Responsabilidade                                    |
|----------------------------|-----------------------------------------------------|
| `AuthService`              | Login, registo, logout, sessão (token + localStorage) |
| `UserService`              | Perfil do utilizador logado (carregar, actualizar)  |
| `PostService`              | CRUD de publicações, bazes, guardar                 |
| `MockDataService`          | Dados mock para desenvolvimento (hardcoded)         |
| `SettingsService`          | Definições do utilizador                            |
| `LayoutService`            | Estado do layout (sidebar visível, etc.)            |
| `ModalService`             | Modal de confirmação/prompt/alert                   |
| `LocalStorageUserService`  | Operações mock em localStorage                      |

### Interceptors
- `authInterceptor` — anexa token Bearer a todas as requests; redirecciona para `/login` em 401
- `httpErrorInterceptor` — loga erros 500+ e de rede; re-lança excepção

### Componentes partilhados

| Componente        | Uso                                      |
|-------------------|------------------------------------------|
| `PostCard`        | Card de publicação (feed, perfis)        |
| `CreatePost`      | Formulário de nova publicação            |
| `SearchUser`      | Input de pesquisa com avatar + iniciais  |
| `RightSidebar`    | Sugestões de utilizadores + notificações |
| `Sidebar`         | Navegação lateral                        |
| `Topbar`          | Barra superior com pesquisa rápida       |
| `Modal`           | Modal reutilizável                       |

---

## Estilos e Tema

- Variáveis CSS definidas em `src/styles.css` (`:root`):
  - `--purple`, `--purple-light` — cor primária
  - `--border`, `--text`, `--text-muted`, `--text-sub` — cores de texto
  - `--topbar-h`, `--sidebar-w` — dimensões de layout
  - `--bg`, `--bg-body` — fundos
- Dark mode via classe `.dark-mode`
- Gradientes: linear-gradient(135deg, var(--purple), #8b5cf6)
- Bordas arredondadas consistentes (12px–28px)

---

## Backend

O frontend comunica com uma API Laravel 12 em `http://127.0.0.1:8000` via proxy configurado em `proxy.conf.json`:

```json
{
  "/api": { "target": "http://127.0.0.1:8000" }
}
```

### Estado actual da integração

| Funcionalidade       | Estado               |
|----------------------|----------------------|
| Autenticação         | ✅ API real           |
| Publicações (CRUD)   | ✅ API real           |
| Comentários          | ✅ API real           |
| Bazes (likes)        | ✅ API real           |
| Seguir/Deixar seguir | ✅ API real           |
| Notificações         | ✅ API real           |
| Chat (mensagens)     | ✅ API real           |
| Foto de perfil       | ✅ API real (base64)  |
| Foto de capa         | ✅ API real (base64)  |
| Definições           | ✅ API real           |
| Guardar publicação   | ⚠️ Pendente           |
| Denúncias            | ⚠️ Pendente           |

---

## Contas de teste (mock localStorage)

| Email                 | Senha      |
|-----------------------|------------|
| joao@email.com        | 123456     |
| maria@email.com       | 123456     |
| admin@nzolanet.app    | Admin123   |
| teste@nzolanet.app    | Teste123   |

---

## Testes

- Vitest com jsdom
- Especificações co-localizadas (`*.spec.ts`)
- `ng test` para executar
