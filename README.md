# Project-X promo-site

试卷星 Project-X 官方宣传站 —— 大连市第五中学信息化部自研智能阅卷与学情分析系统的对外展示页。

- **在线地址**：https://xiaoxu66609.github.io/Project-X-promo-site/
- **主仓库**：https://github.com/Dalian-No-5-Middle-School-I-T-C/Project-X
- **页面**：`index.html`（首页）、`sponsor.html`（赞助页）
- **设计皮肤**：纸锋 Paper Edge（对齐主仓库 v2.3.0 `design/tokens.css`），支持浅色 / 深色双主题

## 本地开发

纯静态站点，无构建产物；Vite 仅作本地服务器使用。

```bash
npm install        # 首次
npm run dev        # 本地开发（默认 http://localhost:5173）
npm run build      # 构建（输出 dist/，可选）
npm run preview    # 预览构建产物
```

也可以直接用 `python -m http.server 8000` 等任意静态服务器打开。

## 部署（GitHub Pages）

仓库 `main` 分支根目录即站点根目录（含 `.nojekyll`）。在 GitHub 仓库 **Settings → Pages** 中选择 `main` 分支 `/ (root)` 即可发布；push 到 `main` 自动生效，无需额外 CI。

## 文件结构

```
index.html / sponsor.html   页面
style.css                   全站样式（含纸锋皮肤覆盖与响应式）
main.js                     首页交互（reveal 动效 / 导航高亮 / 主题切换等）
assets/                     图片资源（logo、截图、海报）
sitemap.xml / robots.txt    SEO
```

## 更新检查单

每次同步主仓库状态时，按序执行：

1. **同步版本与里程碑**
   - 对照主仓库 `README.md`（公开发布版本）与 `CHANGELOG.md`（已合入未发版里程碑）
   - 更新 `index.html` 的 hero note、数据带、「最新进度」区块卡片
2. **替换 / 新增截图**
   - 新图复制到 `assets/`，确认体积与清晰度（竖图注意限高，避免区块过长）
   - 同步更新 `<img>` 的 `alt` 描述
3. **更新缓存戳**
   - 全站统一刷新 `?v=YYYYMMDD?` 查询串（`index.html`、`sponsor.html`、`style.css` 中的 `@import`，以及新引入的图片）
4. **检查外链**
   - 「文档与资源」6 张卡片指向主仓库 `readus/` 与 `user guide/` 下的文件，发布前逐一确认 200 可访问（主仓库若重构目录需同步改链接）
5. **更新 sitemap**
   - 修改 `sitemap.xml` 中对应 `<lastmod>`
6. **本地验证**
   - 首页 / 赞助页 200、无控制台报错；浅色 / 深色 / 系统跟随正常；390 / 768 / 1024 视口无横向溢出
   - `sitemap.xml`、`robots.txt` 可访问

## 主题机制备忘

- 主题初始化内联在 `<head>` 最前（读 `localStorage['px-theme']`，缺省跟随系统），避免闪烁
- `index.html`（`main.js`）与 `sponsor.html`（内联脚本）均监听 `prefers-color-scheme` 变化：用户未手动选择时自动跟随系统
- 手动切换后写入 `localStorage`，此后不再跟随系统
