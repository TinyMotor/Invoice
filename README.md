# 发票打印助手

一款基于浏览器的免费电子发票合并与 A4 排版打印工具。无需后端，无需登录，PDF 文件全程在本地处理，保护你的财务隐私。

> 在线体验：[https://invoice.tinymotor.top/](https://invoice.tinymotor.top/)

## 核心功能

### 多格式发票支持
- 增值税普通发票 / 增值税专用发票 / 全电发票（数电票）
- 电子普通发票 / 电子专用发票
- 机动车销售统一发票 / 二手车销售统一发票
- 通用机打发票 / 卷式发票 / 通用定额发票
- 航空运输电子客票行程单 / 火车票 / 出租车票
- 过路过桥费 / 加油费 / 农产品销售 / 收购 / 报关 / 保险 / 银行汇票等多种票据

### 灵活的排版设置
- **纸张大小**：A4、Letter（可扩展）
- **纸张方向**：纵向 / 横向自由切换
- **自定义边距**：上、下、左、右四个方向独立调节（0–50 mm）
- **发票间距**：双联之间的间隔可调（0–30 mm）
- **缩放控制**：50%–150% 缩放滑块，灵活适配不同尺寸的发票
- **裁切线**：A4 纸双联排版时自动添加水平虚线，裁剪即用

### 智能合并与打印
- **批量上传**：一次拖拽多份 PDF，自动解析每一页
- **拖拽排序**：发票页面可自由拖拽，重新排列打印顺序
- **缩略图预览**：实时查看每张发票，合并结果所见即所得
- **打印预览**：A4 排版效果即时预览，所见即所得
- **一键打印**：通过隐藏 iframe + HTML 直接调起系统打印对话框，不打开新标签页
- **导出 PDF**：将排版结果导出为合并的 PDF 文件备份

### 模板与历史
- **打印模板**：保存当前排版方案（页面 + 设置），下次一键复用
- **历史记录**：自动记录最近 30 次打印/导出操作，方便回溯
- **本地存储**：模板与历史均存储在浏览器 localStorage，无需联网

### 隐私与性能
- **纯前端架构**：PDF 解析、渲染、合并、打印全部在浏览器完成
- **离线可用**：首次加载后可离线使用，不上传任何文件
- **高清渲染**：200 DPI 渲染保证打印质量，72 DPI 缩略图节省内存
- **多 polyfill 兼容**：支持旧版浏览器（修复 `crypto.randomUUID`、`Uint8Array.toHex` 等兼容性）

## 技术栈

| 类别 | 技术 |
| --- | --- |
| 框架 | React 18 + TypeScript |
| 构建 | Vite 6 |
| 状态管理 | Zustand |
| 样式 | Tailwind CSS 3 |
| PDF 解析 | pdf.js 6.x |
| PDF 合并 | pdf-lib |
| 路由 | React Router 7 |
| 图标 | lucide-react |
| 部署 | GitHub Pages + gh-pages |

## 项目结构

```
src/
├── components/         # UI 组件
│   ├── PdfUploader.tsx       # PDF 上传与解析
│   ├── PdfPageList.tsx       # 页面列表与拖拽排序
│   ├── PrintSettings.tsx     # 打印设置面板
│   ├── PrintPreview.tsx      # 排版预览
│   ├── ActionBar.tsx         # 打印 / 导出按钮
│   ├── TemplatePanel.tsx     # 模板与历史
│   └── ...
├── hooks/              # 自定义 React Hooks
│   ├── usePdfPages.ts        # PDF 页面状态
│   ├── usePrintSettings.ts   # 打印设置持久化
│   ├── useTemplates.ts       # 模板管理
│   ├── useHistory.ts         # 历史记录
│   └── useTheme.ts           # 主题切换
├── stores/
│   └── appStore.ts           # 全局状态（Zustand）
├── utils/              # 工具函数
│   ├── pdfjsSetup.ts         # pdf.js 初始化与 worker 配置
│   ├── pdfPolyfills.ts       # 旧浏览器 polyfill 集合
│   ├── pdfWorker.entry.ts    # 自定义 worker 入口（注入 polyfill）
│   ├── pdfRenderer.ts        # PDF 转图片渲染
│   ├── pdfExporter.ts        # 合并导出 PDF
│   ├── printInvoices.ts      # 浏览器内打印路由
│   ├── exportPdf.ts          # PDF 导出底层
│   ├── validation.ts         # 文件校验
│   ├── uuid.ts               # UUID 工具
│   └── constants.ts          # 常量定义
├── types/              # TypeScript 类型
├── App.tsx             # 应用根组件
└── main.tsx            # 入口
```

## 本地开发

### 环境要求
- Node.js ≥ 18
- npm 或 pnpm / yarn

### 安装与启动

```bash
# 克隆仓库
git clone https://github.com/TinyMotor/Invoice.git
cd Invoice

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

打开浏览器访问 [http://localhost:5173](http://localhost:5173) 即可。

### 常用命令

| 命令 | 说明 |
| --- | --- |
| `npm run dev` | 启动开发服务器（Vite HMR） |
| `npm run build` | 类型检查 + 生产构建，输出到 `dist/` |
| `npm run preview` | 本地预览构建产物 |
| `npm run lint` | 运行 ESLint |
| `npm run check` | 仅运行 TypeScript 类型检查 |
| `npm run deploy` | 构建并部署到 GitHub Pages |

## 部署

本项目使用 `gh-pages` 一键部署到 GitHub Pages：

```bash
git add .
git commit -m "fix: 你的修改说明"
npm run deploy
```

`gh-pages` 会在构建后将 `dist/` 推送到 `gh-pages` 分支，GitHub Pages 会自动发布。

> 自定义域名：`vite.config.ts` 中 `base: '/'`；如需部署到子路径，修改为 `base: '/your-repo/'` 即可。

## 浏览器兼容性

| 浏览器 | 最低版本 | 说明 |
| --- | --- | --- |
| Chrome / Edge | 90+ | 完全支持 |
| Firefox | 90+ | 完全支持 |
| Safari | 14+ | 完全支持 |
| 旧版嵌入式 Chromium | - | 通过 polyfill 兼容（`crypto.randomUUID`、`Uint8Array.toHex`、`Map.getOrInsertComputed`） |

`src/utils/pdfPolyfills.ts` 内置了 pdf.js 6.x 在旧版 Chromium 环境下运行所需的全部 polyfill，并通过自定义 worker 入口（`pdfWorker.entry.ts`）注入到 Web Worker 上下文中。

## 使用指南

### 基本流程

1. **上传发票**：把 PDF 发票拖入上传区，或点击选择文件
2. **调整顺序**：在页面列表中拖拽调整打印顺序
3. **设置排版**：选择纸张 / 方向 / 边距 / 缩放，勾选「添加裁剪线」
4. **预览效果**：在右侧预览面板查看 A4 排版效果
5. **打印或导出**：
   - 「打印」：调起系统打印对话框（推荐）
   - 「导出 PDF」：将合并结果下载为 PDF 文件

### 高级技巧

- **保存模板**：在「模板与历史 → 模板」中保存当前排版，下次切换发票时一键复用
- **混合排版**：横向 / 纵向混排适合不同尺寸的票据，灵活切换纸张方向
- **双联裁切**：A4 纵向 + 勾选裁切线，打印后沿虚线裁开即可得到两张标准发票

## 设计理念

### 为什么是纯前端？

- **隐私优先**：财务发票包含敏感信息，本地处理彻底避免上传泄露风险
- **零成本**：无需服务器、无需数据库，可托管在任何静态服务上
- **离线可用**：断网环境下依然可以使用所有核心功能

### 为什么用 PDF 转图片再打印？

- 浏览器原生 PDF 渲染器在内嵌 iframe 中不可靠触发 `window.print()`
- 将 PDF 转为高清图片后，通过 HTML + CSS `@page` 直接打印，可控性更强
- 视觉与 PDF 导出结果完全一致

## 常见问题

**Q：上传后页面没反应？**
A：检查浏览器控制台是否有报错；超大 PDF (>20MB) 会被自动拒绝。

**Q：打印时没有出现系统打印对话框？**
A：确认浏览器未禁用弹出窗口；部分内嵌浏览器（如企业 OA 内嵌）需要授予「弹出窗口」权限。

**Q：为什么 A4 双联排版的发票被裁切了？**
A：调整「发票缩放」滑块（90%–95% 通常能避免出血），或增加「发票间距」。

**Q：模板/历史丢失了？**
A：模板与历史存储在浏览器 `localStorage` 中，清除浏览器数据会一并清除。建议重要的排版方案及时「导出 PDF」备份。

## 路线图

- [ ] 更多的纸张模板（信封、快递单、报销单）
- [ ] OCR 票面识别与自动归类
- [ ] 多语言支持（English / 日本語）
- [ ] PWA 离线安装
- [ ] 云端模板同步（可选、可关闭）

## 贡献

欢迎提交 Issue 与 Pull Request。提交前请：

1. 运行 `npm run check` 确保类型检查通过
2. 运行 `npm run lint` 确保 ESLint 通过
3. 提交信息建议使用中文，遵循 Conventional Commits 风格（如 `feat: 新增信封模板`）

## 许可证

MIT License

## 致谢

- [pdf.js](https://mozilla.github.io/pdf.js/) - Mozilla 基金会
- [pdf-lib](https://pdf-lib.js.org/) - 纯 JavaScript 的 PDF 编辑库
- [Lucide](https://lucide.dev/) - 美观的开源图标库
- [Tailwind CSS](https://tailwindcss.com/) - 实用优先的 CSS 框架

---

如有问题或建议，欢迎通过 [Issue](https://github.com/TinyMotor/Invoice/issues) 反馈。
