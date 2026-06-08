# Luxiaofei Skills

这个仓库用于维护上游 skill 的自定义发布版。

流程：

1. 从上游仓库保存一份原版，放在 `upstream/<source>/...`
2. 把要发布的版本放在 `<source>/...`
3. 在发布版里做自定义修改
4. 通过本仓库的 GitHub tree 子目录 URL 安装

当前来源：

- 上游：`mattpocock/skills`
- 本仓库来源名：`matt`
- 上游原版：`upstream/matt/skills/...`
- 自定义发布版：`matt/<skill>/...`

## 目录

```text
upstream/matt/skills/... # mattpocock/skills 原版；用于对照和合并上游更新
matt/<skill>/...         # 自定义发布版；从这里安装
```

规则：

- 一个上游仓库对应两个目录：`upstream/<source>/...` 和 `<source>/...`。
- `upstream/matt/...` 不直接发布，只用于保存上游原版。
- `matt/...` 是发布版，可以改。
- 单个 skill 用 GitHub tree 子目录 URL 安装。
- 添加、更新、删除都使用 `npx skills@latest`。

## 添加 skill

安装 `matt` 子目录里的自定义 skill：

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

安装后的 skill 名：

```text
setup-matt-pocock-skills        -> matt-setup
grill-with-docs                 -> matt-grill
diagnose                        -> matt-diagnose
tdd                             -> matt-tdd
improve-codebase-architecture   -> matt-arch
zoom-out                        -> matt-zoom
```

如果本机已经安装过上游原名，先移除旧名字：

```bash
npx skills@latest remove setup-matt-pocock-skills grill-with-docs diagnose tdd improve-codebase-architecture zoom-out \
  --agent codex \
  --yes
```

再安装本仓库自定义版：

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

## 更新 skill

更新所有已安装 skill：

```bash
npx skills@latest update --yes
```

只更新某个 skill：

```bash
npx skills@latest update matt-arch --yes
```

只更新全局安装的 skill：

```bash
npx skills@latest update --global --yes
```

## 删除 skill

删除某个 skill：

```bash
npx skills@latest remove matt-arch \
  --agent codex \
  --yes
```

删除全局安装的某个 skill：

```bash
npx skills@latest remove --global matt-arch \
  --agent codex \
  --yes
```

交互式删除：

```bash
npx skills@latest remove
```

## 新增上游仓库子目录

如果要纳入另一个上游仓库，新增两份：

```text
upstream/<source-name>/skills/<category>/<skill-name>/SKILL.md
<source-name>/<short-skill-name>/SKILL.md
```

例子：

```text
upstream/another/skills/engineering/some-skill/SKILL.md
another/some-skill/SKILL.md
```

安装方式仍然是 GitHub tree 子目录：

```bash
npx skills@latest add https://github.com/wangxiao20241123-del/skills/tree/main/another \
  --agent codex \
  --yes
```

## 发布改动

```bash
git add upstream matt README.md NOTICE.md
git commit -m "organize skills by upstream source"
git push
```

安装后重启 Codex。
