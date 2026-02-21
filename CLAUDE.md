# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Frontend (Vue.js)
- Run development server: `cd vue-project && npm run dev`
- Build for production: `cd vue-project && npm run build`
- Type check: `cd vue-project && npm run type-check`
- Preview production build: `cd vue-project && npm run preview`

### Backend (Node.js)
- Run in development mode: `cd node-api && npm run dev`
- Build TypeScript: `cd node-api && npm run build`
- Run production server: `cd node-api && npm start`

## Code Architecture

This repository follows a frontend-backend separation pattern:

### Frontend (vue-project)
- Vue 3 application using Vite as build tool
- Uses Element Plus for UI components
- Implements Tailwind CSS for styling
- Uses DaisyUI for additional UI components
- Communicates with backend API via axios

### Backend (node-api)
- Node.js Express server with TypeScript
- Uses MySQL for database operations
- Handles file uploads with multer
- Provides REST API endpoints for frontend consumption

### UI Component Library
- Uses pure-admin-thin as the UI framework
- Pure-admin-thin is a lightweight admin template based on Element Plus
- Includes pre-built components for common admin panel patterns

## Key Directories

- `vue-project/`: Vue.js frontend application
- `node-api/`: Node.js backend API server
- `pure-admin-thin/`: UI component library used by frontend
- `web.sql`: Database schema definition

## Development Workflow

1. Start backend server: `cd node-api && npm run dev`
2. Start frontend server: `cd vue-project && npm run dev`
3. Database schema can be imported from web.sql
4. Backend API endpoints are available at http://localhost:3000/api
5. Frontend is accessible at http://localhost:5173

Note: The pure-admin-thin library is a dependency and should not be modified directly. Any customizations should be done in the vue-project directory.