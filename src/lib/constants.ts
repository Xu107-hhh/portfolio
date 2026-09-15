// ============================================================================
// NAMING & PRIVACY RULE — single source of truth
// ----------------------------------------------------------------------------
// 公司名称「精准学」及公开标签（阿里战投 · 准独角兽）经用户 2026-09-04 授权公开展示。
// 内部产品 URL、邀请码、内部同事姓名、内部成本数字仍绝不允许出现在本文件或代码库中。
//
// BANNED tokens (a pre-commit grep guard should reject these):
//   JZX | jzxaianimation | coze.site | JZX20260415
//   张梦婷 | 朱晓明 | 王荣川 | 邢惋 | 李锐 | 郑森溪 | 刘峻臣 | 李俊洁 | 玉树芝兰
//   7 层 PM 思维框架 | G1-G4 验证门 | 自创
//
// KEPT (these survive — anonymizable achievements):
//   "多款工具进真实生产" | "30 分钟→3~5 分钟资料整理"
//   "13+ 生成模型评测" | "五级证据分级" | "Exit Criteria 阶段路线图"
//   Generic tool names: PPT静态加工 / 动画注入插件 / 录屏后处理 / AI图视频生成平台
// CLEARED digits (说不出计算过程，严禁再上墙/简历——见秋招简历记忆台账):
//   "89% 同事跑通" | "综合提效 15-20%" | "问卷满意度 4.3/5" | "素材可用率 60%"
// ============================================================================

// GitHub Pages 子路径部署时，普通 <a> 链接不会自动带 basePath，需手动前缀
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const PERSONAL = {
  name: "许隆鑫",
  nameEn: "Xu Longxin",
  role: "AI Product Manager",
  roleDetail: "AI 应用方向 · 从模型评测到产品落地",
  tagline: "把前沿模型能力，翻译成可落地的产品体验。",
  phone: "16603798810",
  email: "1079466805@qq.com",
  location: "全国可到岗",
  available: "2027 届校招 · AI 产品经理（应届生）",
  degree: "2027 届硕士 · 天津师范大学情报学（信息资源管理 · 数据科学系 · 人工智能应用研究方向）",
  meta: ["2027 届硕士", "中共党员"],
  avatar: "/images/avatar.jpg",
  resume: `${BASE_PATH}/许隆鑫-AI产品经理简历.pdf`,
};

export const SOCIALS = [
  { label: "GitHub", handle: "github.com/Xu107-hhh", href: "https://github.com/Xu107-hhh", icon: "github" as const },
  { label: "Email", handle: "1079466805@qq.com", href: "mailto:1079466805@qq.com", icon: "mail" as const },
  { label: "Phone", handle: "166 0379 8810", href: "tel:16603798810", icon: "phone" as const },
  { label: "简历下载", handle: "AI 产品经理 · PDF", href: PERSONAL.resume, icon: "file" as const },
];

export const ABOUT = {
  paragraphs: [
    "我是许隆鑫，天津师范大学情报学硕士研究生（信息资源管理 · 数据科学系 · 人工智能应用研究方向）。实践覆盖大模型评测、Prompt Engineering、RAG、AI Agent、多智能体系统和生产工具落地，擅长把模糊的「AI 提效」需求拆成场景、流程、验证指标与可交付方案。",
    "我关注的不只是模型「能不能生成」，而是结果能否稳定进入业务：适用范围是什么、失败如何处理、人工修正成本多高，以及最终是否真正提升效率与质量。",
    "我的优势：既能做用户与业务分析，也能理解模型和工程边界；能够用数据与实验推进产品决策，并借助 AI Coding 快速完成原型验证。本科图书馆学（主修）+ 法学（辅修）的跨学科背景，让我在海量信息中做逻辑归纳与规律发现时更得心应手。",
  ],
  highlights: [
    { value: "3.82/4", label: "GPA · 专业第 1" },
    { value: "国赛三等奖", label: "全国 AI 创新大赛" },
    { value: "3×", label: "国家励志奖学金" },
  ],
  focus: [
    { title: "Prompt Engineering", desc: "结构化 Prompt 标准与模型评测体系" },
    { title: "Agent 设计", desc: "多智能体编排、RAG 系统与工具链整合" },
    { title: "AI 产品落地", desc: "从问题定义、技术选型到交付推广全流程" },
  ],
};

export const EDUCATION = [
  {
    school: "天津师范大学",
    schoolEn: "Tianjin Normal University",
    degree: "硕士（应届生）",
    major: "情报学（信息资源管理 · 数据科学系 · 人工智能应用研究方向）",
    period: "2024.09 - 2027.07",
    courses:
      "大数据分析与数据挖掘、机器学习、信息分析工具、信息行为分析、竞争情报、信息系统开发方法",
    research:
      "人工智能应用研究，熟练掌握 Claude Code、Codex、Zcode、Coze 等 AI Coding 与 Agent 工具及其落地应用场景",
  },
  {
    school: "郑州航空工业管理学院",
    schoolEn: "Zhengzhou University of Aeronautics",
    degree: "本科",
    major: "图书馆学（主修）/ 法学（辅修）",
    period: "2020.09 - 2024.07",
    gpa: "3.82/4（1/30）",
    courses:
      "信息组织学、信息检索、信息资源建设、Python 程序设计、数据库原理、知识产权法、商法、宪法学",
    highlights: "辅修 GPA 3.81/4（1/43），连续三年国家励志奖学金；担任学生会学习部负责人，策划组织活动 20 余项，多场参与人数超百人",
  },
];

export const EXPERIENCE = [
  {
    company: "精准学",
    role: "AI 产品经理实习生 · 主要负责动画提效产品线",
    period: "2026.01 - 2026.07",
    caseSlug: "edu-ai-animation",
    summary: "阿里战投 · 准独角兽 · 动画制作环节内部提效产品矩阵 + 学习机功能数据分析",
    details: [
      "产品矩阵规划：先实境体验动画生产流程约一周，再协同运营、教研、制作、剪辑完成全链路调研与问题定义，搭建覆盖课件加工、PPT+AI 动画制作、录屏剪辑 3 大主环节的提效产品矩阵；实习累计沉淀 11 项工具与作品（提效矩阵 9 项 + 学习机数据线 2 项）、其中 4 款进入真实生产流程，并设定可验证目标口径（单剧本周期 5 天→3.5 天、素材可用率图 ≥70% / 视频 ≥50%）",
      "课件自动化工具：针对制作老师约 30-40% 工时耗在重复排版的问题，按学科特点分建数学、理科两套工具（脚本工作流→GUI / 网页多形态交付），编排三阶段工作流（视觉理解、自动重绘、抠图模型）自动产出可接手加工的初稿，并提供半自动 PPTX 动画插件推动上游数据革新",
      "剪辑自动化工具：将专人约 40 分钟的连续脚本操作整合为「扫号、切段、贴标、打包」自动加工流程，封装 GUI 工具与 Claude Code Skill 双形态并内部推广——单剧本约 20 分钟无人值守、人工审核调整即可，从负责人集中代跑转变为制作人员自助处理",
      "剧本资料整理插件：制作侧原靠截图喂 AI 逐条提取文本、效率偏低，据此开发 Edge / Chrome 浏览器辅助插件，自动汇总剧本资料为进度评审表，单剧本由约 30 分钟压缩至 3~5 分钟；部分试用后与 mentor 评估数据合规风险，主动叫停并推动开发提供官方导出接口替代——沉淀「合规优先」判断复盘",
      "教学 AI 动画平台：横向对比国内外主流图像 / 视频生成模型与工具，结合业务场景从 0 到 1 设计开发内部动画平台并组织内部测评；基于测评反馈与成本分析主动收缩平台功能扩张、聚焦确定性提效工具——首帧素材可用率约 40% 的关键复盘确立了「确定性环节优先产品化」原则",
      "学习机听写功能优化：基于近 8 万条真实判错数据完成归因分析——抽样 200 条人工复核建模、归纳 16 类问题模式，候选规则全量扫描定位问题分布，80 条定向盲验；区分学生真实写错与系统误判，输出判题规则与识别 SDK 的 P0-P2 优化建议，辅助 mentor 决策",
      "方法论沉淀与路线治理：建立五级证据分级（实测 / 阶段性试测 / 估算 / 目标 / 待测）与 8 维验证指标，避免把目标值汇报为已达成；对 11 条技术路线分级管理（4 条已推广 / 2 条活跃 / 5 条降级为技术储备）；离职时交付 v1.1 交接文档 + 项目上下文包，被 mentor 评价为可支撑继任者直接接手",
    ],
  },
  {
    company: "中国科学院武汉文献情报中心",
    role: "科研项目助理",
    period: "2025.07 - 2026.01",
    details: [
      "大模型效果评测：以人工核查的全固态锂电池知识体系为基准，设计 6 组对照测试用例，完成磐石大模型 vs 通用模型（Kimi K2.0）的系统性评测，覆盖 Chat 模式与文献罗盘双模式，从准确性、深度、逻辑性、术语规范性四维输出结构化测评报告，支撑模型选型",
      "Prompt 策略优化：制定结构化 Prompt 标准作为数据标注基准，统一评测流程，定位模型指令遵循能力短板",
      "行业情报分析：独立撰写 15 页《战略趋同与路径分化：2025 年中国动力电池产业产学研合作深度解析》——剖析宁德时代（技术霸权生态）、比亚迪（人才供应链）、挑战者阵营（技术押注弯道超车）三类产学研合作战略的分化路径，并构建 7 家头部企业 × 合作高校 × 研发方向的全景合作矩阵",
      "国际机构调研：协作完成美国 NSF 首席信息官办公室系列补充调研（多轮迭代至 V8），支撑机构科技情报服务",
    ],
  },
  {
    company: "字节跳动 Coze · 校园大使",
    role: "AI 产品校园推广",
    period: "2024.09 - 至今",
    details: [
      "负责 AI 产品 Coze 的校园推广与社群运营，策划 AI 实战工作坊，实现拉新率超 36%，累计服务用户 200+",
      "多次线下参与 AI 相关活动，组织和协助多场 AI 应用教学培训",
    ],
  },
];

export const SKILLS = [
  {
    category: "AI / LLM",
    featured: true,
    items: [
      "Prompt Engineering",
      "AI Coding（Claude Code / Codex / Cursor）",
      "Agent 开发（Dify / Coze / 百度千帆）",
      "RAG 系统设计",
      "多智能体编排",
      "大模型效果评测",
      "GPT / Claude / Gemini 能力边界与适用场景",
    ],
  },
  {
    category: "产品设计",
    items: ["需求分析与 PRD", "业务流程拆解", "MVP 验证与路线图", "指标设计与复盘", "原型与流程图（墨刀 / XMind）", "用户研究"],
  },
  {
    category: "数据分析",
    items: ["SQL", "Python", "数据可视化", "数据清洗", "Excel"],
  },
  {
    category: "开发工具",
    items: ["Git", "Next.js / React", "FastAPI", "LangChain", "ChromaDB"],
  },
  {
    category: "通用",
    items: ["英语六级（CET-6）", "MS Office（计算机二级）", "驾照 C1", "飞书 / 钉钉协同"],
  },
];

// ----------------------------------------------------------------------------
// Case studies
// ----------------------------------------------------------------------------
export interface Metric {
  value: string;
  label: string;
}
export interface SubTool {
  name: string;
  form: string; // 作品形态：Web 平台 / 网页应用 / 浏览器插件 / AI Skill / PPT 插件 / 脚本流水线等
  desc: string;
  group?: string; // 工作流分组：提效产品矩阵（动画线）/ 学习机数据线——两条线勿混计
}
export interface CaseShot {
  src: string;
  alt: string;
  caption: string;
  w: number;
  h: number;
}
export interface CaseStudy {
  slug: string;
  title: string;
  category: string;
  tagline: string;
  role: string;
  period: string;
  company?: string;
  anonymized?: boolean;
  featured: boolean;
  cover?: string;
  summary: string;
  problem: string;
  approach: string[];
  impact: Metric[];
  tech: string[];
  subTools?: SubTool[];
  shots?: CaseShot[]; // 真实界面截图（本地实测/真实部署环境）
  reflection?: string; // 收获与反思（一句话沉淀）
  dataNote?: string; // 数据口径说明（脚注）
}

export const CASE_STUDIES: CaseStudy[] = [
  {
    slug: "edu-ai-animation",
    title: "AI 动画自动化生产提效合辑",
    category: "AI Animation Automation",
    tagline: "动画制作环节内部提效 · 7 个月 11 项工具与作品",
    role: "AI 产品经理实习生 · 主要负责该产品线",
    period: "2026.01 - 2026.07",
    company: "精准学",
    featured: true,
    cover: "/images/gallery/real-animation-platform.png",
    summary:
      "在精准学（阿里战投 · 准独角兽）面向动画制作各环节做内部提效，三条产品线并行——AI 动画生产辅助平台（流程整合）、数学 PPT / 动画自动化（结构化题型路线验证）、剪辑提效 V2（交付后处理）；7 个月内推动多款工具落地推广，覆盖数学 / 理科 / 文科三大学科线，并为每条线设定可验证的效率与质量目标口径。",
    problem:
      "公司教学视频生产分「教研 → 动画组制作 → 剪辑交付」三段：动画组制作环节（资料提取、PPT 静态/动态制作、AI 图像视频素材、录屏后处理）规则化重复劳动密集，是全链路可提效空间最大的一段；而教研打磨属隐性教学知识、一站式「剧本→成片」受素材可用率约束，均难以一步自动化——因此做面向动画制作各环节的内部提效工具：减少规则化重复劳动，保留教学判断、审美判断与最终人工审核，不以一键成片为目标。",
    approach: [
      "以 Exit Criteria（准出条件）驱动 5 阶段路线图（静态布局 → 动态注入 → 全流程串联 → 多学科扩展 → 批量化），每阶段设明确的准出条件，不达标不进入下一阶段",
      "为每条产品线设定可验证的目标口径：单剧本制作周期 5 天→3.5 天以内、新人上手 1 天→半天、图片可用率 ≥70%、视频可用率 ≥50%、单剧本 API 成本可预估可追踪——阶段汇报中明确区分「已达成 / 目标 / 未解决」",
      "建立证据分级制度（实测 / 阶段性试测 / 估算 / 目标 / 待测，共五级），明确「产物门」与「项目价值门」分离，杜绝将目标值汇报为已达成——简历与汇报中只引用可复现口径的数字",
      "坚持「确定性环节优先产品化，AI 不确定环节先验证关键假设」——一站式平台实测首帧素材可用率仅约 40% 后主动收缩，结合抽卡率与成本分析输出「API 接入 ≠ 生产能力」关键复盘，资源转向确定性提效工具",
      "对「AI 生成 PPTX 课件」做底层技术选型判断：市面开源方案本质只有图片式（不可编辑）与 HTML 转换两种；对 PPT Master 等原生可编辑路线（DrawingML）逐项评估后判定其「逐页画 SVG、高度依赖模型、随机性大」与公司「限定模板、限定内容、产物须可被制作人员接手修改」的约束不契合——最终走「确定性脚本 + 模板槽位映射 + 以上游布局为准」路线，把 PPT Master 降为技术储备",
      "对 11 条技术路线分级治理（4 条已推广 / 2 条活跃 / 5 条降级为技术储备），其中英语结构化生成主线被 7 月产品文档指定为唯一真源——资源持续向在产验证的路线倾斜",
      "与数学 / 生物 / 文科 / 剪辑 4 类业务方代表深度对齐需求，输出项目主线、阶段 spec、技术附录与离职交接文档等完整 PM 文档",
    ],
    impact: [
      { value: "11 项", label: "工具与作品 · 4 款进真实生产" },
      { value: "40→20 min", label: "单剧本剪辑处理 · 专人制作→新手自助（GUI/Skill 双入口）" },
      { value: "30→3~5 min", label: "单剧本资料整理" },
    ],
    tech: ["Prompt Engineering", "Python", "PPT COM / python-pptx", "VLM（Doubao-Seed）", "FastAPI", "rembg / U2Net", "Next.js"],
    shots: [
      { src: "/images/gallery/real-animation-platform.png", alt: "AI 动画生产辅助平台的剧本解析界面，含角色卡与场景卡", caption: "动画生产辅助平台——剧本解析：角色 / 场景卡与 AI 生成参考图（真实部署环境）", w: 1912, h: 1932 },
      { src: "/images/gallery/real-animation-episodes.png", alt: "AI 动画平台分集制作页：视频播放器与首帧图网格", caption: "分集制作页——切片视频 + 首帧图网格（鲁提辖项目，本地实测）", w: 1440, h: 900 },
      { src: "/images/gallery/real-animation-characters.png", alt: "AI 动画平台角色设计页：鲁提辖、镇关西、金翠莲等 8 个角色卡与儿童绘本风 AI 立绘", caption: "角色设计页——鲁提辖项目 8 角色 AI 立绘、性格标签与逐卡重生成（儿童向画风）", w: 1280, h: 720 },
      { src: "/images/gallery/real-browser-plugin.png", alt: "剧本资料汇总导出浏览器插件弹窗", caption: "剧本资料导出插件弹窗——自动采集切片数据并导出 HTML / XLSX", w: 400, h: 560 },
    ],
    subTools: [
      // —— 上游：资料与素材（2）—— 剧本资料整理、素材提取是生产链起点
      { name: "剧本资料整理插件（资料导出）", form: "浏览器插件 · 试用后叫停", group: "资料与素材 · 上游配套", desc: "教研资料导出与进度评审自动化，实测单剧本节省约 30 分钟（约 50 切片资料导出 + 进度评审表）；部分试用后因数据合规风险主动叫停，推动开发提供官方导出接口替代，沉淀「合规优先」判断复盘" },
      { name: "生图去水印扩展（调研引入）", form: "浏览器扩展 · 已进生产流程", group: "资料与素材 · 上游配套", desc: "识别团队在豆包 / Dola / 千页提取无水印图片视频的共性需求后，调研引入现成扩展（无印豆包 · 素材提取）并推广使用——确定性需求优先用现成方案，不自研重复造轮子；调研引入，未计入 11 项工具卡" },
      // —— 课件（PPT）加工 · 静态复刻（4）——
      { name: "PPT 静态加工工具", form: "GUI 工具 · 已推广", group: "课件（PPT）加工 · 静态复刻", desc: "4 层语义 pipeline（输入理解→页面规划→生产执行→校验反馈），跨学段 + 跨学科 + 跨输入格式验证，单 case 40-50 秒" },
      { name: "理科静态加工 Web 版", form: "网页应用 · 已推广", group: "课件（PPT）加工 · 静态复刻", desc: "3 阶段加工：基础排版 / 图片重绘抠图 / 思维导图转原生对象；思维导图等矢量元素结构对齐原稿并转为可编辑对象，产出供制作老师接手精修的初稿" },
      { name: "英语 PPT 提效主线（wenke）", form: "活跃主线 · 结构化生成", group: "课件（PPT）加工 · 静态复刻", desc: "英语课件结构化生成唯一真源（7 月产品文档指定）：上游 HTML 数据革新 + 基础模板，v0.4.x 持续迭代，交付 v1.2 完整工程交接包；通用化模板与动画完善推进中" },
      { name: "HTML 交互课件", form: "网页课件 · POC 在线", group: "课件（PPT）加工 · 静态复刻", desc: "以「剧本 JSON + 基础 HTML + 学科模板」生成可播放、可互动、可在线编辑的网页课件；小学英语 POC 已在线发布，63 个原始 SID 规范化为 45 个正确分支播放步骤" },
      // —— 课件（PPT）加工 · 动画注入（3）—— 静态帧之上 1:1 复刻板书动画
      { name: "动画注入插件（PPAM）", form: "PPT 插件 · 已推广", group: "课件（PPT）加工 · 动画注入", desc: "7 项动画功能，与静态工具文本框拆分协同；自动注入流程跑通 79 个动画动作，r10 播放基线验证通过" },
      { name: "自动动画注入 injection-lab", form: "实验项目", group: "课件（PPT）加工 · 动画注入", desc: "面向全自动动画注入的实验流水线（区别于人工 PPAM 基线），main@v0.3.0 已合并、feat@v0.4.0 运行适配中——从半自动到全自动的下一步探索" },
      { name: "数学动画自动渲染流水线", form: "自动化流水线 · 技术储备", group: "课件（PPT）加工 · 动画注入", desc: "「剧本 + PPT 版面 + 动画指令」→ 可渲染视频切片：翻译层、执行层、全局状态归一化、切片渲染、正确 / 错误分支分别渲染并拼接为互动题视频；程序兜底跨切片坐标跳变、字体状态、排版碰撞；接入 Manim 图形包支持点线边高亮，单条视频生成到渲染约 20-30 分钟；完成 Manim vs PPT（ppt-master）双路线技术选型判断——批量提效走 Manim、精修质感走 PPT" },
      // —— 录屏剪辑（1）——
      { name: "录屏后处理工具 V2", form: "GUI + Skill · 已推广", group: "录屏剪辑", desc: "PPT 标记导出 → 视频切片 → S 编号重命名 → ZIP 打包四步串联，GUI 与 Claude Code Skill 双入口（主推 GUI）；把「负责人集中代跑」转变为「实习生自助处理、负责人只处理异常」——此前剪辑只有负责人会做、剧本一多就积压，现在新手也能自助并行处理，10 个剧本从 1 人串行约 5 小时变为多人并行、约 20 分钟/人" },
      // —— 全流程与能力底座（2）——
      { name: "AI 教育动画生产辅助平台", form: "Web 平台 · 收缩聚焦", group: "全流程与能力底座", desc: "以剧本项目为单位整合全流程：剧本解析（自动提取标题/角色/场景/切片/分支）→ 角色 / 场景参考图约束跨切片一致性 → 切片制作（首帧图 + 视频提示词 + 视频片段，支持首帧 / 尾帧 / 中间帧 / 参考图多种约束）→ 统一导出；多模型接入并对接公司统一网关。设定可验证的阶段目标口径：单剧本周期 5 天→3.5 天以内、新人上手 1 天→半天、图片可用率 ≥70%（Next.js）" },
      { name: "AI Skills 工具箱", form: "AI Skill / CLI Harness · 能力底座", group: "全流程与能力底座", desc: "定制 Photoshop CLI harness 与 dashi-ppt 生成 Skill，横向研究 ppt-master / dashi-ppt / baoyu-design 等开源方案并二次开发，为静态加工工具提供能力底座" },
    ],
    reflection:
      "AI 产品的关键不是接通更多模型，而是明确不确定性出现在哪里、怎样被校验，以及业务愿意承担多少修正成本。先产品化确定性高、可验收的环节，再逐步引入生成能力。另一个内化的原则：一线业务信息是证据来源，不直接等于产品结论——「做一个平台 / 用 HTML / 全自动化 / 接某个模型」都是方案，不是问题。",
    dataNote:
      "数据口径：剪辑单剧本由专人操作约 40 分钟转为约 20 分钟无人值守+人工审核（交接文档记录区间 30 分钟~1 小时，40 分钟为常见值，与简历口径一致）；「1 人串行约 5 小时→多人并行约 20 分钟/人」为 10 剧本积压批次的场景口径，不作为独立人数指标；剧本资料整理由约 30 分钟压缩至 3~5 分钟；40% 首帧可用率为对应测试场景数据。不引用无测算记录的整体百分比，单点实测数据优先。",
  },
  {
    slug: "exam-designer",
    title: "智慧试卷设计师",
    category: "AI Agent",
    tagline: "AI Agent 个性化出卷系统 · 全国三等奖",
    role: "队长",
    period: "2025.01 - 2025.05",
    featured: true,
    cover: "/images/gallery/real-exam-app.png",
    summary:
      "面向传统出卷效率低、教师需求难以结构化等痛点，基于大模型与 RAG 构建个性化出卷 AI Agent（出卷智能体 + 题库智能体双角色协同），完成学术型 / 基础型 / 竞赛型三类场景的真实出卷验证，获全国人工智能应用创新大赛国家三等奖。",
    problem: "传统出卷依赖人工选题组卷，效率低；教师出卷意图多为非结构化自然语言，难以直接转化为可执行的命题规则。",
    approach: [
      "整合 M3KE、GAOKAO_BENCH 等数据集构建知识库，制定数据规范，为 RAG 检索增强生成奠定基础",
      "基于大模型设计意图识别策略，将教师非结构化语言需求转化为结构化 JSON 指令，实现精准个性化出卷",
      "通过百度千帆 AppBuilder 平台优化 Prompt 与应用配置，设计「出卷智能体 + 题库智能体」双角色协同完成试卷个性化出卷系统",
      "按学术型（高二期末、高难度）、基础型、竞赛型三类场景设计提示词并验证真实出卷效果；针对大纲理解粒度不足问题，提出引入学科知识图谱、要求生成内容附引用溯源的改进建议",
    ],
    impact: [
      { value: "国赛三等奖", label: "全国 AI 创新大赛" },
      { value: "3 类", label: "出卷场景真实验证" },
      { value: "RAG", label: "检索增强生成" },
      { value: "JSON 化", label: "意图识别策略" },
    ],
    tech: ["AI Agent", "RAG", "百度千帆 AppBuilder", "Prompt Engineering", "意图识别"],
    shots: [
      { src: "/images/gallery/real-exam-app.png", alt: "百度千帆 AppBuilder 应用卡片与智慧试卷设计师出卷界面", caption: "智慧试卷设计师·千帆 AppBuilder 应用——角色设定（出卷 + 题库双智能体）与出卷界面（参赛提交版）", w: 1920, h: 1080 },
      { src: "/images/gallery/real-exam-results.png", alt: "学术型/基础型/竞赛型三种场景的提示词与生成的试卷内容", caption: "三类出卷场景验证——提示词与真实生成试卷成对对照（学术型 / 基础型 / 竞赛型）", w: 1920, h: 1080 },
    ],
  },
  {
    slug: "multi-agent-intel",
    title: "科技前沿识别多智能体工作流系统",
    category: "Multi-Agent",
    tagline: "省重点实验室开放基金项目 · 迭代至 v1.0 完成高校正式交付",
    role: "核心成员 · 主导 AI-Native 开发与交付",
    period: "2025.01 - 2025.12",
    featured: true,
    cover: "/images/projects/multi-agent.svg",
    summary:
      "面向科技情报领域，设计并落地「采集-抽取-分析-成报-审核」多智能体工作流系统。从实验室开放基金课题起步，迭代至 SciAgent v1.0 完成对高校科研团队的正式交付——可复现、可维护、可验收的研究支撑能力，而非仅可运行代码。",
    problem: "科技前沿情报散落于 ArXiv、GitHub 等多源异构渠道，人工追踪耗时且难以体系化，难以高效转化为可决策的洞察；而生成式报告缺乏质量控制机制，难以直接服务科研场景。",
    approach: [
      "工作流设计：v1.0 采用 5 步 LangGraph 编排——数据采集管道（混合爬虫 + 向量过滤 + 质量筛选，无 LLM）→ 事实抽取器（A/B/C 分级 + 时间过滤）→ 深度分析师 → 报告生成器 → 质量审核员；审核不通过自动回退报告生成，形成闭环修订机制",
      "混合爬虫两阶段调度：aiohttp 异步爬取静态页面优先，JS 重度页面自动切换 Chromium 无头浏览器补救，信息源从早期 8 类扩展至 136 个全球信息源",
      "工程化交付：FastAPI + SSE 实时进度推送、前端单页操作界面、AsyncSqliteSaver 断点恢复；配套一键启动脚本、README、交付使用报告与历史示例数据",
      "验收方法论：设计「可用性→配置→流程→成果」四步验收实验（A-D），每步有明确操作与通过标准，支撑新环境复现与部署验收",
    ],
    impact: [
      { value: "v1.0", label: "高校正式交付（2026.03）" },
      { value: "136 个", label: "全球信息源" },
      { value: "5 步", label: "LangGraph 工作流闭环" },
      { value: "4 步", label: "标准化验收实验" },
    ],
    tech: ["LangGraph", "LangChain", "FastAPI + SSE", "混合爬虫（aiohttp / crawl4ai）", "ChromaDB", "BGE 向量", "AsyncSqliteSaver"],
    shots: [
      { src: "/images/gallery/real-sciagent-ui.png", alt: "SciAgent 多智能体系统的任务管理界面，显示五阶段工作流", caption: "SciAgent v1.0 工作台——五阶段工作流实时可见", w: 1440, h: 900 },
      { src: "/images/gallery/real-sciagent-report.png", alt: "系统自动生成的科技情报快报页面", caption: "系统产出的科技情报快报——从 136 个信息源自动成稿", w: 1440, h: 900 },
      { src: "/images/gallery/real-sciagent-delivery.png", alt: "SciAgent v1.0 交付使用报告封面，含目录与交付边界说明", caption: "交付使用报告（2026.03）——运行原理、实验验证流程与部署验收方法的完整交付文档", w: 1192, h: 1686 },
    ],
    reflection:
      "从实验室原型到商业交付，最大的跨越不是加功能，而是把「能跑」变成「可验收」：每一步都有通过标准的实验设计、断点可恢复的执行链路、以及面向新环境的复现文档——这决定了系统能不能离开开发者独立存活。",
  },
  {
    slug: "llm-eval-solid-battery",
    title: "磐石行业大模型 vs 通用模型系统性评测",
    category: "LLM Evaluation",
    tagline: "全固态锂电池知识体系构建能力 · 6 组对照测试 · 结构化测评报告",
    role: "科研项目助理 · 评测设计、执行与报告撰写",
    period: "2025.10",
    company: "中国科学院武汉文献情报中心",
    featured: true,
    cover: "/images/gallery/real-eval-report-method.png",
    summary:
      "行业大模型宣称具备专业领域优势，但「专业」需要可复现的证据。以人工核查的全固态锂电池知识体系为基准，设计 6 组对照测试用例完成磐石大模型 vs 通用模型（Kimi K2.0）的系统性评测，覆盖 Chat 模式与文献罗盘双模式，从准确性、深度、逻辑性、术语规范性四维输出结构化测评报告，支撑模型选型决策。",
    problem:
      "磐石大模型面向专业科研场景，但其「专业性」缺乏客观量化依据：优势是否真实存在、幅度多大、在哪种模式与输入组合下成立，都需要一套公正可复现的评测流程来回答，而不是靠主观印象判断。",
    approach: [
      "基准构建：以团队人工整理核查的高质量全固态锂电池知识体系（7 个基准大类）为黄金标准，所有模型输出均以此为基准对比分析",
      "测试矩阵设计：2 个模型 × 模式（磐石 Chat / 磐石文献罗盘 / Kimi 标准模式）× 输入方式（直接对话 / 上传 3 篇高相关综述文献并关闭外部搜索），构成 6 组独立对照用例",
      "变量控制：全部用例使用同一版本的结构化基准提示词——角色设定 + 严格输出格式 + 专业深度要求 + 无关内容的格式示例，确保结果可比性",
      "三维评测框架：知识内容质量（覆盖度 / 准确性 / 扩展性）、知识组织能力（自主构建逻辑性 / 术语规范性）、场景适应能力（模式与输入方式差异分析）",
      "证据链留存：每个用例完整留存输出截图、文字与录屏，报告结论均可回溯到原始证据",
    ],
    impact: [
      { value: "6 组", label: "对照测试用例" },
      { value: "四维", label: "结构化测评报告" },
      { value: "7/7", label: "对照测试中覆盖度最高的组合" },
      { value: "3 维度", label: "评测分析框架" },
    ],
    tech: ["结构化 Prompt 设计", "对照实验设计", "知识体系基准构建", "多维评级框架", "证据链留存（截图 / 录屏）"],
    shots: [
      { src: "/images/gallery/real-eval-report-cover-top.png", alt: "磐石大模型测评报告标题与测试日期", caption: "测评报告（2025.10.11）——标题页（内部成果，对外展示脱敏版式）", w: 1224, h: 144 },
      { src: "/images/gallery/real-eval-report-method.png", alt: "测评报告测试矩阵、结构化基准提示词与评测维度页", caption: "评测方法论页——测试矩阵（2 模型 × 双模式 × 双输入 = 6 组用例）、统一结构化基准提示词与三维评测框架", w: 1224, h: 1584 },
    ],
    reflection:
      "评测的价值在「可复现 + 可解释」：固定基准、固定提示词、固定输入条件后，模型间差异才能归因于能力本身而非随机性。结论也不能停在「谁更强」，要落到「哪种组合在什么场景下用」——在本评测的 6 组对照中，文献罗盘 + 上传文献的组合覆盖度最高。",
    dataNote:
      "报告完成于 2025.10.11；覆盖度以人工核查知识体系的 7 个基准大类为分母；全部用例使用同一版本结构化提示词与相同 3 篇上传文献。评测报告为机构内部成果，本页仅公开展示评测设计方法论页，各模型表现对比与结论细节可在面试中出示完整报告。",
  },
  {
    slug: "battery-industry-report",
    title: "动力电池产业产学研合作情报分析",
    category: "Industry Intelligence",
    tagline: "《战略趋同与路径分化》· 15 页深度解析 · 独立署名撰写",
    role: "独立撰写",
    period: "2025.07",
    company: "中国科学院武汉文献情报中心",
    featured: false,
    cover: "/images/gallery/real-battery-report-cover.png",
    summary:
      "独立撰写的产业情报分析报告《战略趋同与路径分化：2025 年中国动力电池产业产学研合作深度解析》——以宁德时代、比亚迪为双主线，覆盖国轩高科、欣旺达、亿纬锂能、中创新航、蜂巢能源等挑战者阵营，构建 7 家头部企业的全景合作矩阵，输出三类战略分化路径的判断与战略启示。",
    problem:
      "动力电池产业进入固态电池等技术竞速期，头部企业的产学研合作策略差异显著，但信息散落在公告、新闻与研报中，缺乏一份系统对比、可直接支撑机构科技情报服务的深度解析。",
    approach: [
      "三类战略分层框架：宁德时代（构建多领域研究霸权的技术霸权生态）、比亚迪（精通产业-教育一体化的人才供应链）、挑战者阵营（以技术押注谋求弯道超车）",
      "挑战者逐家深挖：国轩高科以科学底蕴追求先进材料突破、欣旺达广撒网寻求技术突破、亿纬锂能以全球化研发驱动国际扩张、中创新航与蜂巢能源聚焦未来的技术押注",
      "前沿专题分析：固态电池研发路径的比较分析，以及从深度研发到人才管道的合作模式组合研究",
      "全景合作矩阵：7 家头部企业 × 主要合作高校 × 研发投入方向的系统对比，收敛出战略启示与未来轨迹",
    ],
    impact: [
      { value: "7 家", label: "头部企业全景对比" },
      { value: "3 类", label: "战略分化路径框架" },
      { value: "15 页", label: "深度解析报告" },
      { value: "独立署名", label: "报告唯一作者" },
    ],
    tech: ["产业情报分析", "战略分层框架", "对比矩阵构建", "结构化写作"],
    shots: [
      { src: "/images/gallery/real-battery-report-cover.png", alt: "动力电池产业报告封面：标题、作者署名与摘要", caption: "报告封面与摘要——独立署名的产业情报分析（2025.07）", w: 1224, h: 1584 },
      { src: "/images/gallery/real-battery-report-matrix.png", alt: "全景合作矩阵表格：7 家企业 × 合作高校 × 研发方向", caption: "全景合作矩阵——宁德时代 / 比亚迪 / 国轩高科等 7 家头部企业的合作布局系统对比", w: 1224, h: 1584 },
    ],
    reflection:
      "情报分析的价值不在罗列信息，而在给出「分层框架 + 矩阵对比 + 战略启示」的判断结构——让读者从 7 家企业的合作细节中看到三类可决策的战略路径，而不是一堆新闻的堆砌。",
  },
  {
    slug: "nsf-intel-research",
    title: "美国 NSF 情报与战略工作机制系列调研",
    category: "S&T Intelligence",
    tagline: "科研资助机构情报工作调研 · 首版主笔（V3）→ 协作迭代至 V8",
    role: "主笔（首版 V3）· 协作迭代（V5-V8）",
    period: "2025.08 - 2025.10",
    company: "中国科学院武汉文献情报中心",
    featured: false,
    cover: "/images/gallery/real-nsf-org.png",
    summary:
      "围绕「科研资助管理机构如何开展情报与战略工作」的机构情报服务课题，主笔完成美国 NSF 首版调研报告（V3，25 页）：覆盖机构治理架构、四层战略决策机制、预算轨迹、外部评估体系与科研安全治理；后续围绕首席信息官办公室开展系列补充调研，多轮迭代至 V8，支撑机构科技情报服务。",
    problem:
      "机构需要系统了解美国 NSF 如何组织情报与战略工作——治理、预算、评估、安全各自如何运转，而相关信息散落在年报、预算文件、战略规划与第三方研究中，需要结构化、可追溯的调研成果而非零散摘编。",
    approach: [
      "治理架构拆解：将 NSF 模式解构为「法定顶层治理（NSB）— 管理层中期战略 — 执行部门（OIA / TIP 等）— 外部评估伙伴（兰德公司、SRI）」的四层架构，分析其功能分离与整合逻辑",
      "预算轨迹追踪：对照 FY2024-2026 各账户预算变化，解读预算削减背后的战略收缩与资源聚焦方向",
      "情报成果机制：梳理 NCSES 统计体系与《科学与工程指标》如何支撑 NSB 的前瞻性战略决策",
      "科研安全专题：分析 NSF 对外部专业输入的借鉴——JASON《基础研究安全》报告与 TR 风险管控机制",
      "迭代协作：首版（V3）独立完成后，与团队协作完成首席信息官办公室系列补充调研，经 V5 → V8 多轮修订适配机构情报服务的持续需求",
    ],
    impact: [
      { value: "25 页", label: "首版调研报告（V3）" },
      { value: "V8", label: "系列调研最终迭代" },
      { value: "4 层", label: "治理架构分析框架" },
      { value: "FY24-26", label: "预算轨迹追踪" },
    ],
    tech: ["科技情报调研", "机构治理分析", "预算文件解读", "多轮迭代修订"],
    shots: [
      { src: "/images/gallery/real-nsf-toc.png", alt: "NSF 调研报告目录页：美国科研资助管理机构、NSF 概况、研究能力等章节", caption: "首版调研报告（V3，2025.08）目录——从机构概况到情报与战略成果的完整章节结构", w: 1191, h: 1684 },
      { src: "/images/gallery/real-nsf-org.png", alt: "NSF 组织架构和任职情况图", caption: "NSF 组织架构与任职情况图——八大学部、主任办公室与跨学部办公室的治理结构", w: 1191, h: 1684 },
      { src: "/images/gallery/real-nsf-framework.png", alt: "NSF 四层架构分析：功能分离与整合", caption: "四层架构分析——NSB 顶层治理 / 管理层战略 / 执行部门 / 外部评估伙伴的功能分离与整合", w: 1191, h: 1684 },
    ],
    reflection:
      "机构情报调研的关键是「结构先行」：先建立治理—预算—评估—安全的分析框架，再往里填证据，读者才能从 25 页里看懂一个机构的运转逻辑，而不是面对资料堆砌。",
    dataNote:
      "首版调研报告（V3，2025.08.19）为独立署名；后续补充调研（V5-V8）与团队成员协作完成；调研内容均基于公开资料整理，报告为机构内部情报服务成果。",
  },
  {
    slug: "chengyan-assistant",
    title: "澄颜智答｜美妆零售知识检索与客服协作",
    category: "AI Solution · FDE",
    tagline: "美妆零售知识检索 POC · 需求到交付的完整证据链",
    role: "独立负责人",
    period: "2026.08",
    company: "FDE 共学营",
    featured: true,
    cover: "/images/gallery/real-chengyan-chat.png",
    summary:
      "面向美妆零售场景的知识分散、回答无依据、高风险升级不稳定三大问题，独立完成从 AS-IS/TO-BE 业务流程调研、SOW、方案设计到 Web 原型、API 接入与 Eval 验收的完整交付。",
    problem:
      "美妆零售客服场景中，产品知识散落在多份文档里，客服回答缺乏依据可循；功效宣称等专业问题存在合规边界；退换货、不良反应等高风险问题缺乏稳定的人工升级路径。",
    approach: [
      "业务调研与问题定义：完成 AS-IS / TO-BE 业务流程分析，输出需求说明与 SOW，明确交付边界与验收标准",
      "知识库与检索方案：将 5 篇模拟知识文档结构化为 39 个知识块，落地确定性检索、引用溯源与风险门禁 API，候选回复必须附引用、高风险场景强制转人工",
      "系统接入与运行证据：本地服务提供 /api/health 与 /api/query 接口，记录实际答复、引用、人工升级、风险原因、置信度与延迟的完整数据流",
      "Eval 验收：15 条自建用例批量运行并经 AI 专业定性审阅确认；工程冒烟检查与业务准确率分开表述，不填未经确认的数字分",
    ],
    impact: [
      { value: "7 天", label: "需求到交付全链路" },
      { value: "15 条", label: "自建用例全部返回候选" },
      { value: "P95 4.05ms", label: "接口延迟" },
      { value: "39 块", label: "结构化知识块" },
    ],
    tech: ["RAG 检索", "风险门禁", "引用溯源", "FastAPI", "Eval 设计", "SOW 与排期"],
    shots: [
      { src: "/images/gallery/real-chengyan-chat.png", alt: "澄颜智答 Web 原型问答界面：知识库文档树与带引用的候选回复", caption: "Web 原型问答界面——知识库文档树 + 带引用标记的候选回复（本地真实运行）", w: 1280, h: 720 },
      { src: "/images/gallery/real-chengyan-escalation.png", alt: "高风险问题强制转人工的演示界面，含风险原因标记", caption: "高风险问题强制转人工演示——风险原因标记（敏感人群 / 不良反应）与置灰的候选回复", w: 1440, h: 900 },
      { src: "/images/gallery/real-chengyan-dataflow.png", alt: "系统数据流图：意图风险识别、知识检索、引用溯源、风险门禁模块", caption: "系统数据流——意图 / 风险识别 → 知识检索 → 引用溯源 → 风险门禁的完整链路", w: 1600, h: 900 },
    ],
    reflection:
      "FDE 式交付的关键是把「验证过什么、没验证什么」写清楚：引用覆盖率、转人工触发、安全兜底都是证据，而模糊的「准确率」反而不可信。",
    dataNote:
      "口径说明：FDE 共学营课程实战项目的模拟业务场景，非真实客户交付，未接真实 ERP / 实时库存；15 条用例 / 11 条带引用 / 10 条转人工 / P95 4.05ms 均为本地真实运行记录。",
  },
  {
    slug: "supply-chain-data",
    title: "零售供应链数据管理系统",
    category: "Data System",
    tagline: "「小鑫百货」货品管理数据库 · E-R 设计到 SQL 实现",
    role: "负责人",
    period: "2023.10 - 2023.12",
    featured: false,
    cover: "/images/gallery/real-sql-er.png",
    summary:
      "独立完成「小鑫百货企业货品管理数据库」的设计与实现：从企业业务流程分析出发设计 E-R 模型（产品 / 仓库 / 分销商 / 订单 / 供应商五表），逐表完成结构设计与三范式检查，编写 SQL 脚本实现建表、条件查询、聚合统计、多表组合查询与备份更新全流程。",
    problem: "零售进销存数据分散、非结构化，难以快速产出可决策的品类 / 地域维度报表。",
    approach: [
      "基于业务流程分析设计 E-R 模型：产品、仓库、分销商、订单、产品供应商五张表，明确仓库-供应商多对多等联系",
      "逐表完成结构设计并检查第一/第二/第三范式，确保每列原子性、非主属性不完全与传递依赖",
      "编写 SQL 实现 WHERE 条件查询、LIKE 通配符、日期函数、GROUP BY 聚集统计、多表组合查询，以及备份、更新、删除的完整数据操作链",
    ],
    impact: [
      { value: "5 表", label: "E-R 模型设计" },
      { value: "3NF", label: "范式检查通过" },
      { value: "多表", label: "组合查询与聚合统计" },
    ],
    tech: ["SQL", "数据库设计", "E-R 建模", "数据分析"],
    shots: [
      { src: "/images/gallery/real-sql-er.png", alt: "小鑫百货货品管理数据库 E-R 图与实体关系分析", caption: "E-R 模型设计——产品 / 仓库 / 分销商 / 订单 / 供应商实体与联系分析（课程大作业原件）", w: 1191, h: 1684 },
      { src: "/images/gallery/real-sql-aggregate.png", alt: "GROUP BY 聚集函数查询的 SQL 代码与结果截图", caption: "GROUP BY 聚集统计查询——SQL 代码与真实执行结果", w: 1191, h: 1684 },
      { src: "/images/gallery/real-sql-join.png", alt: "多表组合查询的 SQL 代码与结果截图", caption: "多表组合查询——跨 products / orders 等表的字段关联与执行结果", w: 1191, h: 1684 },
    ],
  },
  {
    slug: "store-booking-site",
    title: "跨境电商体验店官网与预约系统",
    category: "AI-Assisted Delivery",
    tagline: "独立探索 · 与 AI 编程 Agent 协作从需求到交付",
    role: "独立完成 · 需求定义 / 产品设计 / 验收",
    period: "2026.09",
    company: "个人探索项目",
    featured: false,
    cover: "/images/gallery/real-store-home.png",
    summary:
      "为线下跨境电商体验店场景独立完成的官网与到店预约系统：纯 Node.js 零依赖实现（店员电脑双击即可运行），预约数据落盘本地 JSON 台账并自动轮换备份，配套店员后台的查询 / 搜索 / CSV 导出；从需求定义、占位信息与上线清单、安全分级到 53 项黑盒自测验收，全程与 AI 编程 Agent 协作完成，v1→v4 四轮迭代全程留档。",
    problem:
      "小微门店通常没有 IT 运维，官网与预约登记若依赖云端服务，就有成本、部署与数据归属三重顾虑——需要一套店员电脑双击即用、数据完全留在本地的轻量方案；且正式营业前的商品与门店信息必然是占位状态，上线替换路径必须从第一天就设计好。",
    approach: [
      "需求与边界定义：官网前台（导航 / 商品 / 地址 / 预约）与店员后台（台账）双端拆分，预约编号（LY-日期-随机码）、状态、来源 IP 等字段随需求一并定义",
      "上线清单思维：地址 / 电话 / 9 款商品卡 / 顾客评价 / 公告 / 店名全部在 README 占位替换表中逐项列出替换方法——交付即可被任何人接手上线",
      "数据安全设计：JSON 台账每次写入前自动轮换备份最近 10 版，损坏文件自动保全、服务不崩溃；删除接口必须设置管理密钥，预览模式默认禁用",
      "防滥用与稳健性：同手机号 1 分钟限提交 1 次、单 IP 每分钟 60 次上限；目录穿越请求返回 403，端口占用、台账损坏等异常路径显式处理",
      "验收先行：编写 53 项黑盒自测（页面 / 接口 / 异常 / 并发 / 穿越防护全覆盖），以 SUMMARY_JSON 输出机器可读结论并留存验收自检报告",
    ],
    impact: [
      { value: "53/53", label: "黑盒自测全量通过" },
      { value: "零依赖", label: "Node ≥14 双击即用" },
      { value: "10 版", label: "台账自动轮换备份" },
      { value: "4 轮", label: "v1→v4 迭代留档" },
    ],
    tech: ["Node.js（零依赖）", "JSON 台账存储", "REST API", "黑盒测试设计", "AI 编程 Agent 协作"],
    shots: [
      { src: "/images/gallery/real-store-home.png", alt: "跨境电商体验店官网首页：导航、公告条与门店 Hero 区", caption: "官网首页——导航 / 公告条 / 门店 Hero 与预约入口（本地部署运行实拍）", w: 1440, h: 900 },
      { src: "/images/gallery/real-store-products.png", alt: "官网商品展示区：9 款跨境商品卡片网格", caption: "商品展示区——9 款跨境商品卡片（品牌 / 产地 / 价格为上线前示意占位）", w: 1440, h: 1100 },
      { src: "/images/gallery/real-store-admin.png", alt: "店员后台预约台账：统计卡片、搜索与预约记录表格", caption: "店员后台——累计预约 / 今日新增统计、姓名手机号搜索、CSV 导出与预约台账（记录为脚本注入的模拟数据）", w: 1440, h: 900 },
    ],
    reflection:
      "AI 编程 Agent 把「一个人做出能运行的系统」变成现实之后，产品经理的增量价值进一步转移到需求边界、上线清单与验收标准上——这些恰恰是 AI 最难完全代劳的部分。",
    dataNote:
      "口径说明：个人探索项目，为门店场景设计并本地部署验证，未正式上线营业；页面中商品 / 评价 / 门店信息均为 README 占位替换表列明的示意数据，后台台账截图为脚本注入的模拟预约（姓名与手机号均为本地生成的模拟数据）。",
  },
];

export const FEATURED_WORK = CASE_STUDIES.filter((c) => c.featured);
export const OTHER_WORK = CASE_STUDIES.filter((c) => !c.featured);

// 作品页分区：按经历阶段组织案例，而不是 featured / other 平铺
export const WORK_GROUPS: { key: string; label: string; en: string; slugs: string[] }[] = [
  {
    key: "intern",
    label: "实习交付",
    en: "Internship Delivery",
    slugs: ["edu-ai-animation"],
  },
  {
    key: "research",
    label: "科研与情报",
    en: "Research & Intelligence",
    slugs: ["multi-agent-intel", "llm-eval-solid-battery", "battery-industry-report", "nsf-intel-research"],
  },
  {
    key: "compete",
    label: "竞赛与课程",
    en: "Competition & Course",
    slugs: ["exam-designer", "chengyan-assistant"],
  },
  {
    key: "early",
    label: "早期作品",
    en: "Early Work",
    slugs: ["supply-chain-data"],
  },
  {
    key: "explore",
    label: "独立探索",
    en: "Independent Exploration",
    slugs: ["store-booking-site"],
  },
];

// ----------------------------------------------------------------------------
// 方法论 —— 验证纪律（实习中沉淀，可复用；不使用"自创框架"式品牌化命名）
// ----------------------------------------------------------------------------
export const METHODOLOGY = {
  title: "方法论沉淀",
  description:
    "在科研情报项目与产品实习中沉淀的验证纪律：用对照实验约束评测，用阶段准出条件约束节奏，用证据分级约束表达，让每一步推进都有可复现的口径。",
  blocks: [
    {
      index: "01",
      name: "Exit Criteria 阶段路线图",
      en: "Stage-Gated Roadmap",
      desc: "以准出条件驱动 5 阶段路线图（静态布局 → 动态注入 → 全流程串联 → 多学科扩展 → 批量化），每阶段设明确的准出条件，不达标不进入下一阶段。",
    },
    {
      index: "02",
      name: "五级证据分级",
      en: "Evidence Grading",
      desc: "所有数字按五级标注——实测 / 阶段性试测 / 估算 / 目标 / 待测，配套 8 维验证指标（问题复现、输入可获得性、端到端跑通、产物可接手、人工总成本、异常兜底、跨案例复现、安全成本），明确「产物门」与「项目价值门」分离——把目标值汇报为已达成是红线。",
    },
    {
      index: "03",
      name: "收缩决策原则",
      en: "Validate Then Decide",
      desc: "确定性环节优先产品化，AI 不确定环节先验证关键假设。首帧素材可用率约 40% 时主动收缩平台投入，是被验证过的取舍案例。",
    },
    {
      index: "04",
      name: "对照评测与四步验收",
      en: "Comparison & Acceptance",
      desc: "中科院科研情报期间沉淀：以人工核查的知识体系为基准设计 6 组对照测试用例与统一的结构化基准提示词，完成行业大模型 vs 通用模型的系统性评测、支撑选型；SciAgent v1.0 高校交付时设计「可用性 → 配置 → 流程 → 成果」四步验收实验，每步有明确操作与通过标准——先证明可复现，再谈交付。",
    },
  ],
};

export const AWARDS = [
  { title: "全国人工智能应用创新大赛", detail: "国家三等奖", year: "2025" },
  { title: "国家励志奖学金", detail: "连续三年获得", year: "2021-2023" },
  { title: "河南省「挑战杯」", detail: "铜奖", year: "2023" },
  { title: "腾讯未来产品经理创造营", detail: "结课认证", year: "2024" },
  { title: "河南省三好学生", detail: "省级荣誉", year: "2024" },
  { title: "河南省「互联网+」二等奖", detail: "省级竞赛", year: "2023" },
  { title: "北斗星通企业奖学金", detail: "企业奖学金", year: "2023" },
];

// ----------------------------------------------------------------------------
// Gallery — 项目实录（全部为本人交付系统的真实截图，next/image 自动优化）
// ----------------------------------------------------------------------------
export type GalleryCategory = "edu" | "research" | "course" | "explore";

export interface GalleryItem {
  src: string;
  alt: string;
  title: string;
  caption: string;
  category: GalleryCategory;
  span2?: boolean; // 桌面端跨两列
}

export const GALLERY_CATEGORIES: { key: GalleryCategory | "all"; label: string }[] = [
  { key: "all", label: "全部" },
  { key: "edu", label: "教育动画平台" },
  { key: "research", label: "科研与情报" },
  { key: "course", label: "竞赛与课程" },
  { key: "explore", label: "独立探索" },
];

export const GALLERY: GalleryItem[] = [
  // ---- 教育动画平台（实习交付）----
  {
    src: "/images/gallery/real-animation-platform.png",
    alt: "AI 教育动画生产辅助平台的剧本解析界面：角色卡与场景卡网格",
    title: "AI 动画生产辅助平台",
    caption: "剧本解析 → 角色 / 场景设定 → 分集制作全流程——真实项目《认识三国英雄》的线上界面",
    category: "edu",
    span2: true,
  },
  {
    src: "/images/gallery/real-animation-episodes.png",
    alt: "AI 动画平台分集制作页：视频播放器与首帧图网格",
    title: "分集制作 · 鲁提辖项目",
    caption: "分集制作页——切片视频播放 + AI 生成首帧图网格，剧本到成片的工作台",
    category: "edu",
    span2: true,
  },
  {
    src: "/images/gallery/real-animation-characters.png",
    alt: "AI 动画平台角色设计页：鲁提辖、镇关西、金翠莲等 8 个角色卡与儿童绘本风 AI 生成立绘",
    title: "角色设计 · 鲁提辖项目",
    caption: "角色设计页——鲁提辖、镇关西、金翠莲等 8 个角色的儿童绘本风 AI 立绘、性格标签与逐卡重新生成",
    category: "edu",
  },
  {
    src: "/images/gallery/real-animation-projects.png",
    alt: "AI 动画平台我的项目列表：三国、西游记、鲁智深等真实测试项目卡片",
    title: "项目工作台",
    caption: "「我的项目」工作台——三国 / 西游记 / 鲁智深等真实项目的解析、分集与导出管理",
    category: "edu",
  },
  {
    src: "/images/gallery/real-annotation-workbench.png",
    alt: "手写 Badcase 打标工作台的单样本盲看复核界面",
    title: "手写 Badcase 打标工作台",
    caption: "盲看-揭示两阶段复核流程，S121 样本的真实标注界面——AI 预填 + 人工核查",
    category: "edu",
  },
  {
    src: "/images/gallery/real-browser-plugin.png",
    alt: "剧本资料汇总导出浏览器插件的弹窗界面",
    title: "剧本资料导出插件",
    caption: "Edge / Chrome 插件弹窗——自动采集切片数据，导出 HTML / XLSX 与白板图、TTS 资源",
    category: "edu",
  },
  {
    src: "/images/gallery/real-courseware-editor.png",
    alt: "HTML 交互课件的标准编辑器界面",
    title: "HTML 课件编辑器",
    caption: "可播放、可互动、可在线编辑的网页课件 POC——小学英语模板",
    category: "edu",
  },
  // ---- 科研与情报（中科院）----
  {
    src: "/images/gallery/real-sciagent-ui.png",
    alt: "SciAgent 多智能体系统的任务管理界面，显示五阶段工作流",
    title: "SciAgent 工作台",
    caption: "科技前沿识别系统 v1.0 的任务管理界面——五阶段工作流实时可见",
    category: "research",
    span2: true,
  },
  {
    src: "/images/gallery/real-sciagent-report.png",
    alt: "系统自动生成的科技情报快报页面",
    title: "系统产出 · 情报快报",
    caption: "多智能体工作流自动生成的科技情报快报——从 136 个信息源到成稿",
    category: "research",
  },
  {
    src: "/images/gallery/real-sciagent-delivery.png",
    alt: "SciAgent v1.0 交付使用报告封面与目录",
    title: "SciAgent 交付使用报告",
    caption: "v1.0 正式交付文档（2026.03）——运行原理、实验验证流程与部署验收方法",
    category: "research",
  },
  {
    src: "/images/gallery/real-eval-report-method.png",
    alt: "磐石大模型测评报告方法论页：测试矩阵、结构化基准提示词与评测维度",
    title: "磐石大模型测评报告 · 方法论",
    caption: "6 组对照测试矩阵 + 统一结构化基准提示词 + 三维评测框架——内部成果对外展示方法论页（2025.10）",
    category: "research",
  },
  {
    src: "/images/gallery/real-battery-report-cover.png",
    alt: "动力电池产业报告封面：标题、作者署名与摘要",
    title: "动力电池产业情报报告",
    caption: "《战略趋同与路径分化：2025 年中国动力电池产业产学研合作深度解析》——独立署名撰写",
    category: "research",
  },
  {
    src: "/images/gallery/real-battery-report-matrix.png",
    alt: "全景合作矩阵表格：7 家企业 × 合作高校 × 研发方向",
    title: "全景合作矩阵",
    caption: "宁德时代 / 比亚迪 / 国轩高科等 7 家头部企业 × 合作高校 × 研发方向的系统对比",
    category: "research",
  },
  {
    src: "/images/gallery/real-nsf-org.png",
    alt: "NSF 组织架构和任职情况图",
    title: "NSF 调研 · 治理架构",
    caption: "美国 NSF 组织架构与任职情况图——首版调研报告（V3，独立署名，2025.08）",
    category: "research",
  },
  // ---- 竞赛与课程 ----
  {
    src: "/images/gallery/real-exam-app.png",
    alt: "百度千帆 AppBuilder 应用卡片与智慧试卷设计师出卷界面",
    title: "智慧试卷设计师 · 应用界面",
    caption: "千帆 AppBuilder 应用——出卷 + 题库双智能体角色设定与出卷界面（全国三等奖参赛提交版）",
    category: "course",
  },
  {
    src: "/images/gallery/real-exam-results.png",
    alt: "学术型、基础型、竞赛型三种场景的提示词与生成的试卷内容",
    title: "智慧试卷设计师 · 出卷验证",
    caption: "学术型 / 基础型 / 竞赛型三类场景——提示词与真实生成试卷成对对照",
    category: "course",
  },
  {
    src: "/images/gallery/real-exam-poster.png",
    alt: "智慧试卷设计师参赛海报：AI 赋能智引未来主题插画",
    title: "智慧试卷设计师 · 参赛海报",
    caption: "全国人工智能应用创新大赛参赛海报——AI 赋能，智引未来",
    category: "course",
  },
  {
    src: "/images/gallery/real-chengyan-chat.png",
    alt: "澄颜智答 Web 原型问答界面：知识库文档树与带引用的候选回复",
    title: "澄颜智答 · 问答原型",
    caption: "Web 原型——知识库文档树 + 带引用标记的候选回复（本地真实运行）",
    category: "course",
  },
  {
    src: "/images/gallery/real-chengyan-escalation.png",
    alt: "高风险问题强制转人工的演示界面，含风险原因标记",
    title: "澄颜智答 · 风险门禁演示",
    caption: "高风险问题强制转人工——风险原因标记与置灰的候选回复",
    category: "course",
  },
  {
    src: "/images/gallery/real-chengyan-dataflow.png",
    alt: "澄颜智答系统数据流图：意图风险识别、知识检索、引用溯源、风险门禁",
    title: "澄颜智答 · 系统数据流",
    caption: "意图 / 风险识别 → 知识检索 → 引用溯源 → 风险门禁的完整链路设计",
    category: "course",
  },
  {
    src: "/images/gallery/real-sql-er.png",
    alt: "小鑫百货货品管理数据库 E-R 图与实体关系分析",
    title: "供应链数据库 · E-R 设计",
    caption: "「小鑫百货」货品管理数据库 E-R 模型——产品 / 仓库 / 分销商 / 订单 / 供应商五表设计（课程大作业原件）",
    category: "course",
  },
  {
    src: "/images/gallery/real-sql-aggregate.png",
    alt: "GROUP BY 聚集函数查询的 SQL 代码与结果截图",
    title: "供应链数据库 · 聚合统计",
    caption: "GROUP BY 聚集统计查询——SQL 代码与真实执行结果",
    category: "course",
  },
  {
    src: "/images/gallery/real-sql-join.png",
    alt: "多表组合查询的 SQL 代码与结果截图",
    title: "供应链数据库 · 多表查询",
    caption: "多表组合查询——跨产品 / 订单等表的字段关联与执行结果",
    category: "course",
  },
  // ---- 独立探索 ----
  {
    src: "/images/gallery/real-store-home.png",
    alt: "跨境电商体验店官网首页：导航、公告条与门店 Hero 区",
    title: "体验店官网首页",
    caption: "跨境电商体验店官网——导航 / 公告条 / 门店 Hero 与到店预约入口（与 AI 编程 Agent 协作交付，本地部署运行）",
    category: "explore",
    span2: true,
  },
  {
    src: "/images/gallery/real-store-products.png",
    alt: "官网商品展示区：9 款跨境商品卡片网格",
    title: "商品展示区",
    caption: "9 款跨境商品卡片——品牌 / 产地 / 价格为 README 占位替换表列明的上线前示意数据",
    category: "explore",
  },
  {
    src: "/images/gallery/real-store-admin.png",
    alt: "店员后台预约台账：统计卡片、搜索与预约记录表格",
    title: "店员后台 · 预约台账",
    caption: "预约台账后台——统计 / 搜索 / CSV 导出，写入前自动轮换备份最近 10 版（记录为模拟数据）",
    category: "explore",
  },
];

export const NAV_LINKS = [
  { label: "首页", href: "/" },
  { label: "关于", href: "/about" },
  { label: "作品", href: "/works" },
  { label: "项目实录", href: "/gallery" },
  { label: "联系", href: "/contact" },
];

export const MARQUEE_ITEMS = [
  "Prompt Engineering",
  "AI Agent",
  "RAG 系统",
  "多智能体编排",
  "大模型评测",
  "AI Coding",
  "产品落地",
  "数据分析",
  "需求洞察",
  "证据分级",
];
