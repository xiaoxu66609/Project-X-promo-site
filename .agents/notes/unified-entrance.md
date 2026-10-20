# 三个入口收成一个

首页和赞助页导航只留「交互入口」，打开静态页 `/hub/`。`/stage/`、`/lab/`、`/travels/` 仍是三套各自的页面，不合并渲染器，也不用截图代替。

每一处用 `assets/px-entrance.js` 在左侧放同一条小路：回到 `/hub/`，或去另外两处。颜色跟各自界面走，不改 WebGL 场景。舞台继续不设置 `HYDRA_ASSETS_CDN`。档案终端的服务工作线程 scope 仍是 `/Project-X-promo-site/lab/`；`sw.js` 的版本号跟着壳页面一起变，离线副本才会在用户应用更新后拿到新的 `index.html`。

`/hub/` 不是客户端路由。根目录 `404.html` 仍只恢复 `/stage/`、`/lab/`、`/travels/` 的深链。
