# 档案终端放在 /lab/

RhineLabUI 是完整的三维档案终端（TypeScript、Three.js、Vite），不是组件包，也不是舞台仓库里的那套开场。所以把它整页放在 `/lab/`，不并进 `/stage/`。

- 运动、玻璃、模型和开场字形保持上游 `12cc5e4`。开场词仍是 RHINE LAB。
- 只改 `content/archives.json`：五类、四十份，正文是 Project-X 主干文档里的事实，每份带公开链接。
- 静态资源只用 Vite `base`（`PAGES_BASE=/Project-X-promo-site/lab/`）。不设置第二套 CDN 前缀。字体样式里原来的根路径 `/fonts/` 在构建时改到同一前缀下。
- 终端靠查询参数切换场景。根目录 `404.html` 只把落在 `/lab/` 下、又找不到文件的地址送回 `/lab/`，并保留查询串。
- 服务工作线程的 scope 是 `/Project-X-promo-site/lab/`，不接管首页和 `/stage/`。
