#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$repo_root"

fail=0

while IFS= read -r skill_file; do
  dir="${skill_file%/SKILL.md}"
  case "$dir" in
    ./upstream/*)
      continue
      ;;
  esac

  path="${dir#./}"
  IFS='/' read -r -a parts <<< "$path"
  if (( ${#parts[@]} < 2 )); then
    echo "发布版 skill 路径无效：${path}/SKILL.md" >&2
    echo "期望格式：<source-name>/<skill-name>/SKILL.md" >&2
    fail=1
  fi
done < <(find . -name SKILL.md -print | sort)

if (( fail != 0 )); then
  exit 1
fi

echo "skill 布局检查通过"
