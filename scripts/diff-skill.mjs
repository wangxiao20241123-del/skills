#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const manifest = JSON.parse(readFileSync(path.join(root, "skills-sources.json"), "utf8"));
const skillName = process.argv[2];

if (!skillName) {
  console.error("usage: npm run diff:skill -- <skill-name>");
  process.exit(2);
}

for (const source of manifest.sources) {
  const skill = source.skills.find((entry) => entry.name === skillName);
  if (!skill) continue;

  const upstreamPath = path.join(root, "upstream", source.id, skill.path);
  const customPath = path.join(root, skill.path);
  if (!existsSync(upstreamPath) || !existsSync(customPath)) {
    console.error(`missing paths. run: npm run sync:upstream -- --source ${source.id}`);
    process.exit(2);
  }

  const result = spawnSync("git", ["diff", "--no-index", "--", upstreamPath, customPath], {
    cwd: root,
    stdio: "inherit",
  });
  process.exit(result.status ?? 0);
}

console.error(`unknown skill: ${skillName}`);
process.exit(2);
