# Seasonal Sketch Timer（季节手绘倒计时）

一个极简、手绘风格的倒计时应用。背景会根据季节变化并带有粒子动画，支持开始/暂停/重置、进度条显示，以及轻量音效提醒。

## 特性
- 季节背景动画（Canvas）：春/夏/秋/冬不同粒子效果
- 开始、暂停、重置倒计时
- 进度条与百分比显示
- 轻量提示音（Web Audio API）
- 响应式布局，Tailwind CDN 即开即用

## 快速开始
**环境要求**：Node.js 18+，建议使用 `pnpm`

```bash
pnpm install
pnpm run dev
```
启动后访问终端显示的本地地址（例如 `http://localhost:3002/`）。

## 构建与预览
```bash
pnpm run build      # 产物输出到 dist/
pnpm run preview    # 本地预览生产构建
```

## 环境变量（可选）
- 在 `vite.config.ts` 中会注入 `process.env.GEMINI_API_KEY`；如需与外部服务集成，可在 `.env.local` 设置：

```
GEMINI_API_KEY=your_key_here
```

当前倒计时功能不依赖该变量，留作后续扩展。

## 项目结构
- `index.html`：应用容器与样式资源
- `index.tsx`：React 入口（挂载根节点）
- `App.tsx`：主界面与业务逻辑
- `components/SeasonalBackground.tsx`：季节背景动画（Canvas）
- `components/ProgressBar.tsx`：进度条组件
- `services/soundService.ts`：音效播放（Web Audio API）
- `types.ts`：类型与枚举（季节、状态等）
- `vite.config.ts`：Vite 配置与别名

## 技术栈
- Vite 6、React 19、TypeScript 5
- Lucide React（图标）、Tailwind（CDN）

## 许可证
本项目采用 MIT 许可证，详见 [`LICENSE`](./LICENSE)。
