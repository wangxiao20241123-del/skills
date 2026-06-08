# Luxiaofei Skills

这个仓库是 skill vendor/fork 仓库。

- `upstream/`：上游原版快照，只由同步脚本刷新。
- `skills/`：发布给 `npx skills add` 的自定义版，可以手工修改。
- `.vendor/`：同步元数据。
- `.cache/`：临时 clone，不进 git。

## 目录和职责

```text
skills-sources.json      # 上游来源和要 vend 的 skill 清单
upstream/<source>/...    # 上游原版快照；不要手改
skills/...               # 对外发布的 skill；修改这里
.vendor/skills/*.json    # 每个 skill 的同步元数据
scripts/                 # 同步、diff 辅助脚本
```

核心规则：

- 更新上游只刷新 `upstream/`。
- 自定义修改只写 `skills/`。
- `npx skills add` 安装的是 `skills/` 里的内容。
- 除非明确要丢弃自定义修改，不要用 `--force-custom`。

## 同步上游原版

```bash
npm run sync:upstream
```

默认行为：

- 刷新 `upstream/<source>/...`
- 如果 `skills/...` 不存在，创建自定义版
- 如果 `skills/...` 已存在，保留你的修改，不覆盖

强制用上游覆盖自定义版：

```bash
npm run sync:upstream -- --force-custom
```

只同步某个来源：

```bash
npm run sync:upstream -- --source mattpocock
```

## 对比原版和自定义版

```bash
npm run diff:skill -- improve-codebase-architecture
```

## 本地验证 npx 可安装

```bash
npx skills@latest add /Users/xiaowang/AISales/test/skills \
  --list \
  --agent codex \
  --yes
```

## 本地安装到 Codex

```bash
npx skills@latest add /Users/xiaowang/AISales/test/skills \
  --agent codex \
  --skill setup-matt-pocock-skills \
  --skill grill-with-docs \
  --skill diagnose \
  --skill tdd \
  --skill improve-codebase-architecture \
  --skill zoom-out \
  --yes
```

## 新加一个上游仓库

适用场景：想把另一个作者的 skill 仓库也纳入这里统一管理。

1. 先确认对方仓库里有哪些 skill：

```bash
npx skills@latest add <owner>/<repo> --list --agent codex --yes
```

2. 编辑 `skills-sources.json`，在 `sources` 里新增一个来源：

```json
{
  "id": "example",
  "package": "owner/repo",
  "repo": "https://github.com/owner/repo.git",
  "ref": "main",
  "skills": [
    {
      "name": "some-skill",
      "path": "skills/category/some-skill"
    }
  ]
}
```

字段说明：

- `id`：本仓库内的来源名，必须稳定。会用于 `upstream/<id>/...` 和 `.vendor/skills/<id>-<skill>.json`。
- `package`：给人看的安装来源名，通常是 `<owner>/<repo>`。
- `repo`：git clone URL。
- `ref`：上游分支或 tag。
- `skills[].name`：skill 的安装名，必须和 `SKILL.md` frontmatter 里的 `name` 一致。
- `skills[].path`：该 skill 在上游仓库内的目录，目录下必须有 `SKILL.md`。

3. 同步新增来源：

```bash
npm run sync:upstream -- --source example
```

4. 验证这个仓库能被 `npx skills` 识别：

```bash
npx skills@latest add /Users/xiaowang/AISales/test/skills \
  --list \
  --agent codex \
  --yes
```

## 更新一个上游仓库

适用场景：上游 repo 更新了，想把原版快照拉到本仓库。

更新所有来源：

```bash
npm run sync:upstream
```

只更新一个来源：

```bash
npm run sync:upstream -- --source mattpocock
```

更新后的结果：

- `upstream/<source>/...` 会变成最新上游。
- `skills/...` 会保留你的自定义修改。
- `.vendor/skills/*.json` 会更新同步时间和来源信息。

查看某个 skill 和上游原版的差异：

```bash
npm run diff:skill -- improve-codebase-architecture
```

如果你确认要放弃自定义修改，让自定义版回到最新上游：

```bash
npm run sync:upstream -- --source mattpocock --force-custom
```

风险：`--force-custom` 会覆盖 `skills/...` 里的修改。

## 删除一个上游仓库

适用场景：不再维护某个来源的 skill。

1. 从 `skills-sources.json` 删除对应 `sources[]` 条目。

2. 删除该来源的上游快照：

```bash
rm -rf upstream/<source-id>
```

3. 删除该来源的同步元数据：

```bash
rm -f .vendor/skills/<source-id>-*.json
```

4. 决定是否删除对外发布的自定义 skill。

如果这些 skill 也不再发布，删除 `skills/...` 下对应目录：

```bash
rm -rf skills/<category>/<skill-name>
```

如果你只是想停止从该上游更新，但仍继续发布自己的 fork，保留 `skills/...`，只删除 `skills-sources.json`、`upstream/`、`.vendor/` 里的来源记录。

5. 验证可安装列表：

```bash
npx skills@latest add /Users/xiaowang/AISales/test/skills \
  --list \
  --agent codex \
  --yes
```

## 修改后发布

适用场景：要中文化、改 prompt、改模板、改脚本，然后让别人从你的仓库安装。

1. 修改 `skills/...` 里的发布版。

例子：

```text
skills/engineering/improve-codebase-architecture/SKILL.md
skills/engineering/improve-codebase-architecture/HTML-REPORT.md
```

2. 对比上游差异：

```bash
npm run diff:skill -- improve-codebase-architecture
```

3. 本地验证可被 `npx skills` 找到：

```bash
npx skills@latest add /Users/xiaowang/AISales/test/skills \
  --list \
  --agent codex \
  --yes
```

4. 本地安装到 Codex 验证：

```bash
npx skills@latest add /Users/xiaowang/AISales/test/skills \
  --agent codex \
  --skill setup-matt-pocock-skills \
  --skill grill-with-docs \
  --skill diagnose \
  --skill tdd \
  --skill improve-codebase-architecture \
  --skill zoom-out \
  --yes
```

如果已经安装过同名 skill，先查看安装位置：

```bash
npx skills@latest list -g --agent codex
npx skills@latest list --agent codex
```

必要时先移除旧版：

```bash
npx skills@latest remove --global --agent codex --skill improve-codebase-architecture --yes
```

5. 提交并推送到你的 GitHub 仓库：

```bash
git add skills upstream .vendor skills-sources.json package.json README.md scripts .gitignore
git commit -m "vendor and customize skills"
git push
```

6. 从 GitHub 安装：

```bash
npx skills@latest add <your-github-name>/skills \
  --agent codex \
  --skill setup-matt-pocock-skills \
  --skill grill-with-docs \
  --skill diagnose \
  --skill tdd \
  --skill improve-codebase-architecture \
  --skill zoom-out \
  --yes
```

安装后重启 Codex。

## 不修改直接发布

适用场景：只是想把多个上游 skill 合并到你的仓库，原样转发发布。

1. 配好 `skills-sources.json`。

2. 同步上游，并初始化 `skills/...`：

```bash
npm run sync:upstream
```

3. 确认没有自定义 diff：

```bash
npm run diff:skill -- improve-codebase-architecture
```

4. 验证可安装：

```bash
npx skills@latest add /Users/xiaowang/AISales/test/skills \
  --list \
  --agent codex \
  --yes
```

5. 提交并推送：

```bash
git add skills upstream .vendor skills-sources.json package.json README.md scripts .gitignore
git commit -m "vendor skills"
git push
```

6. 用你的仓库安装：

```bash
npx skills@latest add <your-github-name>/skills \
  --agent codex \
  --skill improve-codebase-architecture \
  --yes
```

## 发布后的取消

这里分两种：取消“本地安装”和取消“远端发布”。

### 取消本地安装

查看当前安装：

```bash
npx skills@latest list -g --agent codex
npx skills@latest list --agent codex
```

移除某个全局 skill：

```bash
npx skills@latest remove --global --agent codex --skill improve-codebase-architecture --yes
```

移除某个项目 skill：

```bash
npx skills@latest remove --agent codex --skill improve-codebase-architecture --yes
```

移除后重启 Codex。

### 取消远端发布

如果只是撤回某次改动：

```bash
git revert <commit>
git push
```

如果要从发布仓库里移除某个 skill：

```bash
rm -rf skills/<category>/<skill-name>
git add -A
git commit -m "remove <skill-name> skill"
git push
```

如果也不再跟踪它的上游来源，同步执行“删除一个上游仓库”里的步骤。

已经安装过的人不会自动消失。他们需要执行 remove 或 update：

```bash
npx skills@latest remove --global --agent codex --skill <skill-name> --yes
```

或重新安装/更新到你的新版本：

```bash
npx skills@latest update -g --yes
```

## 从这个仓库安装

本地：

```bash
npx skills@latest add /Users/xiaowang/AISales/test/skills \
  --agent codex \
  --skill setup-matt-pocock-skills \
  --skill grill-with-docs \
  --skill diagnose \
  --skill tdd \
  --skill improve-codebase-architecture \
  --skill zoom-out \
  --yes
```

推到 GitHub 后：

```bash
npx skills@latest add <your-github-name>/skills \
  --agent codex \
  --skill setup-matt-pocock-skills \
  --skill grill-with-docs \
  --skill diagnose \
  --skill tdd \
  --skill improve-codebase-architecture \
  --skill zoom-out \
  --yes
```
