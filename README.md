# VS-Wiki · 吸血鬼幸存者中文百科 & 模拟器

最全面的吸血鬼幸存者（Vampire Survivors）中文 Wiki 工具站，覆盖本体及全部 5 个 DLC。

## 功能模块

- **合成器** — 超武合成祭坛，选武器+被动预测进化结果
- **百科** — 全物品图鉴，按 DLC/类型/关键词检索
- **规划器** — 6+6 槽位配装，SVG 五维雷达图
- **角色志** — 角色图鉴，一键导入配装/合成

## 技术栈

- React 19 + TypeScript 6 + Vite 8
- 纯前端 SPA，数据全部内联打包，无后端 API
- 部署：GitHub → Cloudflare Pages（CI/CD 自动部署）

## 开发

```bash
npm install      # 安装依赖
npm run dev      # 本地开发
npm run lint     # 代码检查
npm run build    # 生产构建
npm run preview  # 预览构建产物
```

## 项目结构

```
src/
├── components/     # 可复用组件
│   ├── ErrorBoundary.tsx
│   ├── GameIcon.tsx
│   ├── Modal.tsx
│   └── Toast.tsx
├── data/
│   └── vsData.ts   # 游戏数据（物品/角色/演化配方）
├── views/          # 四个功能页面
│   ├── Simulator.tsx
│   ├── Encyclopedia.tsx
│   ├── Planner.tsx
│   └── Biography.tsx
├── App.tsx
├── main.tsx
└── index.css
```

## 部署

推送到 `main` 分支后，GitHub Actions 自动构建并部署到 Cloudflare Pages。

需要在 GitHub 仓库 Secrets 中配置：
- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`
