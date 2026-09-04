# Portfolio V2 — 许隆鑫 · AI 产品经理个人网站

多页面个人作品集网站，Next.js 16 (App Router) + Tailwind CSS 4 + Framer Motion 构建，全站静态生成（SSG）。

## 页面结构

| 路由 | 说明 |
| --- | --- |
| `/` | 首页：Hero 大字排版、数据栏、跑马灯、精选案例、能力矩阵、图库预览、CTA |
| `/about` | 关于页：个人简介、关注方向、工作履历、教育背景、技能栈、荣誉奖项 |
| `/works` | 作品展示：3 个精选案例 + 其他项目卡片 |
| `/works/[slug]` | 案例详情：问题定义、策略路径、工具矩阵、量化结果、技术栈、上下篇导航 |
| `/gallery` | 图片库：12 张优化图片，分类筛选 + 键盘可导航灯箱预览 |
| `/contact` | 联系页：联系卡片、社交链接（GitHub / Email / 电话 / 简历下载）、留言表单（mailto） |

全站细节：路由切换过渡动效（`template.tsx`）、自定义 404、回到顶部按钮、品牌 favicon（`icon.svg`）、
SEO 基建（`sitemap.xml` / `robots.txt` / OG 分享卡 `opengraph-image.tsx` / Person JSON-LD）。
注意：sitemap / robots / OG 路由必须带 `export const dynamic = "force-static"` 才能静态导出。

## 开发

```bash
pnpm install
pnpm dev    # http://localhost:3000
pnpm build  # 生产构建（静态导出到 out/）
```

> 项目已配置 `output: "export"`，构建产物是纯静态文件；本地预览用 `pnpm dev`，
> 或静态服务 `out/` 目录（如 `npx serve out`）。`pnpm start` 已不适用。

## 部署到 GitHub Pages

已内置 GitHub Actions 工作流 `.github/workflows/deploy.yml`，推送到 `main` 分支即自动构建部署。

1. 在 GitHub 创建仓库（如 `portfolio`），然后：

   ```bash
   git init && git add -A && git commit -m "init: portfolio v2"
   git remote add origin https://github.com/<用户名>/<仓库名>.git
   git push -u origin main
   ```

2. 仓库 Settings → Pages → Source 选择 **GitHub Actions**。
3. 等待 Actions 构建完成，访问 `https://<用户名>.github.io/<仓库名>/`。

子路径说明：项目站部署在 `/<仓库名>/` 下，CI 通过 `NEXT_PUBLIC_BASE_PATH` 自动注入
basePath（见 `next.config.ts` 与 `FadeImage`）；本地构建该变量为空，互不影响。
若仓库名为 `<用户名>.github.io`（用户主站点），需把工作流中的 `NEXT_PUBLIC_BASE_PATH` 置空。

## 内容维护

全部文案数据集中在 `src/lib/constants.ts`：个人信息、履历、案例研究（`CASE_STUDIES`）、
技能、奖项、图库（`GALLERY`）。改内容只需改这一个文件。

图片放在 `public/images/`：
- `avatar.jpg` — 个人形象照
- `gallery/` — 图库图片（来自 Unsplash，1600px / q80 优化）
- `projects/` — 案例封面 SVG

## 匿名化红线（重要）

`src/lib/constants.ts` 顶部维护了匿名化规则：某段实习经历以「某教育科技公司」匿名。
真实公司名、内部产品 URL、邀请码、内部同事姓名、内部成本数字**绝不**出现在代码库中。
修改内容时请遵守该注释块的 BANNED tokens 列表。

## 设计系统

- 深色底（`--color-ink #0b0b0f`）+ 象牙白文字 + 紫罗兰强调色（`#8b7cff`）
- 瑞士网格底纹（`.bg-grid`）、噪点（`.bg-noise`）、描边大字（`.text-outline`）
- 字体：Space Grotesk（西文标题）+ Inter（西文正文）+ 系统中文字体
