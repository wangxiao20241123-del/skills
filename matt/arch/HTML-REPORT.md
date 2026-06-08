# HTML 报告格式

架构评审必须渲染成一个自包含 HTML 文件，写到系统临时目录。Tailwind 和 Mermaid 都从 CDN 引入。Mermaid 适合关系图、调用图、依赖图、时序图；手写 div 和 inline SVG 适合更强表达性的视觉，例如质量图、剖面图、折叠前后对比。两者混用，不要所有图都依赖 Mermaid。

报告中的所有可见文本默认使用简体中文。代码标识符、文件路径、类名、函数名、配置键、ADR 编号和第三方产品名保留原文。

## Scaffold

```html
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8" />
    <title>架构改进报告 — {{repo name}}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script type="module">
      import mermaid from "https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs";
      mermaid.initialize({ startOnLoad: true, theme: "neutral", securityLevel: "loose" });
    </script>
    <style>
      /* Tailwind 不方便表达的少量样式：
         虚线接缝、箭头、泄漏边、深模块块面等。 */
      .seam { stroke-dasharray: 4 4; }
      .leak { stroke: #dc2626; }
      .deep { background: linear-gradient(135deg, #0f172a, #1e293b); }
    </style>
  </head>
  <body class="bg-stone-50 text-slate-900 font-sans">
    <main class="max-w-5xl mx-auto px-6 py-12 space-y-12">
      <header>...</header>
      <section id="candidates" class="space-y-10">...</section>
      <section id="top-recommendation">...</section>
    </main>
  </body>
</html>
```

## 页头

页头包含 repo 名称、日期、简短图例。不要写大段介绍，直接进入候选项。

图例使用中文：

```text
实线框 = 模块
虚线 = 接缝
红色箭头 = 泄漏
深色粗框 = 深模块
```

## 候选项卡片

图承担主要解释责任。文字要短、直白，并使用 [LANGUAGE.md](LANGUAGE.md) 中的架构词汇。首次出现时可写成 `模块（module）`，后续用中文。

Each candidate is one `<article>`:

- **标题** — 短，点明深化方向，例如 `收拢 Order intake pipeline`。
- **徽章行** — 推荐强度：`强烈建议` = emerald，`值得探索` = amber，`偏推测` = slate；依赖类型标签可保留英文，例如 `in-process`、`local-substitutable`、`ports & adapters`、`mock`。
- **文件** — monospaced list，`font-mono text-sm`。
- **调整前 / 调整后图** — 核心内容。左右两列并排。见下方图形模式。
- **问题** — 一句话说明现在痛在哪里。
- **方案** — 一句话说明要怎么改。
- **收益** — 短 bullet，每条不超过 12 个汉字。例如 `测试打到一个接口`、`Pricing 不再泄漏`、`删除 4 个浅包装`。
- **ADR 提醒**（如适用）— amber 背景的一行提示。

不要写长段解释。如果一张图需要靠长段文字才能看懂，重画图。

## 图形模式

按候选项选择合适模式。混用这些模式，不要每张图都长一样。

### Mermaid graph

当重点是依赖关系、调用链、流程关系时，用 Mermaid `flowchart` 或 `graph`。外层用 Tailwind 卡片包住。用 `classDef` 把泄漏边标红，把深模块标暗。时序图适合表达 `调整前：6 次往返；调整后：1 次`。

```html
<div class="rounded-lg border border-slate-200 bg-white p-4">
  <pre class="mermaid">
    flowchart LR
      A[OrderHandler] --> B[OrderValidator]
      B --> C[OrderRepo]
      C -.leak.-> D[PricingClient]
      classDef leak stroke:#dc2626,stroke-width:2px;
      class C,D leak
  </pre>
</div>
```

### 手写 boxes-and-arrows

用带边框和标签的 `<div>` 表示模块。箭头用 inline SVG 的 `<line>` 或 `<path>`，放在 relative 容器里绝对定位。当 `调整后` 需要呈现一个粗边框深模块、内部细节淡化时，优先手写，不要硬用 Mermaid。

### 剖面图

用横向层叠条带（`h-12 border-l-4`）表现一次调用穿过多层。调整前：6 个薄层各做一点点。调整后：1 个厚层承载合并后的职责。

### 质量图

每个模块两个矩形：一个表示接口表面积，一个表示实现体量。调整前：接口矩形几乎和实现一样高，说明浅。调整后：接口短、实现高，说明深。

### 调用图折叠

调整前：用嵌套框画函数调用树。调整后：同一棵树折叠进一个模块框，内部调用淡化显示。

## 样式

- 风格偏编辑型，不要做成企业 dashboard。
- 留白充足。标题可用 `font-serif`。
- 颜色克制：一个主强调色（emerald 或 indigo），红色表示泄漏，amber 表示警告。
- 图高度约 320px，保证调整前/调整后能并排阅读。
- 图中的模块标签用 `text-xs uppercase tracking-wider` 或等价紧凑样式。
- 只允许 Tailwind CDN 和 Mermaid ESM import。报告保持静态，不加应用逻辑。

## 首选建议

最后放一个较大的 `首选建议` 区块：候选项名称、一句话理由、跳转到该卡片的 anchor。不要展开成长文。

## 语气

中文、短句、直接。架构名词必须来自 [LANGUAGE.md](LANGUAGE.md)，但输出给用户时用中文表达，首次可附英文原词。

**使用这些概念：** 模块（module）、接口（interface）、实现（implementation）、深度（depth）、深（deep）、浅（shallow）、接缝（seam）、适配器（adapter）、杠杆（leverage）、局部性（locality）。

**不要随意替换：** 不要用 component/service/unit 代替 module；不要用 API/signature 代替 interface；不要用 boundary 代替 seam；表达模块时不要随手写 layer/wrapper。

**推荐表达：**

- `Order intake 模块很浅：接口几乎等于实现。`
- `Pricing 从接缝泄漏出去。`
- `深化：一个接口，一个测试入口。`
- `两个适配器让接缝成立：生产 HTTP，测试 in-memory。`

**收益 bullet** 必须说清概念收益，例如 `局部性：bug 收敛到一个模块`、`杠杆：一个接口覆盖 N 个调用点`、`接口变小，实现吸收包装层`。不要写空泛的 `更容易维护`、`代码更干净`。

不要铺垫，不要弱化语气。能写成 bullet 就写 bullet。能删就删。发明新术语前，先从 [LANGUAGE.md](LANGUAGE.md) 找已有概念。
