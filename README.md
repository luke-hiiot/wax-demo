# wax-demo

## Tailwind CSS v4 集成

1. 安装依赖（已在仓库中执行）：
   ```bash
   npm install
   ```
2. 构建或监听 CSS：
   ```bash
   # 单次构建（生产/预览）
   npm run build:css

   # 开发监听
   npm run dev:css
   ```
   Tailwind 入口文件位于 `static/css/input.css`，构建输出写入 `static/css/style.css`，供 Go 服务通过 `/static/css/style.css` 提供。
3. 启动示例服务器：
   ```bash
   go run ./cmd/main.go
   ```
4. 浏览 `http://localhost:3000`，可看到由 Tailwind Utility 样式化后的页面。修改 `views/*.tsx` 或 `static/css/input.css` 后，分别通过 WAX 的视图热重载与 Tailwind CLI 的 watch 立即生效。
