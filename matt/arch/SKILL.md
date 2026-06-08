---
name: matt-arch
description: 用中文产出架构改进报告，基于 CONTEXT.md 的领域语言和 docs/adr/ 的既有决策，发现模块深化机会、重构机会、强耦合问题、可测试性问题和 AI 可导航性问题。
---

# Improve Codebase Architecture

Surface architectural friction and propose **deepening opportunities** — refactors that turn shallow modules into deep ones. The aim is testability and AI-navigability.

## Output language

All user-facing output from this skill must be in Simplified Chinese by default, including:

- the HTML report title, section headings, card labels, legend text, badges, problem/solution/benefit copy, recommendation text, and follow-up question;
- any progress or handoff text shown to the user;
- any CONTEXT.md or ADR content this skill creates or updates.

Keep code identifiers, file paths, config keys, API names, class/function names, log text, ADR IDs, and third-party product names in their original form.

Architecture vocabulary may use Chinese terms with the original English term in parentheses on first use, for example `模块（module）`, `接口（interface）`, `实现（implementation）`, `深度（depth）`, `接缝（seam）`, `适配器（adapter）`, `杠杆（leverage）`, `局部性（locality）`. After first use, Chinese terms are preferred.

## Glossary

Use these concepts exactly in every suggestion. Consistent language is the point — don't drift into "component," "service," "API," or "boundary." Full definitions are in [LANGUAGE.md](LANGUAGE.md).

In user-facing Chinese output, render the vocabulary like this:

- **模块（Module）** — anything with an interface and an implementation (function, class, package, slice).
- **接口（Interface）** — everything a caller must know to use the module: types, invariants, error modes, ordering, config. Not just the type signature.
- **实现（Implementation）** — the code inside.
- **深度（Depth）** — leverage at the interface: a lot of behaviour behind a small interface. **深（Deep）** = high leverage. **浅（Shallow）** = interface nearly as complex as the implementation.
- **接缝（Seam）** — where an interface lives; a place behaviour can be altered without editing in place. (Use this, not "boundary.")
- **适配器（Adapter）** — a concrete thing satisfying an interface at a seam.
- **杠杆（Leverage）** — what callers get from depth.
- **局部性（Locality）** — what maintainers get from depth: change, bugs, knowledge concentrated in one place.

Key principles (see [LANGUAGE.md](LANGUAGE.md) for the full list):

- **Deletion test**: imagine deleting the module. If complexity vanishes, it was a pass-through. If complexity reappears across N callers, it was earning its keep.
- **The interface is the test surface.**
- **One adapter = hypothetical seam. Two adapters = real seam.**

This skill is _informed_ by the project's domain model. The domain language gives names to good seams; ADRs record decisions the skill should not re-litigate.

## Process

### 1. Explore

Read the project's domain glossary and any ADRs in the area you're touching first.

Then use the Agent tool with `subagent_type=Explore` to walk the codebase. Don't follow rigid heuristics — explore organically and note where you experience friction:

- Where does understanding one concept require bouncing between many small modules?
- Where are modules **shallow** — interface nearly as complex as the implementation?
- Where have pure functions been extracted just for testability, but the real bugs hide in how they're called (no **locality**)?
- Where do tightly-coupled modules leak across their seams?
- Which parts of the codebase are untested, or hard to test through their current interface?

Apply the **deletion test** to anything you suspect is shallow: would deleting it concentrate complexity, or just move it? A "yes, concentrates" is the signal you want.

### 2. Present candidates as a Chinese HTML report

Write a self-contained HTML file to the OS temp directory so nothing lands in the repo. Resolve the temp dir from `$TMPDIR`, falling back to `/tmp` (or `%TEMP%` on Windows), and write to `<tmpdir>/architecture-review-<timestamp>.html` so each run gets a fresh file. Open it for the user — `xdg-open <path>` on Linux, `open <path>` on macOS, `start <path>` on Windows — and tell them the absolute path.

The report uses **Tailwind via CDN** for layout and styling, and **Mermaid via CDN** for diagrams where a graph/flow/sequence reliably communicates the structure. Mix Mermaid with hand-crafted CSS/SVG visuals — use Mermaid when relationships are graph-shaped (call graphs, dependencies, sequences), and hand-built divs/SVG when you want something more editorial (mass diagrams, cross-sections, collapse animations). Each candidate gets a **before/after visualisation**. Be visual.

The report itself must be Chinese. Use Chinese labels and prose:

- report title: `架构改进报告 — {{repo name}}`
- `候选项`, `文件`, `问题`, `方案`, `收益`, `调整前`, `调整后`, `推荐强度`, `首选建议`
- recommendation badges: `强烈建议`, `值得探索`, `偏推测`
- dependency tags can stay English when they are technical labels, e.g. `in-process`, `ports & adapters`

For each candidate, render this card structure with Chinese visible labels:

- **文件** — involved files/modules
- **问题** — why the current architecture is causing friction
- **方案** — concise Chinese description of what would change
- **收益** — explained in Chinese in terms of locality and leverage, and how tests would improve
- **调整前 / 调整后图** — side-by-side, custom-drawn, illustrating the shallowness and the deepening
- **推荐强度** — one of `强烈建议`, `值得探索`, `偏推测`, rendered as a badge

End the report with a **首选建议** section: which candidate you'd tackle first and why.

**Use CONTEXT.md vocabulary for the domain, and [LANGUAGE.md](LANGUAGE.md) vocabulary for the architecture.** If `CONTEXT.md` defines "Order," talk about "the Order intake module" — not "the FooBarHandler," and not "the Order service."

**ADR conflicts**: if a candidate contradicts an existing ADR, only surface it when the friction is real enough to warrant revisiting the ADR. Mark it clearly in the card (e.g. a warning callout: _"contradicts ADR-0007 — but worth reopening because…"_). Don't list every theoretical refactor an ADR forbids.

See [HTML-REPORT.md](HTML-REPORT.md) for the full HTML scaffold, diagram patterns, and styling guidance.

Do NOT propose interfaces yet. After the file is written, ask the user in Chinese: "你想先展开哪一个候选项？"

### 3. Grilling loop

Once the user picks a candidate, drop into a grilling conversation. Walk the design tree with them — constraints, dependencies, the shape of the deepened module, what sits behind the seam, what tests survive.

Side effects happen inline as decisions crystallize:

- **Naming a deepened module after a concept not in `CONTEXT.md`?** Add the term to `CONTEXT.md` — same discipline as `/matt-grill` (see [CONTEXT-FORMAT.md](../grill/CONTEXT-FORMAT.md)). Create the file lazily if it doesn't exist.
- **Sharpening a fuzzy term during the conversation?** Update `CONTEXT.md` right there.
- **User rejects the candidate with a load-bearing reason?** Offer an ADR, framed as: _"Want me to record this as an ADR so future architecture reviews don't re-suggest it?"_ Only offer when the reason would actually be needed by a future explorer to avoid re-suggesting the same thing — skip ephemeral reasons ("not worth it right now") and self-evident ones. See [ADR-FORMAT.md](../grill/ADR-FORMAT.md).
- **Want to explore alternative interfaces for the deepened module?** See [INTERFACE-DESIGN.md](INTERFACE-DESIGN.md).
