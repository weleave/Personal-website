# 个人网站发布说明（GitHub Pages）

## 1. 准备内容

- 主页文件：`docs/index.html`
- 样式文件：`docs/styles.css`
- 动效脚本：`docs/script.js`
- 可选：把你的简历图片放到 `docs/resume.jpg`（按钮会自动显示）
- 可选：把你的头像放到 `docs/avatar.jpg`（头像区域会自动替换）

## 2. 提交并推送到 GitHub

```bash
git add docs
git commit -m "feat: add personal website for GitHub Pages"
git push origin main
```

## 3. 打开 GitHub Pages

1. 进入仓库 `Settings`
2. 打开 `Pages`
3. `Build and deployment` 里选择 `Deploy from a branch`
4. 分支选 `main`，目录选 `/docs`
5. 保存后等待 1-3 分钟

发布完成后，GitHub 会给你一个公开网址，格式通常为：

`https://<你的用户名>.github.io/<仓库名>/`

## 4. 后续修改

- 修改文本：编辑 `docs/index.html`
- 修改风格：编辑 `docs/styles.css`
- 修改动效：编辑 `docs/script.js`
- 每次修改后重新 `git add/commit/push`，页面会自动更新。
