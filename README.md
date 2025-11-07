# wax-demo

## Next.js 16 `src/` 模式对齐

- 视图与路由：使用 `src/app` 目录，程序启动时会自动扫描所有 `**/page.tsx` 并注册对应的 HTTP 路由（含动态段 `[id]`/`[...slug]`）。`layout.tsx` 对标 Next.js 根布局，`page.tsx` 作为 `/` 路由页面，可在 `src/components` 中共置 UI 组件。
- 静态资源：所有公共文件放在 `public/`，Gin 通过 `r.Static("/static", "./public")` 暴露整个目录，在页面中以 `/static/*` 访问（如 `/static/styles.css`）。
- Tailwind：入口文件为 `src/app/globals.css`，脚本会输出到 `public/styles.css` 并在 `layout.tsx` 中引用。
- 服务器：WAX 直接加载 `./src`，`cmd/main.go` 中的 `discoverRoutes` 会自动把 `src/app/**/page.tsx` 绑定到 Gin 路由；新增页面无需手动改 Go 代码，只需根据目录结构放置 `page.tsx`。

## 本地运行

1. 安装 Node 依赖：
   ```bash
   npm install
   ```
2. 构建或监听 CSS：
   ```bash
   # 单次构建
   npm run build:css

   # 开发监听
   npm run dev:css
   ```
3. 启动 Go 服务器：
   ```bash
   go run ./cmd/main.go
   ```
4. 访问 `http://localhost:3000`。修改 `src/app/**/*.tsx` 会被 WAX 热加载；`globals.css` 由 Tailwind CLI watch 后写入 `public/styles.css`，刷新即可看到最新样式。
