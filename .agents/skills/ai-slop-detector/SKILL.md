---
name: ai-slop-detector
description: Automated anti-slop code quality scanner, detector, and sovereign gate based on AI-SLOP-Detector (https://github.com/flamehaven01/AI-SLOP-Detector). Detects empty stubs, placeholder code, phantom imports, unlinked handlers, bloated boilerplate, callback hell, console logs, and non-functional mock UI implementations. Mandatory audit step for every UI creation, component generation, and frontend refactor.
argument-hint: "[target_dir_or_file]"
license: MIT
metadata:
  author: Antigravity & flamehaven01
  version: "1.0.0"
---

# AI-SLOP Detector Skill

Turn AI-generated code from shallow mockups and hollow stubs into production-grade, resilient, sovereign software.

Based on the [AI-SLOP-Detector engine](https://github.com/flamehaven01/AI-SLOP-Detector), this skill enforces automated code quality gating, structural topology checks, and placeholder elimination across all frontend and UI engineering workflows.

---

## 🎯 Mandatory Trigger: UI Creation & Refactoring Gate

**Rule of Thumb:**
> **Every UI creation process (creating components, assembling pages, writing hooks, or updating styles) MUST conclude with an AI-SLOP Detector verification pass.**
> No UI feature is complete until verified by `ai-slop-detector` with zero critical deficits and zero placeholder stubs.

### When to Run
- Immediately after creating or scaffolding any new UI component (`.tsx`, `.jsx`, `.vue`, `.html`).
- After building complex layouts, modal systems, or interactive dashboards.
- Before committing or presenting any frontend deliverable to the user.
- Whenever auditing existing codebases for technical debt or AI hallucinations.

---

## 🔍 What AI-SLOP Detector Catches

The detector evaluates code across multiple structural dimensions:

### 1. Placeholder Stubs & Hollow Implementations
- **`pass_placeholder` / `ellipsis_placeholder`**: Functions containing only `pass`, `...`, or empty arrow bodies `() => {}`.
- **`not_implemented`**: Functions throwing `NotImplementedError` or returning unhandled reject promises.
- **`return_constant_stub`**: Functions returning hardcoded stubs (`return null`, `return true`, `return []`) instead of implementing actual business logic.
- **Unlinked UI Handlers**: Buttons or interactive controls with `onClick={() => {}}` or dead handlers.

### 2. Comment Bloat & Synthetic Documentation
- **`todo_comment` / `fixme_comment` / `hack_comment`**: Unresolved `TODO: implement later` tags left behind during code generation.
- **Docstring / Logic Mismatch**: Lengthy docstrings claiming features that are absent from the AST implementation.
- **Jargon Inflation (ICR)**: Overuse of buzzwords ("enterprise", "fault-tolerant", "scalable") without accompanying tests or infrastructure.

### 3. Frontend & Production Cleanliness
- **`js_console_log`**: Debugging statements (`console.log`, `console.error`) left inside production components.
- **`js_callback_hell`**: Deep nesting levels (>5 levels) indicating poorly factored component trees.
- **`var` usage / Loose equality**: Anti-patterns such as `var` instead of `const/let` or `==` instead of `===`.
- **Phantom Imports (DDC)**: Imports declared in headers but never referenced in component rendering or state logic.

---

## ⚡ Core CLI Commands

The engine provides four canonical entrypoints:

```bash
# 1. Canonical Project Scan (Full project audit with JS/TS AST parsing)
slop-detector --project src/ --js -c .slopconfig.yaml

# 2. Changed-Code Review (Fast diff analysis against git staging/HEAD)
slop-detector review src/ --js

# 3. Repository Pulse (Health check and trends)
slop-detector pulse .

# 4. Dead-Code & Unused Dependency Sweep
slop-detector sweep unused-deps .

# 5. One-Shot UI Audit Script
./.agents/skills/ai-slop-detector/scripts/audit_ui.sh [target_dir]
```

---

## 🛠️ Installation & Setup

Ensure the engine and parser dependencies are installed in your Python environment:

```bash
# Install core engine
pip install ai-slop-detector

# Install AST support for JavaScript & TypeScript
pip install tree-sitter tree-sitter-javascript tree-sitter-typescript
```

Binary location on macOS:
```bash
$HOME/Library/Python/3.9/bin/slop-detector
```

---

## ⚙️ Configuration (`.slopconfig.yaml`)

Use `.slopconfig.yaml` to tailor rules and thresholds for modern React / Vue / Vite applications:

```yaml
version: "2.0"

weights:
  ldr: 0.15        # Logic Density Ratio
  inflation: 0.13  # Inflation-to-Code Ratio
  ddc: 0.62        # Dependency Usage Ratio
  purity: 0.10     # Critical-pattern penalty

ignore:
  - "node_modules/**"
  - "dist/**"
  - "build/**"
  - ".next/**"
  - "coverage/**"

patterns:
  enabled: true
  severity_threshold: low

  god_function:
    complexity_threshold: 25
    lines_threshold: 350

  nested_complexity:
    depth_threshold: 6
    cc_threshold: 15
```

---

## 📋 Remediation Checklist

When the detector flags issues, resolve them using these best practices:

| Finding | Detection Rule | Remediation Action |
|---|---|---|
| `js_console_log` | `console.log(...)` or `console.error(...)` | Replace with UI error feedback, toast notifications, or graceful silent fallbacks. |
| `empty_arrow_count` | `onClick={() => {}}` | Wire real state mutation or interactive workflow handlers. |
| `js_callback_hell` | Nesting depth > 5 | Refactor nested ternary JSX or inline callbacks into dedicated subcomponents or custom hooks. |
| `unused_deps` | Unreferenced imports | Delete dead import declarations from component headers. |
| `todo_comment` | `// TODO: ...` | Either fully implement the feature or document in formal PRD/issue tracking. |
