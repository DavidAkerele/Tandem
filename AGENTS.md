# Tandem Health AI — Agent Operating Guidelines

## Mandatory UI Code Quality & Anti-Slop Policy

Whenever modifying, scaffolding, or adding frontend UI components, pages, hooks, or styles in this repository:
1. **Always invoke the `ai-slop-detector` skill** (located in `.agents/skills/ai-slop-detector/`).
2. **Execute the anti-slop verification audit**:
   ```bash
   ./.agents/skills/ai-slop-detector/scripts/audit_ui.sh src/
   ```
3. **Enforce Zero-Slop Standard**:
   - No placeholder functions or empty arrow callbacks (`() => {}`).
   - No dead buttons or unlinked event handlers.
   - No `TODO` / `FIXME` comments left in UI code.
   - No `console.log` / `console.error` in production components.
   - All components must achieve a CLEAN deficit score (<30/100) and Logic Density Ratio >80%.
4. **Strict Ban on Generic AI Pill Badges & Capsule Slop**:
   - **Never use generic rounded-full capsule pills** (`rounded-full bg-{color}-50 text-{color}-800 border border-{color}-200`) with pulsating dots (`animate-pulse w-2 h-2 rounded-full`).
   - **Never use bubbly capsule pills** for status indicators, categories, tabs, buttons, or metadata badges.
   - **Always enforce modern, crisp clinical design standards**:
     - Subtle squircle geometry (`rounded-md` for chips/tags, `rounded-lg` for tabs/status seals, `rounded-xl` for containers/buttons).
     - Semantic vector icons (e.g. `ShieldCheck`, `CheckCircle2`) instead of pulsating circle dots.
     - Structured clinical typography with crisp borders and authentic contrast.
