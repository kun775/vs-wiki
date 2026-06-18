# 吸血鬼幸存者 Wiki 网站 · 完整审计报告

> 审计日期：2026-06-18  
> 项目：`vs-wiki` (kun775/vs-wiki)  
> 技术栈：React 19 + TypeScript 6 + Vite 8  
> 托管：GitHub · 部署：Cloudflare  

---

## 一、项目概述

这是一个吸血鬼幸存者（Vampire Survivors）游戏的中文 Wiki 工具站，包含四个核心模块：

| 模块 | 文件 | 功能 |
|------|------|------|
| 合成器 | `Simulator.tsx` | 超武合成祭坛，选武器+被动预测进化结果 |
| 百科 | `Encyclopedia.tsx` | 全物品图鉴，按 DLC/类型/关键词检索 |
| 规划器 | `Planner.tsx` | 6+6 槽位配装，SVG 五维雷达图 |
| 角色志 | `Biography.tsx` | 角色图鉴，一键导入配装/合成 |

**构建产物**：JS 303KB（gzip 95KB）+ CSS 26KB（gzip 5KB），数据全部内联打包。

---

## 二、审计发现汇总

共发现 **24 项问题**，按严重程度分布：

- 🔴 **高危 4 项** — 影响可用性、合规性
- 🟠 **中危 8 项** — 影响代码质量、用户体验
- 🟢 **低危 12 项** — 代码质量与最佳实践

---

## 三、高危问题（必须修复）

### H1. 第三方图片热链接 — 单点故障风险

**位置**：`src/data/vsData.ts:606`、`793`、`799`

```typescript
const WIKI_IMG = 'https://vampire.survivors.wiki/images/';
// 运行时为每个 item/character 拼接图片 URL
(VS_DATA.items[key] as any).img = WIKI_IMG + 'Icon-' + wikiName + '.png';
```

**问题**：
- 所有物品/角色图标均从第三方 wiki 站热链接加载，未自托管
- 该 wiki 若改 URL 结构、启用防盗链、或宕机，全站图标立即失效
- 无法控制图片缓存、尺寸优化、格式（WebP/AVIF）
- 存在潜在版权与合规风险（未获授权使用资源站图片）

**建议**：
- 将图片下载到 `public/icons/` 和 `public/characters/` 自托管
- 用构建脚本批量拉取并压缩为 WebP 格式
- 添加本地 fallback（已有 emoji 方案，保留即可）

### H2. 无部署配置 — CI/CD 完全缺失

**位置**：项目根目录（无 `.github/workflows/`、无 `wrangler.toml`、无 `_headers`/`_redirects`）

**问题**：
- 声称部署在 Cloudflare，但没有任何自动化部署配置
- 当前仅靠 `dist/` 手动构建 + Cloudflare Pages 手动关联
- 无构建校验、无预览环境、无回滚机制

**建议**：
- 添加 `.github/workflows/deploy.yml`，push 到 main 时自动构建并部署到 Cloudflare Pages
- 在 `public/` 添加 `_headers` 配置缓存策略和安全头
- 示例 `_headers`：
  ```
  /*
    X-Content-Type-Options: nosniff
    X-Frame-Options: DENY
    Referrer-Policy: strict-origin-when-cross-origin
  /assets/*
    Cache-Control: public, max-age=31536000, immutable
  ```

### H3. index.html 未引用 favicon

**位置**：`index.html`

**问题**：
- `public/favicon.svg` 文件存在，但 `index.html` 的 `<head>` 中无 `<link rel="icon">` 标签
- 浏览器会默认请求 `/favicon.ico`，返回 404
- 无 `apple-touch-icon`、`manifest.json`，移动端添加到主屏无图标

**建议**：
```html
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
<link rel="apple-touch-icon" href="/icons.svg" />
<meta name="theme-color" content="#06020c" />
```

### H4. 移动端无障碍被破坏

**位置**：`index.html:5`、`src/App.tsx:24-39`、`src/index.css:1517-1524`

**问题**：
- `viewport` 设了 `user-scalable=no, maximum-scale=1.0` — 禁止用户缩放，违反 WCAG 1.4.4
- `body { touch-action: none }` + JS 拦截 `touchstart` 多指和 `gesturestart` — 全局禁用捏合
- 视障用户无法放大页面查看内容，是明确的可访问性违规

**建议**：
- 移除 `user-scalable=no` 和 `maximum-scale=1.0`
- 仅在需要手势的游戏区域局部禁用 `touch-action`，不要全局禁用
- 保留防误触逻辑但限定在交互组件范围内

---

## 四、中危问题（建议修复）

### M1. ESLint 报 6 个错误

**运行 `npm run lint` 结果**：

| 文件 | 行 | 错误 | 规则 |
|------|----|------|------|
| `GameIcon.tsx` | 13 | `as any` 类型逃逸 | `@typescript-eslint/no-explicit-any` |
| `GameIcon.tsx` | 33 | `as any` 类型逃逸 | `@typescript-eslint/no-explicit-any` |
| `vsData.ts` | 793 | `as any` 副作用赋值 | `@typescript-eslint/no-explicit-any` |
| `vsData.ts` | 799 | `as any` 副作用赋值 | `@typescript-eslint/no-explicit-any` |
| `Simulator.tsx` | 29 | effect 内同步 setState | `react-hooks/set-state-in-effect` |

**Simulator.tsx 的问题**：
```typescript
useEffect(() => {
  if (match) {
    setFlashGlow(true);  // ← 在 effect 内同步 setState 触发级联渲染
    const timer = setTimeout(() => setFlashGlow(false), 800);
    return () => clearTimeout(timer);
  }
}, [altarWeapon, altarPassive, match]);
```

**建议**：
- `GameIcon` 的 `img` 属性应在 `GameItem`/`Character` 接口中声明为可选字段，消除 `as any`
- `vsData.ts` 的运行时赋值改为在数据定义时直接包含 `img`，或用工厂函数生成
- `Simulator` 的闪烁效果改用 `useRef` + CSS class 切换，或用 `requestAnimationFrame`

### M2. GameIcon 类型安全缺失

**位置**：`src/components/GameIcon.tsx:13, 33`

```typescript
const hasImg = 'img' in item && (item as any).img;  // 类型逃逸
const imgSrc = (item as any).img;                     // 类型逃逸
```

**根因**：`GameItem` 和 `Character` 接口未声明 `img` 字段，但 `vsData.ts` 在模块加载时动态注入了该属性。

**建议**：在接口中添加 `img?: string`，并用受控方式提供该值。

### M3. 缺少 SEO 社交元标签

**位置**：`index.html`

**问题**：
- 有 `description` 和 `keywords`（基础 SEO ✓）
- 缺少 Open Graph（`og:title`、`og:description`、`og:image`）— 微信/Telegram 分享无预览
- 缺少 Twitter Card — Twitter/X 分享无预览
- 缺少 `canonical` 链接
- 无 `robots.txt` 和 `sitemap.xml`

**建议**：补充完整的社交分享标签和 SEO 文件。

### M4. 交互元素无键盘支持

**位置**：`Encyclopedia.tsx`、`Simulator.tsx`、`Planner.tsx`、`Biography.tsx` 多处

**问题**：大量可点击区域使用 `<div onClick>` 或 `<span onClick>`，但：
- 无 `tabIndex={0}` — 键盘 Tab 无法聚焦
- 无 `onKeyDown` 处理 Enter/Space — 键盘无法激活
- 无 `role="button"` — 屏幕阅读器不识别为可交互

**建议**：可交互的 div/span 改用 `<button>` 或补充 ARIA 属性。

### M5. 模态框无焦点管理

**位置**：`Encyclopedia.tsx:235`、`Biography.tsx:239`

**问题**：
- 弹窗打开后焦点不自动移入，关闭后焦点不归还
- 无 Escape 键关闭（仅点击背景或 × 按钮）
- 无焦点陷阱 — Tab 键会跑到弹窗背后的内容
- 背景内容未设 `aria-hidden`，屏幕阅读器仍可读到

**建议**：实现标准的模态焦点管理，或引入 `@radix-ui/react-dialog` 等无障碍弹窗库。

### M6. Google Fonts 外链依赖

**位置**：`index.html:9-11`

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter..." rel="stylesheet">
```

**问题**：
- 中国大陆访问 `fonts.googleapis.com` 经常超时，导致首屏白屏
- 字体加载阻塞渲染（虽有 `display=swap`，但 CSS 文件本身仍阻塞）
- 外部依赖不可控

**建议**：自托管字体文件到 `public/fonts/`，用 `@font-face` 本地引用。

### M7. 模板残留文件未清理

**位置**：
- `src/App.css` — Vite 模板默认样式（`.counter`、`.hero`、`#next-steps`），未被任何文件 import
- `src/assets/react.svg`、`src/assets/vite.svg`、`src/assets/hero.png` — 模板资源，未使用
- `README.md` — 仍是 "React + TypeScript + Vite" 模板说明，未描述实际项目

**建议**：删除无用文件，重写 README 描述项目功能和部署方式。

### M8. 数据文件模块加载副作用

**位置**：`src/data/vsData.ts:790-800`

```typescript
Object.keys(VS_DATA.items).forEach(key => {
  (VS_DATA.items[key] as any).img = WIKI_IMG + 'Icon-' + wikiName + '.png';
});
```

**问题**：
- 在模块顶层执行副作用，修改了已导出的数据对象
- 这种隐式修改让数据来源不透明，难以测试和追踪
- 如果有多个模块 import `VS_DATA`，副作用只执行一次但影响全局

**建议**：改为纯函数 `getItemImg(key)` 或在数据定义时直接内联 `img` 字段。

---

## 五、低危问题与优化建议

### L1. 无 React Error Boundary
全应用无错误边界。若数据格式异常或图片 URL 构建出错，整个 App 会白屏崩溃。建议在 `App` 外层包裹 `ErrorBoundary`。

### L2. 无加载状态/骨架屏
外部图片渐进加载时无骨架屏，视觉跳动明显。建议添加占位骨架。

### L3. alert() 阻塞式提示
`Planner.tsx:63` 用 `alert()` 提示重复物品。建议改用 toast 通知。

### L4. 列表 key 使用 index
`Simulator.tsx:129`、`Planner.tsx:212` 的列表用 `key={index}`。若列表顺序变化会导致渲染异常。建议用稳定的业务 key。

### L5. 内联样式过多
Views 中大量 `style={{...}}` 内联，与 CSS 文件混用。建议提取为语义化 class。

### L6. 数据文件过大
`vsData.ts` 802 行单文件。建议按 DLC 拆分为 `data/base.ts`、`data/moonspell.ts` 等。

### L7. Vite 配置过简
`vite.config.ts` 仅 7 行。建议添加：
- `build.target` 指定浏览器兼容
- `build.rollupOptions.output.manualChunks` 拆包优化缓存

### L8. 无测试
项目无任何测试。建议至少为数据完整性（演化配方引用的 key 是否存在）添加校验测试。

### L9. package.json 版本 0.0.0
未遵循语义化版本。建议随发布递增版本号。

### L10. 数据内容小错误
`vsData.ts:385` 角色安东尼奥的 `nameEn` 写成 `"Antonio Belmont"`，实际应为 `"Antonio Belpaese"`（图片 URL 用的 `Antonio_Belpaese` 是对的）。

### L11. verbatimModuleSyntax 与导入风格
开启了 `verbatimModuleSyntax: true`，部分文件 `import React` 同时用作值和类型。建议统一用 `import type` 分离类型导入。

### L12. 无 CSP 头
缺少 Content-Security-Policy 头，建议在 `_headers` 或 Cloudflare 配置中添加，防止 XSS。

---

## 六、做得好的地方

- ✅ **TypeScript 严格模式**：`tsconfig` 开启了 `noUnusedLocals`、`noUnusedParameters`、`noFallthroughCasesInSwitch`
- ✅ **构建正常**：`npm run build` 无 TS 错误，产物体积合理
- ✅ **数据完整**：覆盖本体 + 5 个 DLC，演化配方 50+ 条，角色 22 个
- ✅ **响应式设计**：移动端有专门的 App 式布局优化
- ✅ **图片降级方案**：`GameIcon` 有 emoji fallback，图片加载失败不影响功能
- ✅ **无 XSS 风险**：未使用 `dangerouslySetInnerHTML`，React 自动转义
- ✅ **无外部 API 调用**：所有数据打包内联，无运行时网络请求（除图片和字体）

---

## 七、修复优先级建议

| 优先级 | 问题 | 工作量 |
|--------|------|--------|
| P0 | H1 图片自托管 | 中（需下载脚本） |
| P0 | H3 favicon 引用 | 极小 |
| P1 | H2 部署配置 | 小 |
| P1 | H4 无障碍修复 | 小 |
| P1 | M1 ESLint 错误 | 小 |
| P1 | M6 字体自托管 | 小 |
| P2 | M3 SEO 标签 | 小 |
| P2 | M4/M5 键盘与焦点 | 中 |
| P3 | 其余低危项 | 按需 |

---

*报告由 WorkBuddy 生成 · 审计覆盖源码、构建、配置、部署全链路*
