# Matt Skills 自定义说明

这个目录是基于 `mattpocock/skills` 的自定义发布版。

对照原版：

```text
upstream/matt/skills/... # 上游原版
matt/<skill>/...         # 自定义发布版
```

## 安装本目录

```bash
npx skills@latest add https://github.com/wangxiao20241123-del/skills/tree/main/matt \
  --agent codex \
  --skill matt-setup \
  --skill matt-grill \
  --skill matt-diagnose \
  --skill matt-tdd \
  --skill matt-arch \
  --skill matt-zoom \
  --yes
```

## 修改点

### 1. 统一加 `matt-` 前缀

目的：

- 和上游原版 skill 区分
- 安装后在 skill 列表里更容易搜索
- 避免同名冲突

映射：

```text
setup-matt-pocock-skills        -> matt-setup
grill-with-docs                 -> matt-grill
diagnose                        -> matt-diagnose
tdd                             -> matt-tdd
improve-codebase-architecture   -> matt-arch
zoom-out                        -> matt-zoom
```

### 2. 简化长名字

发布版目录和安装后的 skill 名都做了简化；上游原版路径仍保留原始目录，方便对照。

例如：

```text
matt/arch/SKILL.md
name: matt-arch
```

这样安装路径更短；合并上游更新时，用本文件的映射关系对照 `upstream/matt/...`。

### 3. 更新发布版内部引用

发布版里引用其他 skill 的地方同步改成新名字：

```text
/improve-codebase-architecture -> /matt-arch
/grill-with-docs               -> /matt-grill
```

已改位置：

```text
matt/diagnose/SKILL.md
matt/arch/SKILL.md
matt/setup/SKILL.md
matt/setup/domain.md
```

### 4. 安装入口收敛到 `matt`

不按单个深层 skill URL 安装，统一从 `matt` 子目录安装：

```text
https://github.com/wangxiao20241123-del/skills/tree/main/matt
```

原因：

- 一次能发现 6 个自定义 skill
- 命令更短
- 后续 `matt/` 下面新增 skill 时入口不变

### 5. 发布版目录扁平化

上游原始目录较长，例如：

```text
upstream/matt/skills/engineering/improve-codebase-architecture
```

发布版改成短目录：

```text
matt/arch
```

目录映射：

```text
upstream/matt/skills/engineering/setup-matt-pocock-skills        -> matt/setup
upstream/matt/skills/engineering/grill-with-docs                 -> matt/grill
upstream/matt/skills/engineering/diagnose                        -> matt/diagnose
upstream/matt/skills/engineering/tdd                             -> matt/tdd
upstream/matt/skills/engineering/improve-codebase-architecture   -> matt/arch
upstream/matt/skills/engineering/zoom-out                        -> matt/zoom
```

### 6. `matt-arch` 输出中文报告

`matt-arch` 基于上游 `improve-codebase-architecture`。主体规则保留英文原版，只增加一条约束：生成的 HTML 报告可见文本使用简体中文。

只改：

```text
matt/arch/SKILL.md
matt/arch/HTML-REPORT.md
```

不改：

```text
matt/arch/DEEPENING.md
matt/arch/INTERFACE-DESIGN.md
matt/arch/LANGUAGE.md
```

保留：

- Agent/sub-agent 流程
- 上游判断标准和架构词汇
- 文件路径、代码标识符、API 名称、配置键、ADR 编号和第三方产品名原文

## 未修改

- 没改 `upstream/matt/...`
- 没改 skill 的核心流程和提示词主体
- 没恢复 `npm run`、`package.json scripts`、`.vendor` 或同步脚本

## 更新上游时的处理方式

1. 更新 `upstream/matt/...`
2. 对比 `upstream/matt/...` 和 `matt/...`
3. 把需要的上游变化合并到 `matt/...`
4. 保留本文件记录的自定义点
5. 用 `npx skills@latest add https://github.com/wangxiao20241123-del/skills/tree/main/matt ...` 安装发布版
