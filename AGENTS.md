# AGENTS.md — Architectural Guidelines & Standards

This document defines the permanent architectural rules, coding standards, folder conventions, state management rules, API rules, and RBAC policies for the **Wadi Al-Ain Organization System**.

---

## 1. Architectural Philosophy

1. **Feature-Based Architecture (FBA):**
   * Code is organized by domain in `src/features/<feature-name>`.
   * Global cross-cutting code lives strictly in:
     * `src/app/`: Application-level routing, providers, and global stores (`store/`).
     * `src/components/`: Reusable presentation primitives (`ui/`) and structural layouts (`layout/`).
     * `src/lib/`: Global utilities (`utils.ts`) and API client (`api-client.ts`).
     * `src/hooks/`: Global custom hooks (`useAuth.ts`, `usePermission.ts`).
     * `src/constants/`: Immutable system constants (`roles.ts`, `permissions.ts`, `routes.ts`).
     * `src/types/`: Core TypeScript interfaces (`user.ts`).
     * `src/styles/`: Global Tailwind CSS and fonts.

2. **Clean Code & Separation of Concerns:**
   * **Presentation Layer:** Views and components focus solely on UI and user events.
   * **Hook Layer:** TanStack Query hooks mediate all data retrieval and mutations. `useAuth` and `usePermission` provide authentication and authorization.
   * **Client Layer:** Centralized Axios client lives in `src/lib/api-client.ts`.
   * **Store Layer:** All global stores live in `src/app/store/` (e.g. `src/app/store/auth.store.ts`).

3. **Unidirectional Data Flow:**
   $$\text{Page / View} \longrightarrow \text{Query / Mutation Hook} \longrightarrow \text{API Client} \longrightarrow \text{Backend}$$

---

## 2. Directory Structure Conventions

```
src/
├── app/
│   ├── pages/            # Global app pages (Unauthorized.tsx, ErrorState.tsx)
│   ├── providers/        # AppProviders.tsx (QueryClient, Toaster)
│   ├── router/           # React Router v7 configuration (index.tsx, guards.tsx)
│   └── store/            # Global Zustand stores (auth.store.ts with persist)
├── components/
│   ├── layout/           # Global layouts (PublicLayout, PublicHeader, PublicFooter, DashboardLayout, DashboardNavbar, DashboardSideBar)
│   └── ui/               # Reusable Shadcn UI primitives (button.tsx, card.tsx)
├── constants/            # Immutable declarations (roles.ts, permissions.ts, routes.ts)
├── features/
│   ├── auth/             # AuthPage.tsx (minimal mock authentication)
│   ├── landing/          # LandingPage.tsx
│   ├── main/             # MainPage.tsx
│   └── settings/         # SettingsPage.tsx
├── hooks/                # Global custom React hooks (useAuth.ts, usePermission.ts)
├── lib/                  # Utilities (utils.ts), Axios client (api-client.ts)
├── styles/               # Global CSS, Tailwind v4 theme, font imports (globals.css)
├── types/                # Core TypeScript interfaces (user.ts)
└── main.tsx              # Application entry point
```

---

## 3. Simplified Authentication & Session Management

1. **One Zustand Auth Store (`src/app/store/auth.store.ts`):**
   * Uses Zustand with `persist` middleware and `localStorage`.
   * Manages only: `user`, `token`, `setUser(user, token?)`, and `logout()`.
   * `isAuthenticated` is NOT stored separately; it is derived as `Boolean(user)`.
   * Automatically restored from storage on page refresh.

2. **One Global `useAuth` Hook (`src/hooks/useAuth.ts`):**
   * The single entry point for components to access authentication state:
     ```ts
     const { user, token, isAuthenticated, setUser, logout } = useAuth();
     ```
   * Components never read or write `localStorage` or Zustand store internals directly.

---

## 4. Simplified Role-Based Access Control (RBAC)

1. **One Roles File (`src/constants/roles.ts`):**
   * Defines the 4 system roles:
     * `ADMIN`
     * `MANAGER`
     * `DATA_ENTRY`
     * `USER`
   * Exports `ROLES`, `Role` type, and `ROLE_LABELS`.

2. **One Permissions File (`src/constants/permissions.ts`):**
   * Defines standard actions (`ACTIONS`):
     * `VIEW_MAIN`
     * `CREATE`
     * `UPDATE`
     * `DELETE`
     * `VIEW_SETTINGS`
   * Exports `ACTIONS`, `Action` type, and `PERMISSIONS` matrix (Action $\rightarrow$ Roles[]):
     * `VIEW_MAIN`: `[ADMIN, MANAGER, DATA_ENTRY]`
     * `CREATE`: `[ADMIN, MANAGER, DATA_ENTRY]`
     * `UPDATE`: `[ADMIN, MANAGER]`
     * `DELETE`: `[ADMIN]`
     * `VIEW_SETTINGS`: `[ADMIN, MANAGER, DATA_ENTRY, USER]`

3. **One Global `usePermission` Hook (`src/hooks/usePermission.ts`):**
   * Reads current user from `useAuth()`.
   * Validates whether user's role is included in `PERMISSIONS[action]`:
     ```ts
     const canDelete = usePermission(ACTIONS.DELETE);
     ```

---

## 5. Routing & Route Protection

* **Centralized Routes (`src/constants/routes.ts`):** Single source of truth.
* **Route Guards (`src/app/router/guards.tsx`):**
  * `ProtectedRoute`: Redirects unauthenticated users to `/auth`. Enforces role requirements when `allowedRoles` are specified.
  * `PublicRoute`: Redirects already-authenticated users to `/dashboard`.
  * Logout flow: Clears store via `logout()` and redirects to `/`.

---

## 6. Coding Standards & TypeScript Rules

* Strict mode is mandatory. Avoid `any` at all times.
* Use `as const` objects instead of TypeScript `enum`.
* Use named exports for components and hooks.
* ESLint rules must not be disabled to hide design flaws.
