#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, rmSync, cpSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const manifestPath = path.join(root, "skills-sources.json");
const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
const args = new Set(process.argv.slice(2));
const forceCustom = args.has("--force-custom");
const sourceFilter = valueAfter("--source");

function valueAfter(flag) {
  const index = process.argv.indexOf(flag);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

function run(command, commandArgs, options = {}) {
  const result = spawnSync(command, commandArgs, {
    cwd: options.cwd ?? root,
    stdio: "inherit",
    env: process.env,
  });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

function copyDir(from, to) {
  rmSync(to, { recursive: true, force: true });
  mkdirSync(path.dirname(to), { recursive: true });
  cpSync(from, to, { recursive: true });
}

function ensureClone(source) {
  const cacheDir = path.join(root, ".cache", "upstreams", source.id);
  rmSync(cacheDir, { recursive: true, force: true });
  mkdirSync(path.dirname(cacheDir), { recursive: true });
  run("git", ["clone", "--depth", "1", "--branch", source.ref ?? "main", source.repo, cacheDir]);
  return cacheDir;
}

function writeMetadata(source, skill, upstreamPath, customPath) {
  const metadataPath = path.join(root, ".vendor", "skills", `${source.id}-${skill.name}.json`);
  mkdirSync(path.dirname(metadataPath), { recursive: true });
  writeFileSync(
    metadataPath,
    JSON.stringify(
      {
        source: source.id,
        package: source.package,
        repo: source.repo,
        ref: source.ref ?? "main",
        skill: skill.name,
        upstreamPath: path.relative(root, upstreamPath),
        customPath: path.relative(root, customPath),
        syncedAt: new Date().toISOString(),
      },
      null,
      2,
    ) + "\n",
  );
}

for (const source of manifest.sources) {
  if (sourceFilter && source.id !== sourceFilter) continue;
  console.log(`sync source: ${source.id} (${source.repo}#${source.ref ?? "main"})`);
  const cloneDir = ensureClone(source);

  for (const skill of source.skills) {
    const cloneSkillPath = path.join(cloneDir, skill.path);
    if (!existsSync(path.join(cloneSkillPath, "SKILL.md"))) {
      throw new Error(`missing SKILL.md for ${source.id}/${skill.name}: ${skill.path}`);
    }

    const upstreamPath = path.join(root, "upstream", source.id, skill.path);
    const customPath = path.join(root, skill.path);

    copyDir(cloneSkillPath, upstreamPath);

    if (!existsSync(customPath) || forceCustom) {
      copyDir(cloneSkillPath, customPath);
      console.log(`  custom ${forceCustom ? "overwritten" : "created"}: ${path.relative(root, customPath)}`);
    } else {
      console.log(`  custom preserved: ${path.relative(root, customPath)}`);
    }

    writeMetadata(source, skill, upstreamPath, customPath);
  }
}

console.log("done");
