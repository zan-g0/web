# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Project Structure
- Main frontend application: `pure-admin-thin` (Vue 3 + Vite + Element Plus)
- Secondary project: `vue-project` (Vue 3 + Vite + Bootstrap Vue)
- Backend API: `node-api` (Node.js)

### Common Development Commands

**Start development server:**
```bash
pnpm dev
```

**Build for production:**
```bash
pnpm build
```

**Build for staging environment:**
```bash
pnpm build:staging
```

**Run build analysis (generates report.html):**
```bash
pnpm report
```

**Preview production build:**
```bash
pnpm preview:build
```

**Lint and format code (all files):**
```bash
pnpm lint
```

**Lint JavaScript/TypeScript only:**
```bash
pnpm lint:eslint
```

**Format code with Prettier:**
```bash
pnpm lint:prettier
```

**Format CSS/SCSS with Stylelint:**
```bash
pnpm lint:stylelint
```

**Type check (TypeScript):**
```bash
pnpm typecheck
```

**Clean cache and reinstall dependencies:**
```bash
pnpm clean:cache
```

### Code Quality & Style

**ESLint Configuration:**
- Enforces JavaScript/TypeScript best practices
- Uses `eslint-config-prettier` to disable rules that conflict with Prettier
- Configured for Vue 3 with TypeScript
- Ignores generated files in `dist/`, `public/`, and `src/assets/`

**Prettier Configuration:**
- Standard formatting for all code files
- Configured to use `auto` end-of-line style
- Applied to: `.js`, `.ts`, `.vue`, `.json`, `.css`, `.scss`, `.html`, `.md`

**Stylelint Configuration:**
- Enforces CSS/SCSS styling rules
- Extends `stylelint-config-standard` and `stylelint-config-recess-order`
- Supports Tailwind CSS directives (`@tailwind`, `@apply`, etc.)
- Supports SCSS syntax
- Uses `order/order` rule to organize CSS properties in a consistent order

**Commit Message Standards:**
- Uses conventional commits format
- Supported types: feat, fix, perf, style, docs, test, refactor, build, ci, chore, revert, wip, workflow, types, release
- Commit message header limit: 108 characters
- Body and footer must have blank lines before them

### Project Architecture

**Frontend (pure-admin-thin):**
- Framework: Vue 3 with Composition API
- State Management: Pinia
- Routing: Vue Router
- UI Library: Element Plus
- Build Tool: Vite
- CSS Framework: Tailwind CSS

**Key Directories:**
- `src/api/`: API service definitions (axios wrappers)
- `src/router/`: Application routing configuration
- `src/store/`: Pinia state management modules
- `src/layout/`: Layout components and hooks
- `src/directives/`: Custom Vue directives
- `src/utils/`: Utility functions and helpers
- `mock/`: Mock API responses for development

**Vite Configuration Highlights:**
- Development server runs on port 5173 (default)
- API proxy configured for `/api` to forward to `http://localhost:3000`
- SVG files are loaded as Vue components
- Icons are automatically imported from Iconify
- Production build has chunk size warning limit of 4000KB
- Static assets are bundled into `static/` directory with hash-based filenames

**Mock API Setup:**
- Uses `vite-plugin-fake-server` for client-side API mocking
- Mocks login and async routes endpoints
- Simulates different user roles (admin/common) with corresponding permissions
- Routes are dynamically generated based on user roles

**Build Optimization:**
- Production builds include compression plugin (gzip/brotli)
- Console statements are removed in production builds
- CDN support can be enabled via environment variable
- Visualizer plugin generates bundle analysis report when running `pnpm report`

**Testing:**
- No test framework is configured in this project
- Mock API responses can be used for component testing
- Type checking is performed during build with `vue-tsc`

### Development Workflow

1. Start development server: `pnpm dev`
2. Make changes to source files in `src/`
3. Changes are hot-reloaded automatically
4. Run `pnpm lint` before committing to ensure code quality
5. Commit messages must follow conventional commits format
6. Build for production with `pnpm build`
7. Generate bundle analysis with `pnpm report` for optimization

### Important Notes

- This is a non-internationalized version of vue-pure-admin
- The project uses pnpm as the package manager
- Node.js version must be ^20.19.0 || >=22.12.0
- The project does not accept issues or PRs - report problems to the full version at https://github.com/pure-admin/vue-pure-admin/issues

### Environment Variables

- `VITE_CDN`: Enable CDN for external libraries (true/false)
- `VITE_PORT`: Development server port (default: 5173)
- `VITE_COMPRESSION`: Enable compression (true/false)
- `VITE_PUBLIC_PATH`: Base path for assets (default: "/")

### Build Output

- Production build output: `dist/`
- Bundle analysis report: `report.html` (generated with `pnpm report`)
- Static assets are bundled into `static/js/`, `static/css/`, and `static/media/` directories

### Debugging

- Use `code-inspector-plugin` to inspect DOM elements and jump to source code
- Press `Alt+Shift` (Windows) or `Option+Shift` (Mac) while hovering over elements in development mode
- The plugin will highlight elements and open the corresponding source file in your IDE

### Performance Optimization

- Enable `VITE_CDN=true` to load libraries from CDN instead of bundling
- Use `VITE_COMPRESSION=true` to enable gzip/brotli compression
- Run `pnpm report` to analyze bundle size and identify large dependencies
- Consider using `vite-plugin-remove-console` to remove console statements in production

### Dependencies

**Core Dependencies:**
- Vue 3
- Vue Router 4
- Pinia
- Element Plus
- Axios
- Vite
- Tailwind CSS
- TypeScript

**Development Dependencies:**
- ESLint with TypeScript and Vue plugins
- Prettier
- Stylelint with SCSS support
- Husky for git hooks
- Commitlint for commit message validation
- Vite plugins for SVG, Icons, Compression, Fake Server, etc.