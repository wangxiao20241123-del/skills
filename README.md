# Skills

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

补充文档：

- [`npx skills@latest add` source 识别规则](docs/skills-add-source-rules.md)

## 常用命令

### 查看

```bash
npx skills@latest list --agent codex
npx skills@latest list --global --agent codex
npx skills@latest list --agent codex --json
```

### 安装

查看 source 里有哪些 skill，不安装：

```bash
npx skills@latest add <source> --list --agent codex --yes
```

安装 source 里全部 skill：

```bash
npx skills@latest add <source> --agent codex --skill '*' --yes
```

安装 source 里的指定 skill：

```bash
npx skills@latest add <source> --agent codex --skill <skill-name> --yes
```

安装多个指定 skill：

```bash
npx skills@latest add <source> --agent codex --skill <skill-a> --skill <skill-b> --yes
```

安装到全局：

```bash
npx skills@latest add <source> --global --agent codex --skill <skill-name> --yes
```

`<source>` 可以是本地目录、GitHub repo、GitHub tree 子目录。细节见 [`npx skills@latest add` source 识别规则](docs/skills-add-source-rules.md)。

### 更新

更新当前项目全部已安装 skill：

```bash
npx skills@latest update --yes
```

更新当前项目某个 skill：

```bash
npx skills@latest update <skill-name> --yes
```

更新当前项目多个 skill：

```bash
npx skills@latest update <skill-a> <skill-b> --yes
```

更新全局全部 skill：

```bash
npx skills@latest update --global --yes
```

更新全局某个 skill：

```bash
npx skills@latest update --global <skill-name> --yes
```

### 删除

删除当前项目某个 skill：

```bash
npx skills@latest remove <skill-name> --yes
```

删除当前项目多个 skill：

```bash
npx skills@latest remove <skill-a> <skill-b> --yes
```

删除当前项目全部 skill：

```bash
npx skills@latest remove --all
```

删除全局某个 skill：

```bash
npx skills@latest remove --global <skill-name> --yes
```

删除全局全部 skill：

```bash
npx skills@latest remove --global --all
```

交互式删除：

```bash
npx skills@latest remove
```

注意：`remove` 按 skill 名删除，不按 GitHub 仓库 URL 或 source 子目录删除。如果要删除某个 source 安装的一组 skill，先用 `list` 找到名字，再显式列出这些 skill 名。

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
