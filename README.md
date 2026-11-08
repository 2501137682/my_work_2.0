# 陈奕儒个人作品集

使用 React、Vite 与 GSAP 制作，结构为编辑杂志式章节、展览式项目卡片和实验性数据展示区。

## 在线预览

[GitHub Pages 在线作品集](https://2501137682.github.io/my_work_2.0/)

推送到 `main` 分支后，GitHub Actions 会自动构建并发布网站。

## 本地运行

```bash
npm install
npm run dev
```

## 内容维护

- 项目标题、说明、标签和实时网页地址集中在 `src/content.js`。
- 页面结构在 `src/App.jsx`，视觉样式在 `src/styles.css`。
- 压缩图片与视频封面位于 `public/media`。
- 网页使用的视频位于 `public/source`，均为适合网页加载的压缩版本；原始素材目录 `source` 不进入 Git 仓库。

实时网页使用延迟加载，仅在接近视口时开始载入，以减少长页面的初始资源消耗。
