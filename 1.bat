@echo off
cd .\node-api
npm run dev
cd ..\vue-project  
npm run dev
cd ..\pure-admin-thin
pnpm dev
