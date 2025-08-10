
```
web
├─ node-api
│  ├─ package-lock.json
│  ├─ package.json
│  └─ tsconfig.json
├─ vue-project
│  ├─ components.d.ts
│  ├─ env.d.ts
│  ├─ index.html
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ public
│  │  └─ favicon.ico
│  ├─ README.md
│  ├─ src
│  │  ├─ App.vue
│  │  ├─ assets
│  │  │  ├─ base.css
│  │  │  ├─ images
│  │  │  │  ├─ about
│  │  │  │  │  ├─ dl1.jpg
│  │  │  │  │  ├─ dl2.jpg
│  │  │  │  │  ├─ fcbg.jpg
│  │  │  │  │  ├─ gs1.png
│  │  │  │  │  ├─ ry1.jpg
│  │  │  │  │  ├─ ry2.jpg
│  │  │  │  │  ├─ ry3.jpg
│  │  │  │  │  ├─ ry4.jpg
│  │  │  │  │  ├─ wh1.png
│  │  │  │  │  ├─ wh2.png
│  │  │  │  │  ├─ wh3.png
│  │  │  │  │  ├─ wh4.png
│  │  │  │  │  ├─ wh5.png
│  │  │  │  │  ├─ wh6.png
│  │  │  │  │  └─ wh7.png
│  │  │  │  ├─ banner
│  │  │  │  │  ├─ banner1.jpg
│  │  │  │  │  └─ banner2.jpg
│  │  │  │  ├─ door.png
│  │  │  │  ├─ jieshao.jpg
│  │  │  │  ├─ js
│  │  │  │  │  ├─ amap.js
│  │  │  │  │  ├─ banner-list.json
│  │  │  │  │  ├─ banner.js
│  │  │  │  │  ├─ map.js
│  │  │  │  │  └─ showsection.js
│  │  │  │  ├─ kysl.jpg
│  │  │  │  ├─ product
│  │  │  │  │  ├─ 1.png
│  │  │  │  │  ├─ 2.png
│  │  │  │  │  ├─ 3.png
│  │  │  │  │  └─ 4.png
│  │  │  │  ├─ qywh.png
│  │  │  │  ├─ tech
│  │  │  │  │  ├─ 1.jpg
│  │  │  │  │  ├─ 2.jpg
│  │  │  │  │  └─ tech_router.png
│  │  │  │  └─ ymbg.jpg
│  │  │  ├─ logo.svg
│  │  │  └─ main.css
│  │  ├─ components
│  │  │  ├─ banner.vue
│  │  │  ├─ Footer.vue
│  │  │  ├─ icons
│  │  │  │  ├─ IconCommunity.vue
│  │  │  │  ├─ IconDocumentation.vue
│  │  │  │  ├─ IconEcosystem.vue
│  │  │  │  ├─ IconSupport.vue
│  │  │  │  └─ IconTooling.vue
│  │  │  ├─ NavBar.vue
│  │  │  ├─ TheWelcome.vue
│  │  │  └─ WelcomeItem.vue
│  │  ├─ main.ts
│  │  ├─ pages
│  │  │  ├─ about.vue
│  │  │  ├─ contact.vue
│  │  │  ├─ job.vue
│  │  │  ├─ news.vue
│  │  │  ├─ product.vue
│  │  │  └─ tech.vue
│  │  └─ views
│  │     ├─ AboutView.vue
│  │     └─ HomeView.vue
│  ├─ tsconfig.app.json
│  ├─ tsconfig.json
│  ├─ tsconfig.node.json
│  └─ vite.config.ts
├─ web.sql
└─ 数据库ER图.png

```
```
web
├─ node-api
│  ├─ .env
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ src
│  │  ├─ app.ts
│  │  ├─ config
│  │  │  └─ db.ts
│  │  ├─ controllers
│  │  │  ├─ aboutProfileImg.ts
│  │  │  ├─ banner.ts
│  │  │  ├─ companyInfo.ts
│  │  │  └─ companyProfile.ts
│  │  └─ routes
│  │     ├─ aboutProfileImg.ts
│  │     ├─ banner.ts
│  │     ├─ companyInfo.ts
│  │     ├─ companyProfile.ts
│  │     └─ index.ts
│  └─ tsconfig.json
├─ README.md
├─ vue-project
│  ├─ components.d.ts
│  ├─ env.d.ts
│  ├─ index.html
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ public
│  │  └─ favicon.ico
│  ├─ README.md
│  ├─ src
│  │  ├─ App.vue
│  │  ├─ assets
│  │  │  ├─ base.css
│  │  │  ├─ images
│  │  │  │  ├─ about
│  │  │  │  │  ├─ dl1.jpg
│  │  │  │  │  ├─ dl2.jpg
│  │  │  │  │  ├─ fcbg.jpg
│  │  │  │  │  ├─ gs1.png
│  │  │  │  │  ├─ ry1.jpg
│  │  │  │  │  ├─ ry2.jpg
│  │  │  │  │  ├─ ry3.jpg
│  │  │  │  │  ├─ ry4.jpg
│  │  │  │  │  ├─ wh1.png
│  │  │  │  │  ├─ wh2.png
│  │  │  │  │  ├─ wh3.png
│  │  │  │  │  ├─ wh4.png
│  │  │  │  │  ├─ wh5.png
│  │  │  │  │  ├─ wh6.png
│  │  │  │  │  └─ wh7.png
│  │  │  │  ├─ banner
│  │  │  │  │  ├─ banner1.jpg
│  │  │  │  │  ├─ banner2.jpg
│  │  │  │  │  └─ banner3.jpg
│  │  │  │  ├─ door.png
│  │  │  │  ├─ jieshao.jpg
│  │  │  │  ├─ kysl.jpg
│  │  │  │  ├─ product
│  │  │  │  │  ├─ 1.png
│  │  │  │  │  ├─ 2.png
│  │  │  │  │  ├─ 3.png
│  │  │  │  │  └─ 4.png
│  │  │  │  ├─ qywh.png
│  │  │  │  ├─ tech
│  │  │  │  │  ├─ 1.jpg
│  │  │  │  │  ├─ 2.jpg
│  │  │  │  │  └─ tech_router.png
│  │  │  │  └─ ymbg.jpg
│  │  │  ├─ logo.svg
│  │  │  └─ main.css
│  │  ├─ components
│  │  │  ├─ banner.vue
│  │  │  ├─ Footer.vue
│  │  │  ├─ icons
│  │  │  │  ├─ IconCommunity.vue
│  │  │  │  ├─ IconDocumentation.vue
│  │  │  │  ├─ IconEcosystem.vue
│  │  │  │  ├─ IconSupport.vue
│  │  │  │  └─ IconTooling.vue
│  │  │  ├─ NavBar.vue
│  │  │  ├─ TheWelcome.vue
│  │  │  └─ WelcomeItem.vue
│  │  ├─ main.ts
│  │  ├─ pages
│  │  │  ├─ about.vue
│  │  │  ├─ contact.vue
│  │  │  ├─ job.vue
│  │  │  ├─ news.vue
│  │  │  ├─ product.vue
│  │  │  └─ tech.vue
│  │  └─ views
│  │     ├─ AboutView.vue
│  │     └─ HomeView.vue
│  ├─ tsconfig.app.json
│  ├─ tsconfig.json
│  ├─ tsconfig.node.json
│  └─ vite.config.ts
├─ web.sql
└─ 数据库ER图.png

```