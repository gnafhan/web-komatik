<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://user-images.githubusercontent.com/9113740/201498864-2a900c64-d88f-4ed4-b5cf-770bcb57e1f5.png">
  <source media="(prefers-color-scheme: light)" srcset="https://user-images.githubusercontent.com/9113740/201498152-b171abb8-9225-487a-821c-6ff49ee48579.png">
</picture>

<div align="center"><strong>Next.js Admin Dashboard With Shadcn-ui</strong></div>
<div align="center">Built with the Next.js 15 App Router</div>
<br />
<div align="center">
<span>
</div>

## Overview



- Framework - [Next.js 15](https://nextjs.org/13)
- Language - [TypeScript](https://www.typescriptlang.org)
- Auth - [Clerk](https://go.clerk.com/ILdYhn7)
- Error tracking - [<picture><img alt="Sentry" src="public/assets/sentry.svg">
        </picture>](https://sentry.io/for/nextjs/?utm_source=github&utm_medium=paid-community&utm_campaign=general-fy26q2-nextjs&utm_content=github-banner-project-tryfree)
- Styling - [Tailwind CSS v4](https://tailwindcss.com)
- Components - [Shadcn-ui](https://ui.shadcn.com)
- Schema Validations - [Zod](https://zod.dev)
- State Management - [Zustand](https://zustand-demo.pmnd.rs)
- Search params state manager - [Nuqs](https://nuqs.47ng.com/)
- Tables - [Tanstack Data Tables](https://ui.shadcn.com/docs/components/data-table) • [Dice table](https://www.diceui.com/docs/components/data-table)
- Forms - [React Hook Form](https://ui.shadcn.com/docs/components/form)
- Command+k interface - [kbar](https://kbar.vercel.app/)
- Linting - [ESLint](https://eslint.org)
- Pre-commit Hooks - [Husky](https://typicode.github.io/husky/)
- Formatting - [Prettier](https://prettier.io)

_If you are looking for a Tanstack start dashboard template, here is the [repo](https://git.new/tanstack-start-dashboard)._

## Pages

| Pages                                                                                 | Specifications                                                                                                                                                                                                                                                          |
| :------------------------------------------------------------------------------------ | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Signup / Signin](https://go.clerk.com/ILdYhn7)      | Authentication with **Clerk** provides secure authentication and user management with multiple sign-in options including passwordless authentication, social logins, and enterprise SSO - all designed to enhance security while delivering a seamless user experience. |
| [Dashboard (Overview)](#)    | Cards with Recharts graphs for analytics. Parallel routes in the overview sections feature independent loading, error handling, and isolated component rendering. |
| [Product](#/product)         | Tanstack tables with server side searching, filter, pagination by Nuqs which is a Type-safe search params state manager in nextjs                                                                                                                                       |
| [Product/new](#/product/new) | A Product Form with shadcn form (react-hook-form + zod).                                                                                                                                                                                                                |
| [Profile](#/profile)         | Clerk's full-featured account management UI that allows users to manage their profile and security settings                                                                                                                                                             |
| [Kanban Board](#/kanban)     | A Drag n Drop task management board with dnd-kit and zustand to persist state locally.                                                                                                                                                                                  |
| [Not Found](#/notfound)      | Not Found Page Added in the root level                                                                                                                                                                                                                                  |
| [Global Error](https://sentry.io/for/nextjs/?utm_source=github&utm_medium=paid-community&utm_campaign=general-fy26q2-nextjs&utm_content=github-banner-project-tryfree)           | A centralized error page that captures and displays errors across the application. Integrated with **Sentry** to log errors, provide detailed reports, and enable replay functionality for better debugging. |

## Feature based organization

```plaintext
src/
├── app/ # Next.js App Router directory
│ ├── (auth)/ # Auth route group
│ │ ├── (signin)/
│ ├── (dashboard)/ # Dashboard route group
│ │ ├── layout.tsx
│ │ ├── loading.tsx
│ │ └── page.tsx
│ └── api/ # API routes
│
├── components/ # Shared components
│ ├── ui/ # UI components (buttons, inputs, etc.)
│ └── layout/ # Layout components (header, sidebar, etc.)
│
├── features/ # Feature-based modules
│ ├── feature/
│ │ ├── components/ # Feature-specific components
│ │ ├── actions/ # Server actions
│ │ ├── schemas/ # Form validation schemas
│ │ └── utils/ # Feature-specific utilities
│ │
├── lib/ # Core utilities and configurations
│ ├── auth/ # Auth configuration
│ ├── db/ # Database utilities
│ └── utils/ # Shared utilities
│
├── hooks/ # Custom hooks
│ └── use-debounce.ts
│
├── stores/ # Zustand stores
│ └── dashboard-store.ts
│
└── types/ # TypeScript types
└── index.ts
```

## Getting Started

> [!NOTE]  
> We are using **Next 15** with **React 19**, follow these steps:

Clone the repo:

```
git clone https://github.com/gnafhan/web-komatik.git
```

- `pnpm install` ( we have legacy-peer-deps=true added in the .npmrc)
- Create a `.env.local` file by copying the example environment file:
  `cp env.example.txt .env.local`
- Add the required environment variables to the `.env.local` file.
- `pnpm run dev`

##### Environment Configuration Setup

To configure the environment for this project, refer to the `env.example.txt` file. This file contains the necessary environment variables required for authentication and error tracking.

You should now be able to access the application at http://localhost:3000.

> [!WARNING]
> After cloning or forking the repository, be cautious when pulling or syncing with the latest changes, as this may result in breaking conflicts.

Cheers! 🥂

## Collaboration & Contribution Guidelines

### Commit Message Convention
- Use [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) for all commit messages.
- Prefix your commit with one of the following types:
  - `feat`: New feature
  - `fix`: Bug fix
  - `docs`: Documentation only changes
  - `chore`: Maintenance, build, or tooling changes
  - `refactor`: Code change that neither fixes a bug nor adds a feature
  - `test`: Adding or updating tests
  - `style`: Formatting, missing semi colons, etc; no code change
  - `perf`: Performance improvement
- Example:
  ```
  feat(auth): add OAuth login with Google
  fix(product): correct price calculation bug
  docs: update README with setup instructions
  ```

### Branch Naming Convention
- Use the format: `<devname>.<feature>`
- Example: `nafhan.auth`, `alex.product-listing`, `sarah.fix-login`
- Use short, descriptive feature names. Use hyphens for multi-word features: `john.product-table-fix`

### Pull Request (PR) Rules
- PR titles should be clear and reference the main change (e.g., `feat: add Kanban drag-and-drop`)
- Link related issues in the PR description if applicable.
- Provide a concise summary of changes and any special instructions for reviewers.
- Ensure all checks (CI, lint, tests) pass before requesting review.
- Assign at least one reviewer; self-merge is discouraged unless urgent.
- Use draft PRs for work-in-progress.

### General Collaboration Rules
- Sync with the latest `main` before starting new work.
- Keep PRs focused and as small as possible; large PRs should be split if feasible.
- Use code comments for complex logic or non-obvious decisions.
- Document new environment variables or configuration changes in the README.
- Discuss breaking changes or architectural decisions in issues before implementation.
- Be respectful and constructive in code reviews and discussions.

### Push/Pull Workflow

This project uses two main branches:
- **main**: Production branch (deploys to production)
- **dev**: Staging branch (for development and staging/testing)

> **All feature/fix branches must be merged into `dev`, _not_ `main`. Only maintainers should merge `dev` into `main` for production releases.**

#### Step-by-Step Workflow for Contributors
1. **Sync your local repository**
   - Make sure you have the latest `dev` branch:
     ```sh
     git checkout dev
     git pull origin dev
     ```
2. **Create your feature/fix branch**
   - Use the branch naming convention:
     ```sh
     git checkout -b <devname>.<feature>
     # Example: git checkout -b nafhan.auth
     ```
3. **Work on your changes**
   - Commit using the [conventional commit](#commit-message-convention) format.
4. **Sync with `dev` before pushing**
   - Before pushing, always pull the latest `dev` to avoid conflicts:
     ```sh
     git checkout dev
     git pull origin dev
     git checkout <your-branch>
     git merge dev
     # Resolve any conflicts if needed
     ```
5. **Push your branch**
   ```sh
   git push origin <your-branch>
   ```
6. **Open a Pull Request**
   - Target the `dev` branch (not `main`).
   - Fill out the PR template, link issues if applicable, and request review.

#### Maintainer Release Workflow
- Only maintainers should merge `dev` into `main` for production releases after all staging checks pass.

---
