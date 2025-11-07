# wax-demo

## Next.js 16 `src/` 模式对齐

- 视图与路由：使用 `src/app` 目录，`layout.tsx` 对标 Next.js 根布局，`page.tsx` 作为 `/` 路由页面。可在 `src/components` 中共置 UI 组件。
- 静态资源：所有公共文件放在 `public/`，Gin 通过 `/styles.css` 暴露 Tailwind 产物，语义上对应 Next.js `public/styles.css`。
- Tailwind：入口文件为 `src/app/globals.css`，脚本会输出到 `public/styles.css` 并在 `layout.tsx` 中引用。
- 服务器：WAX 直接加载 `./src/app`，因此新增路由时仅需按 Next.js 目录层级新增 `page.tsx` 文件并在 `renderer.Render` 中指定同名视图。

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
