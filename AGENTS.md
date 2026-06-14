# NzolaNet — AGENTS.md

## Stack

Angular 21.2 standalone components + Signals + SPA.
Vitest via `@angular/build:unit-test`, jsdom. TypeScript 5.9 strict. Prettier (no ESLint).

## Commands

```sh
npm start          # ng serve (dev, http://localhost:4200)
npm test           # ng test  (Vitest)
npm run build      # ng build (production → dist/nzolanet/browser/)
npm run watch      # ng build --watch --configuration development
npx prettier . --check    # format check (single quotes, 100 width)
npx prettier . --write    # format fix
```

## Architecture

- **Entrypoints**: `src/main.ts` (browser bootstrap)
- **Routing**: lazy-loaded standalone pages in `src/app/pages/`. Two guard groups: `guestGuard` (login/register) and `authGuard` (everything else inside `AppShell` layout). All routes use `loadComponent`.
- **Layouts**: `auth-layout` (public), `app-shell` (topbar+sidebar+botton-nav, authenticated).
- **Routing transitions**: `withViewTransitions()` enabled in `app.config.ts` — no manual CSS keyframe animations needed.
- **Interceptors**: `authInterceptor` (Bearer token + 401 → logout) and `httpErrorInterceptor` (logs 500s/network errors, rethrows).
- **State**: Signals in services (`signal`/`computed`/`asReadonly()`). Inject via `inject()` in guards/interceptors, constructor DI in components.
- **CSS variables** defined in `src/styles.css` (`:root`) — `--purple`, `--purple-light`, `--border`, `--text`, `--text-muted`, `--text-sub`, `--topbar-h`, `--sidebar-w`. Dark mode classes (`.dark-mode`) also there.

## Style conventions

- Standalone components only (`standalone: true`, no NgModule)
- `readonly` in constructor for services exposed to templates
- `@Input({ required: true })` for required inputs
- CSS files (no SCSS). Bootstrap 5.3 + Bootstrap Icons pre-loaded in `angular.json` styles
- Prettier: single quotes, printWidth 100, `angular` parser for HTML
- `.editorconfig`: 2-space indent, UTF-8, single quotes for TS
- Portuguese comments and i18n strings; mixed PT/EN identifiers (`senha`, `nome`, `foto_perfil`)

## Mock backend (current state)

`AuthService.backendDisponivel()` always returns `false`. All data lives in `localStorage`:
- Login users via `AuthService` reads from `nzolanet_users` key
- Registration/update via `LocalStorageUserService` under `nzolanet_utilizadores`
- `MockDataService` provides hardcoded posts, notifications, suggestions

**Test accounts** (all use mock localStorage):
- `joao@email.com` / `123456`
- `maria@email.com` / `123456`
- `admin@nzolanet.app` / `Admin123`
- `teste@nzolanet.app` / `Teste123`

Future backend is Laravel at `https://api.nzolanet.app/api`. TODO comments mark every place that needs swapping from mock to HTTP.

## Testing

Vitest runner (`ng test`). Spec files co-located with components as `*.spec.ts`. Tests use `TestBed.configureTestingModule`.
