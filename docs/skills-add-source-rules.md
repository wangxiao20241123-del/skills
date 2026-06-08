# `npx skills@latest add` source 识别规则

本文记录对 `npx skills@latest add <source>` 的实测结果。

所有实验都使用 `--list`，只列出可识别 skill，不执行安装。

## 结论

`npx skills@latest add <source>` 识别的是目录里的 `SKILL.md`。

`<source>` 可以是：

- 本地目录
- GitHub 仓库
- GitHub tree 子目录
- GitHub shorthand：`owner/repo`

`<source>` 不能直接指向 `SKILL.md` 文件。

## 推荐用法

安装本仓库自定义版 `matt`：

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

原因：

- `tree/main/matt` 会限制扫描范围到 `matt/`
- 只会识别自定义版 `matt-*`
- 不会扫到 `upstream/matt/...` 里的上游原版

## GitHub source 测试结果

### 1. GitHub tree 子目录

命令：

```bash
npx skills@latest add https://github.com/wangxiao20241123-del/skills/tree/main/matt \
  --list \
  --agent codex \
  --yes
```

结果：

```text
Source: https://github.com/wangxiao20241123-del/skills.git @ main (matt)
Found 6 skills
```

识别到：

```text
matt-arch
matt-diagnose
matt-grill
matt-setup
matt-tdd
matt-zoom
```

### 2. GitHub tree 单个 skill 子目录

命令：

```bash
npx skills@latest add https://github.com/wangxiao20241123-del/skills/tree/main/matt/arch \
  --list \
  --agent codex \
  --yes
```

结果：

```text
Source: https://github.com/wangxiao20241123-del/skills.git @ main (matt/arch)
Found 1 skill
```

识别到：

```text
matt-arch
```

### 3. GitHub 仓库根 URL

命令：

```bash
npx skills@latest add https://github.com/wangxiao20241123-del/skills \
  --list \
  --agent codex \
  --yes
```

结果：

```text
Source: https://github.com/wangxiao20241123-del/skills.git
Found 12 skills
```

识别到两组：

```text
matt-*                    # 自定义发布版
diagnose
grill-with-docs
improve-codebase-architecture
setup-matt-pocock-skills
tdd
zoom-out                  # upstream/matt 原版
```

原因：仓库根会递归扫描整个 repo，`matt/` 和 `upstream/matt/...` 都会被扫到。

### 4. GitHub shorthand

命令：

```bash
npx skills@latest add wangxiao20241123-del/skills \
  --list \
  --agent codex \
  --yes
```

结果：

```text
Source: https://github.com/wangxiao20241123-del/skills.git
Found 12 skills
```

结论：`owner/repo` 等价于 GitHub 仓库根。

### 5. GitHub tree 上游目录

命令：

```bash
npx skills@latest add https://github.com/wangxiao20241123-del/skills/tree/main/upstream/matt/skills/engineering \
  --list \
  --agent codex \
  --yes
```

结果：

```text
Source: https://github.com/wangxiao20241123-del/skills.git @ main (upstream/matt/skills/engineering)
Found 6 skills
```

识别到上游原名：

```text
diagnose
grill-with-docs
improve-codebase-architecture
setup-matt-pocock-skills
tdd
zoom-out
```

## 不推荐或无效写法

### 1. `https://github.com/<owner>/<repo>/<subdir>`

命令：

```bash
npx skills@latest add https://github.com/wangxiao20241123-del/skills/matt \
  --list \
  --agent codex \
  --yes
```

实际结果：

```text
Source: https://github.com/wangxiao20241123-del/skills.git
Found 12 skills
```

结论：`/matt` 被忽略，CLI 会按仓库根处理。

正确写法必须是：

```text
https://github.com/wangxiao20241123-del/skills/tree/main/matt
```

### 2. 直接指向本地 `SKILL.md`

命令：

```bash
npx skills@latest add ./matt/arch/SKILL.md \
  --list \
  --agent codex \
  --yes
```

结果：

```text
No skills found
```

结论：source 必须是目录，不是 `SKILL.md` 文件。

### 3. GitHub `blob` 文件 URL

命令：

```bash
npx skills@latest add https://github.com/wangxiao20241123-del/skills/blob/main/matt/arch/SKILL.md \
  --list \
  --agent codex \
  --yes
```

实际结果：被按仓库根处理，找到 12 个 skill。

结论：不要用 `blob` 文件 URL。

## 本地目录扫描规则

实验 fixture：

```text
/tmp/skills-add-fixture/plain-skill/SKILL.md
/tmp/skills-add-fixture/only-nested/a/SKILL.md
/tmp/skills-add-fixture/only-nested/b/SKILL.md
/tmp/skills-add-fixture/root-skill/SKILL.md
/tmp/skills-add-fixture/root-skill/nested/SKILL.md
```

### 1. 给单个 skill 目录

命令：

```bash
npx skills@latest add /tmp/skills-add-fixture/plain-skill \
  --list \
  --agent codex \
  --yes
```

结果：

```text
Found 1 skill
plain-skill
```

### 2. 给一个没有根 `SKILL.md` 的父目录

命令：

```bash
npx skills@latest add /tmp/skills-add-fixture/only-nested \
  --list \
  --agent codex \
  --yes
```

结果：

```text
Found 2 skills
nested-a
nested-b
```

结论：如果当前目录没有 `SKILL.md`，CLI 会向下递归找。

### 3. 当前目录有 `SKILL.md`

命令：

```bash
npx skills@latest add /tmp/skills-add-fixture/root-skill \
  --list \
  --agent codex \
  --yes
```

结果：

```text
Found 1 skill
root-skill
```

结论：如果当前目录自己有 `SKILL.md`，默认只识别当前目录这个 skill，不继续扫子目录。

### 4. `--full-depth`

命令：

```bash
npx skills@latest add /tmp/skills-add-fixture/root-skill \
  --list \
  --agent codex \
  --yes \
  --full-depth
```

结果：

```text
Found 2 skills
root-skill
nested-skill
```

结论：`--full-depth` 会在根目录已经有 `SKILL.md` 的情况下继续扫描子目录。

## 对本仓库的影响

本仓库同时保存：

```text
matt/                      # 自定义发布版
upstream/matt/skills/...   # 上游原版
```

因此：

- 安装自定义版：用 `tree/main/matt`
- 安装单个自定义 skill：用 `tree/main/matt/<skill>`
- 不要用仓库根安装，除非明确想同时看到自定义版和上游原版
- 不要用 `https://github.com/wangxiao20241123-del/skills/matt`

推荐入口：

```text
https://github.com/wangxiao20241123-del/skills/tree/main/matt
```
