# Mandatory AI-SLOP Detection on UI Creation

This rule enforces strict anti-slop code quality standards across all frontend, styling, and user interface development tasks.

## Scope & Trigger

This rule applies **unconditionally** whenever:
1. Creating any new UI component, page, layout, form, modal, or hook (`.tsx`, `.jsx`, `.vue`, `.html`).
2. Refactoring, enhancing, or styling existing UI elements.
3. Adding interactive features, state management, or event handlers.
4. Assembling full screens or closing a frontend feature task.

## Mandatory Quality Gate

Before declaring any UI task or component creation complete, you **MUST** run the AI-SLOP Detector audit using the `ai-slop-detector` skill:

```bash
# Run the UI audit
./.agents/skills/ai-slop-detector/scripts/audit_ui.sh src/
```
or
```bash
slop-detector --project src/ --js -c .slopconfig.yaml
```

## Quality Acceptance Criteria

A UI deliverable is accepted only if:
1. **Overall Status is CLEAN**: Zero critical or suspicious deficit files.
2. **Zero Placeholder Stubs**:
   - No dummy empty functions or callbacks (`() => {}`, `pass`, `...`).
   - No mock buttons with dead / unhooked click listeners.
   - All interactive controls must drive real state, dispatch modals, or trigger realistic workflow actions.
3. **No Unfinished Code Markers**:
   - Zero `TODO`, `FIXME`, `HACK`, or `XXX` comments left in UI code.
4. **Production Cleanliness**:
   - Zero `console.log` or `console.error` left inside production UI components.
   - Zero unused imports or dead dependencies (`slop-detector sweep unused-deps`).
   - High Logic Density Ratio (LDR > 80%).

If any issue is detected, it must be resolved immediately before delivering results to the user.
