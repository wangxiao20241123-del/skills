# 仓库 Harness 规则

## Skill 布局规则

- 禁止把 skill 直接发布到仓库根目录，例如 `find-skills/SKILL.md`。
- 每个导入的上游来源都必须使用这一组目录：
  - `upstream/<source-name>/...`：保存未修改的上游原版。
  - `<source-name>/<skill-name>/...`：保存发布版。
- 提交 skill 布局变更前必须运行：

```bash
scripts/validate-skill-layout.sh
```

- 如果导入 skill 时不做修改，必须用 `diff -ru` 验证发布版和上游原版完全一致。
