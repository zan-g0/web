# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Start development server**: `pnpm dev`
- **Build for production**: `pnpm build`
- **Build for staging environment**: `pnpm build:staging`
- **Run production preview**: `pnpm preview:build`
- **Run type checking**: `pnpm typecheck`
- **Run all linters**: `pnpm lint`
- **Run ESLint only**: `pnpm lint:eslint`
- **Run Prettier only**: `pnpm lint:prettier`
- **Run Stylelint only**: `pnpm lint:stylelint`
- **Clean cache and reinstall dependencies**: `pnpm clean:cache`
- **Optimize SVGs**: `pnpm svgo`

## Code Architecture

This is a Vue 3 + Vite + TypeScript application using Element Plus for UI components. The architecture follows a standard Vue 3 project structure:

- `src/`: Main source code
  - `views/`: Page components (route components)
  - `components/`: Reusable UI components
  - `layouts/`: Page layout components
  - `router/`: Vue Router configuration
  - `stores/`: Pinia state management stores
  - `utils/`: Utility functions and helpers
  - `assets/`: Static assets (images, styles)
  - `mock/`: Mock API data for development
- `public/`: Static files served directly
- `build/`: Vite build configuration
- `types/`: TypeScript type definitions

## Development Workflow

1. **Start development**: Run `pnpm dev` to start the Vite development server
2. **Linting**: All code changes are automatically linted via husky pre-commit hooks that run:
   - ESLint for JavaScript/TypeScript code
   - Prettier for code formatting
   - Stylelint for CSS/SCSS styling
3. **Commit messages**: Must follow conventional commits format:
   - Types: feat, fix, perf, style, docs, test, refactor, build, ci, chore, revert, wip, workflow, types, release
   - Maximum 108 characters for header
   - Body and footer must have blank lines before them
4. **Testing**: The project includes mock API data in the `mock/` directory for frontend testing
5. **Build optimization**: Production builds use:
   - Brotli compression (configurable via VITE_COMPRESSION)
   - CDN for external libraries (configurable via VITE_CDN)
   - Chunk splitting for better caching

## Environment Configuration

Environment variables are managed via .env files:
- `.env`: Base environment variables
- `.env.development`: Development environment variables
- `.env.staging`: Staging environment variables
- `.env.production`: Production environment variables

The Vite configuration reads these variables and applies them to the build process.

## Key Dependencies

- **Vue 3**: Core framework
- **Vite**: Build tool and development server
- **Pinia**: State management
- **Vue Router**: Routing
- **Element Plus**: UI component library
- **TypeScript**: Static typing
- **ESLint + Prettier + Stylelint**: Code quality and formatting
- **Husky + lint-staged**: Pre-commit hooks
- **Commitlint**: Commit message validation

## Important Notes

- This is a "lite" version of vue-pure-admin and does not accept issues or PRs. For feature requests or bug reports, please use the main repository at https://github.com/pure-admin/vue-pure-admin/issues
- The project uses pnpm as the package manager
- Node.js version should be ^20.19.0 || >=22.12.0
- The development server runs on port 3000 by default (configurable via VITE_PORT)
- API requests are proxied to http://localhost:3000/api via Vite's proxy configuration
- SVG icons are optimized via svgo during build
- Source maps are disabled in production builds for smaller bundle size
- The build output is optimized with chunk splitting and hashed filenames for better caching

## Debugging

For debugging production issues:
1. Check the browser console for errors
2. Use the Network tab to verify API calls are properly proxied
3. Check the Vue DevTools extension for component state
4. Enable source maps temporarily in vite.config.ts if needed

## Performance Optimization

- Enable Brotli compression in production via VITE_COMPRESSION=true
- Use CDN for external libraries via VITE_CDN=true
- Minimize bundle size by avoiding unnecessary imports
- Use lazy loading for routes and components
- Optimize images and SVGs with svgo

## Testing

The project includes a mock API server via `vite-plugin-fake-server` for frontend testing. Mock data is located in the `mock/` directory.