# Project-X promo-site

试卷星 Project-X 官方宣传站 —— 大连市第五中学信息化部自研智能阅卷与学情分析系统的对外展示页。

- **在线地址**：https://xiaoxu66609.github.io/Project-X-promo-site/
- **交互入口**：https://xiaoxu66609.github.io/Project-X-promo-site/hub/ （首页导航只留这一个入口。三套页面仍各自运行，页内同一条小路可以回到入口或去另外两处）
- **交互舞台**：https://xiaoxu66609.github.io/Project-X-promo-site/stage/ （原来的 WebGL 场景和动效。十四段研究写 Project-X，开场词标是 PROJECT X。公开版本 v2.7.1）
- **档案终端**：https://xiaoxu66609.github.io/Project-X-promo-site/lab/ （[RhineLabUI](https://github.com/LBEILC/RhineLabUI) 的三维档案界面，上游提交 `12cc5e4`。开场词标改成 PROJECT X。四十份档案是 Project-X 主干公开事实）
- **纸上行记**：https://xiaoxu66609.github.io/Project-X-promo-site/travels/ （the-masses-travels 的图版、行迹、图谱和可拆结构。行迹关卡按能力落地的先后排列，从 2026-06-07 建库开始。游戏贴图与音乐没有收录）
- **主仓库**：https://github.com/Dalian-No-5-Middle-School-I-T-C/Project-X （README 当前版本 v2.7.1；GitHub Releases 扫描端标签仍为 V1.9.6）
- **页面**：`index.html`（首页）、`hub/`（交互入口）、`sponsor.html`（赞助页）、`stage/`、`lab/`、`travels/`
- **设计皮肤**：纸锋 Paper Edge（宣传站样式仍用主仓库 v2.3.0 的纸锋色值），支持浅色 / 深色双主题

## 本地开发

Pages 发布仓库根目录。`npm run build` 的 `dist/` 只跳回首页，不单独维护第二套文案。Vite 也可作本地服务器。

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
hub/                        交互入口（纸锋页面，链到三套体验）
style.css                   全站样式（含纸锋皮肤覆盖与响应式）
main.js                     首页交互（reveal 动效 / 导航高亮 / 主题切换等）
assets/                     图片资源（logo、截图、海报）与三套体验共用的入口小路
stage/                      交互舞台静态页
lab/                        档案终端静态页（RhineLabUI 构建结果）
travels/                    纸上行记静态页（the-masses-travels 构建结果）
sitemap.xml / robots.txt    SEO
```

首页和赞助页的导航只放「交互入口」，通向 `hub/`。三套体验不合并渲染器。`assets/px-entrance.js` 在每一处左侧放同一条小路：回到 `hub/`，或去另外两处。舞台不设置 `HYDRA_ASSETS_CDN`。

档案终端在上游仓库用 `PAGES_BASE=/Project-X-promo-site/lab/` 构建后，把 `dist/` 放进 `lab/`。资源前缀只走 Vite 的 `base`，不另加一套 CDN 前缀。服务工作线程的 scope 仍是 `/Project-X-promo-site/lab/`。终端用查询参数切换场景，未知的 `/lab/` 路径由根目录 `404.html` 送回 `/lab/` 并保留查询串。

纸上行记在 the-masses-travels 里用 `PAGES_BASE=/Project-X-promo-site/travels/` 构建后，把 `dist/` 放进 `travels/`。未知的 `/travels/` 路径由同一个 `404.html` 记下地址，再回到 `/travels/` 恢复。未知的 `/stage/` 路径同样由这个 `404.html` 记下地址再回到 `/stage/`。未知的 `/hub/` 路径送回 `/hub/`。

## 更新检查单

每次同步主仓库状态时，按序执行：

1. **同步版本与里程碑**
   - 对照主仓库 `README.md` 的当前版本、`CHANGELOG.md`，以及 GitHub Releases 的安装包标签。三者不一定是同一个号
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
