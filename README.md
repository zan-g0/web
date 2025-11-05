
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
│  │  │  ├─ companyProfile.ts
│  │  │  ├─ contact.ts
│  │  │  ├─ job.ts
│  │  │  ├─ news.ts
│  │  │  ├─ product.ts
│  │  │  └─ tech.ts
│  │  └─ routes
│  │     ├─ aboutProfileImg.ts
│  │     ├─ banner.ts
│  │     ├─ companyInfo.ts
│  │     ├─ companyProfile.ts
│  │     ├─ contact.ts
│  │     ├─ index.ts
│  │     ├─ job.ts
│  │     ├─ news.ts
│  │     ├─ product.ts
│  │     └─ tech.ts
│  ├─ tsconfig.json
│  └─ uploads
│     └─ banners
├─ pure-admin-thin
│  ├─ .browserslistrc
│  ├─ .dockerignore
│  ├─ .editorconfig
│  ├─ .env
│  ├─ .env.development
│  ├─ .env.production
│  ├─ .env.staging
│  ├─ .husky
│  │  ├─ commit-msg
│  │  ├─ common.sh
│  │  ├─ pre-commit
│  │  └─ _
│  │     ├─ applypatch-msg
│  │     ├─ commit-msg
│  │     ├─ h
│  │     ├─ husky.sh
│  │     ├─ post-applypatch
│  │     ├─ post-checkout
│  │     ├─ post-commit
│  │     ├─ post-merge
│  │     ├─ post-rewrite
│  │     ├─ pre-applypatch
│  │     ├─ pre-auto-gc
│  │     ├─ pre-commit
│  │     ├─ pre-merge-commit
│  │     ├─ pre-push
│  │     ├─ pre-rebase
│  │     └─ prepare-commit-msg
│  ├─ .lintstagedrc
│  ├─ .markdownlint.json
│  ├─ .npmrc
│  ├─ .nvmrc
│  ├─ .prettierrc.js
│  ├─ .stylelintignore
│  ├─ build
│  │  ├─ cdn.ts
│  │  ├─ compress.ts
│  │  ├─ info.ts
│  │  ├─ optimize.ts
│  │  ├─ plugins.ts
│  │  └─ utils.ts
│  ├─ commitlint.config.js
│  ├─ Dockerfile
│  ├─ eslint.config.js
│  ├─ index.html
│  ├─ LICENSE
│  ├─ mock
│  │  ├─ asyncRoutes.ts
│  │  ├─ login.ts
│  │  └─ refreshToken.ts
│  ├─ package.json
│  ├─ pnpm-lock.yaml
│  ├─ postcss.config.js
│  ├─ public
│  │  ├─ favicon.ico
│  │  ├─ logo.svg
│  │  └─ platform-config.json
│  ├─ README.en-US.md
│  ├─ README.md
│  ├─ src
│  │  ├─ api
│  │  │  ├─ routes.ts
│  │  │  └─ user.ts
│  │  ├─ App.vue
│  │  ├─ assets
│  │  │  ├─ iconfont
│  │  │  │  ├─ iconfont.css
│  │  │  │  ├─ iconfont.js
│  │  │  │  ├─ iconfont.json
│  │  │  │  ├─ iconfont.ttf
│  │  │  │  ├─ iconfont.woff
│  │  │  │  └─ iconfont.woff2
│  │  │  ├─ login
│  │  │  │  ├─ avatar.svg
│  │  │  │  ├─ bg.png
│  │  │  │  └─ illustration.svg
│  │  │  ├─ status
│  │  │  │  ├─ 403.svg
│  │  │  │  ├─ 404.svg
│  │  │  │  └─ 500.svg
│  │  │  ├─ svg
│  │  │  │  ├─ back_top.svg
│  │  │  │  ├─ dark.svg
│  │  │  │  ├─ day.svg
│  │  │  │  ├─ enter_outlined.svg
│  │  │  │  ├─ exit_screen.svg
│  │  │  │  ├─ full_screen.svg
│  │  │  │  ├─ keyboard_esc.svg
│  │  │  │  └─ system.svg
│  │  │  ├─ table-bar
│  │  │  │  ├─ collapse.svg
│  │  │  │  ├─ drag.svg
│  │  │  │  ├─ expand.svg
│  │  │  │  ├─ refresh.svg
│  │  │  │  └─ settings.svg
│  │  │  └─ user.jpg
│  │  ├─ components
│  │  │  ├─ ReAuth
│  │  │  │  ├─ index.ts
│  │  │  │  └─ src
│  │  │  │     └─ auth.tsx
│  │  │  ├─ ReCol
│  │  │  │  └─ index.ts
│  │  │  ├─ ReDialog
│  │  │  │  ├─ index.ts
│  │  │  │  ├─ index.vue
│  │  │  │  └─ type.ts
│  │  │  ├─ ReIcon
│  │  │  │  ├─ index.ts
│  │  │  │  └─ src
│  │  │  │     ├─ hooks.ts
│  │  │  │     ├─ iconfont.ts
│  │  │  │     ├─ iconifyIconOffline.ts
│  │  │  │     ├─ iconifyIconOnline.ts
│  │  │  │     ├─ offlineIcon.ts
│  │  │  │     └─ types.ts
│  │  │  ├─ RePerms
│  │  │  │  ├─ index.ts
│  │  │  │  └─ src
│  │  │  │     └─ perms.tsx
│  │  │  ├─ RePureTableBar
│  │  │  │  ├─ index.ts
│  │  │  │  └─ src
│  │  │  │     └─ bar.tsx
│  │  │  ├─ ReSegmented
│  │  │  │  ├─ index.ts
│  │  │  │  └─ src
│  │  │  │     ├─ index.css
│  │  │  │     ├─ index.tsx
│  │  │  │     └─ type.ts
│  │  │  └─ ReText
│  │  │     ├─ index.ts
│  │  │     └─ src
│  │  │        └─ index.vue
│  │  ├─ config
│  │  │  └─ index.ts
│  │  ├─ directives
│  │  │  ├─ auth
│  │  │  │  └─ index.ts
│  │  │  ├─ copy
│  │  │  │  └─ index.ts
│  │  │  ├─ index.ts
│  │  │  ├─ longpress
│  │  │  │  └─ index.ts
│  │  │  ├─ optimize
│  │  │  │  └─ index.ts
│  │  │  ├─ perms
│  │  │  │  └─ index.ts
│  │  │  └─ ripple
│  │  │     ├─ index.scss
│  │  │     └─ index.ts
│  │  ├─ layout
│  │  │  ├─ components
│  │  │  │  ├─ lay-content
│  │  │  │  │  └─ index.vue
│  │  │  │  ├─ lay-footer
│  │  │  │  │  └─ index.vue
│  │  │  │  ├─ lay-frame
│  │  │  │  │  └─ index.vue
│  │  │  │  ├─ lay-navbar
│  │  │  │  │  └─ index.vue
│  │  │  │  ├─ lay-notice
│  │  │  │  │  ├─ components
│  │  │  │  │  │  ├─ NoticeItem.vue
│  │  │  │  │  │  └─ NoticeList.vue
│  │  │  │  │  ├─ data.ts
│  │  │  │  │  └─ index.vue
│  │  │  │  ├─ lay-panel
│  │  │  │  │  └─ index.vue
│  │  │  │  ├─ lay-search
│  │  │  │  │  ├─ components
│  │  │  │  │  │  ├─ SearchFooter.vue
│  │  │  │  │  │  ├─ SearchHistory.vue
│  │  │  │  │  │  ├─ SearchHistoryItem.vue
│  │  │  │  │  │  ├─ SearchModal.vue
│  │  │  │  │  │  └─ SearchResult.vue
│  │  │  │  │  ├─ index.vue
│  │  │  │  │  └─ types.ts
│  │  │  │  ├─ lay-setting
│  │  │  │  │  └─ index.vue
│  │  │  │  ├─ lay-sidebar
│  │  │  │  │  ├─ components
│  │  │  │  │  │  ├─ SidebarBreadCrumb.vue
│  │  │  │  │  │  ├─ SidebarCenterCollapse.vue
│  │  │  │  │  │  ├─ SidebarExtraIcon.vue
│  │  │  │  │  │  ├─ SidebarFullScreen.vue
│  │  │  │  │  │  ├─ SidebarItem.vue
│  │  │  │  │  │  ├─ SidebarLeftCollapse.vue
│  │  │  │  │  │  ├─ SidebarLinkItem.vue
│  │  │  │  │  │  ├─ SidebarLogo.vue
│  │  │  │  │  │  └─ SidebarTopCollapse.vue
│  │  │  │  │  ├─ NavHorizontal.vue
│  │  │  │  │  ├─ NavMix.vue
│  │  │  │  │  └─ NavVertical.vue
│  │  │  │  └─ lay-tag
│  │  │  │     ├─ components
│  │  │  │     │  └─ TagChrome.vue
│  │  │  │     ├─ index.scss
│  │  │  │     └─ index.vue
│  │  │  ├─ frame.vue
│  │  │  ├─ hooks
│  │  │  │  ├─ useBoolean.ts
│  │  │  │  ├─ useDataThemeChange.ts
│  │  │  │  ├─ useLayout.ts
│  │  │  │  ├─ useMultiFrame.ts
│  │  │  │  ├─ useNav.ts
│  │  │  │  └─ useTag.ts
│  │  │  ├─ index.vue
│  │  │  ├─ redirect.vue
│  │  │  └─ types.ts
│  │  ├─ main.ts
│  │  ├─ plugins
│  │  │  ├─ echarts.ts
│  │  │  └─ elementPlus.ts
│  │  ├─ router
│  │  │  ├─ index.ts
│  │  │  ├─ modules
│  │  │  │  ├─ error.ts
│  │  │  │  ├─ gsjs.ts
│  │  │  │  ├─ home.ts
│  │  │  │  └─ remaining.ts
│  │  │  └─ utils.ts
│  │  ├─ store
│  │  │  ├─ index.ts
│  │  │  ├─ modules
│  │  │  │  ├─ app.ts
│  │  │  │  ├─ epTheme.ts
│  │  │  │  ├─ multiTags.ts
│  │  │  │  ├─ permission.ts
│  │  │  │  ├─ settings.ts
│  │  │  │  └─ user.ts
│  │  │  ├─ types.ts
│  │  │  └─ utils.ts
│  │  ├─ style
│  │  │  ├─ dark.scss
│  │  │  ├─ element-plus.scss
│  │  │  ├─ index.scss
│  │  │  ├─ login.css
│  │  │  ├─ reset.scss
│  │  │  ├─ sidebar.scss
│  │  │  ├─ tailwind.css
│  │  │  ├─ theme.scss
│  │  │  └─ transition.scss
│  │  ├─ utils
│  │  │  ├─ auth.ts
│  │  │  ├─ globalPolyfills.ts
│  │  │  ├─ http
│  │  │  │  ├─ index.ts
│  │  │  │  └─ types.d.ts
│  │  │  ├─ localforage
│  │  │  │  ├─ index.ts
│  │  │  │  └─ types.d.ts
│  │  │  ├─ message.ts
│  │  │  ├─ mitt.ts
│  │  │  ├─ preventDefault.ts
│  │  │  ├─ print.ts
│  │  │  ├─ progress
│  │  │  │  └─ index.ts
│  │  │  ├─ propTypes.ts
│  │  │  ├─ responsive.ts
│  │  │  ├─ sso.ts
│  │  │  └─ tree.ts
│  │  └─ views
│  │     ├─ error
│  │     │  ├─ 403.vue
│  │     │  ├─ 404.vue
│  │     │  └─ 500.vue
│  │     ├─ gsjs
│  │     │  ├─ banner.vue
│  │     │  ├─ culture.vue
│  │     │  ├─ honnor.vue
│  │     │  └─ profile.vue
│  │     ├─ login
│  │     │  ├─ index.vue
│  │     │  └─ utils
│  │     │     ├─ motion.ts
│  │     │     ├─ rule.ts
│  │     │     └─ static.ts
│  │     ├─ permission
│  │     │  ├─ button
│  │     │  │  ├─ index.vue
│  │     │  │  └─ perms.vue
│  │     │  └─ page
│  │     │     └─ index.vue
│  │     └─ welcome
│  │        └─ index.vue
│  ├─ stylelint.config.js
│  ├─ tsconfig.json
│  ├─ types
│  │  ├─ directives.d.ts
│  │  ├─ global-components.d.ts
│  │  ├─ global.d.ts
│  │  ├─ index.d.ts
│  │  ├─ router.d.ts
│  │  ├─ shims-tsx.d.ts
│  │  └─ shims-vue.d.ts
│  └─ vite.config.ts
├─ README.md
├─ vue-project
│  ├─ components.d.ts
│  ├─ env.d.ts
│  ├─ index.html
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ public
│  │  ├─ favicon.ico
│  │  └─ images
│  │     ├─ door.png
│  │     ├─ product
│  │     │  ├─ 1.png
│  │     │  ├─ 2.png
│  │     │  ├─ 3.png
│  │     │  └─ 4.png
│  │     └─ tech
│  │        ├─ 1.jpg
│  │        ├─ 2.jpg
│  │        └─ tech_router.png
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
│  │  │  │  ├─ jieshao.jpg
│  │  │  │  ├─ kysl.jpg
│  │  │  │  ├─ qywh.png
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
└─ web.sql

```