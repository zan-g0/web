# Repository Guidelines

## Project Structure & Module Organization

This web repository contains three main projects:

- `node-api/` - Express.js backend API with TypeScript
- `pure-admin-thin/` - Vue 3 admin dashboard with Element Plus
- `vue-project/` - Vue 3 frontend application with Bootstrap

Each project has its own `src/` directory containing source code, `package.json` for dependencies, and project-specific configuration files. The root directory also contains `web.sql` for database schema.

## Build, Test, and Development Commands

**Node API (Backend):**
- `npm run dev` - Start development server with hot reload using nodemon
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Run production build

**Pure Admin Thin (Admin Dashboard):**
- `pnpm dev` - Start development server with Vite
- `pnpm build` - Build for production
- `pnpm typecheck` - Run TypeScript type checking
- `pnpm lint` - Run ESLint, Prettier, and Stylelint

**Vue Project (Frontend):**
- `npm run dev` - Start development server with Vite
- `npm run build` - Build for production
- `npm run type-check` - Run TypeScript type checking

## Coding Style & Naming Conventions

- Use TypeScript throughout all projects
- Prettier configuration: double quotes, no trailing commas, arrow parentheses avoided
- ESLint enforces consistent code quality and style
- Node.js API uses CommonJS modules, Vue projects use ES modules
- Import paths use `@/*` alias for src directory
- File names use kebab-case for components and camelCase for utilities

## Testing Guidelines

- No explicit test frameworks detected in current setup
- Type checking serves as primary validation: `pnpm typecheck` for admin, `npm run type-check` for frontend
- Consider adding Jest/Vitest for unit tests in future development

## Commit & Pull Request Guidelines

- Use conventional commits: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`
- Commit messages should be concise and descriptive (observed bilingual commits)
- Admin project enforces commit message format with commitlint
- Maximum header length: 108 characters
- Types include: `feat`, `fix`, `perf`, `style`, `docs`, `test`, `refactor`, `build`, `ci`, `chore`, `revert`, `wip`, `workflow`, `types`, `release`
- Use apply patch to modify the file