# Curriculum editorial upgrade — execution contract

## Objective and scope
Expand all 30 calculus lessons substantively and provide an illustrated, structured
textbook reading experience. Shared reading controls reveal all existing teaching
notes and full lessons across the app. Pending optional scope clarification defaults
to the recently added calculus curriculum for new subject-specific authorship.

Pedagogical reference: https://www.flag.com.tw/activity/F1325/ — use original
wording and diagrams, a learning map, explained steps and repeated practice.

## Requirements and acceptance
- FR-01: All 30 days receive original prerequisite reminders, explanatory intuition,
  a method, a worked derivation with a check, a transfer task and a conceptual check.
- FR-02: Reading layout distinguishes core rule, illustration, deeper explanation,
  example, original lesson and independent work; navigation works on mobile and desktop.
- FR-03: Shared notes offer full reading and focused steps; full existing /ch lessons
  open initially. Opening content never awards progress.
- FR-04: Preserve all 134 original answer disclosures, stable IDs, source import,
  completion storage and developer mode. Solutions stay optional with explicit
  show-all/hide-all controls, and print can include the complete lesson.
- FR-05: Add conceptual checks to practice; final assessment covers all source domains.
- NFR-01: All new formulas parse; actual diagrams have accurate numeric geometry,
  captions and accessible labels. No external image dependencies.
- NFR-02: No horizontal page overflow at 390px; keyboard controls and print readable.
- FR-06: Validate, deploy to existing cPanel and sync Git as authorized in this session.

## Interface and ownership
Host creates `editorial/types.ts` before content work. Editorial content imports
types only; no imports from registries. Each day is keyed d01..d30.

| Owner | Exclusive allowed files | Dependencies |
|---|---|---|
| content_analysis | `src/content/modules/calculus-30/editorial/days01-15.ts` | types.ts |
| code_analysis | `src/content/modules/calculus-30/editorial/days16-30.ts`, `editorial/finalAssessment.ts` | types.ts |
| design_analysis | `src/app/teaching/LessonBrief.tsx`, `src/app/teaching/teaching.css` | existing rules |
| host | all other edits, integration, diagrams, tests, docs and deployment | content interface |

Agents may not commit, deploy, spawn agents, change dependencies or edit others' files.
Host verifies all outputs and assigns a read-only final review after implementation.

## Validation
Coverage and math tests; source preservation; full-reading rendering; numeric answer
checks; `npm test`, `npm run build`, `git diff --check`; browser desktop/mobile/print
controls and production smoke checks; remote Git revision verification.

## Status
Implementation and independent reviews complete.

## Delivered content
- 30 original lesson extensions: prerequisites, intuition, method, worked proof,
  independent check, transfer problem and a four-option concept question.
- 30 captioned mathematical figures, including a keyboard-operable secant slider.
- All 134 imported solution disclosures retained; original HTML/JSON unchanged.
- Bank: 60 retained numeric checks + 30 concept checks + 12 final-assessment items.
  The day-30 assessment uses its fixed 12-item list, regardless of sample size.
- Shared teaching notes default to every skill and every stage, with an optional
  guided view. Existing deep-dive lessons start open. Reading does not award progress.

## Review evidence
- Cross-review of both authored halves and the final assessment found no mathematical
  errors. Independent numerical integration, finite differences and algebra checked
  the worked results; all new formulas parse with KaTeX.
- UI/core review found one vector-length mismatch in day 26; fixed the velocity
  arrow to the same 80px/unit scale as the unit circle.
- Desktop and 390px browser checks: no horizontal page overflow or math errors;
  internal navigation preserves HashRouter; secant h=0.02 gives slope 2.02;
  source solutions open/close; checkpoint feedback does not mark the lesson read.
- Classic multi-skill lesson: six teaching sections visible initially; guided mode
  selects one skill/stage; deep-dive open initially. Final player shows question 1/12.
- Print rules expose solutions and guided sections and remove fixed app navigation.
  Browser print-preview UI was not exposed by the automation surface; printed page
  pagination has not been visually verified.

Scope: new subject-specific explanations cover Calculus 30. Other curricula receive
the complete-reading layout and access to their existing full content.

## Deployment evidence and verification limit
The 158-file release was uploaded and extracted into the confirmed cPanel document
root. Server-side File Manager View confirms index.html references
`assets/index-D0k7MBvD.js`; extracted files have 0644 permissions. The release ZIP
was moved to the account home, alongside the previous release for rollback.
All 139 service-worker precache entries exist in the validated ZIP.

Public browser verification still sees the earlier cached PWA. Direct public HTTP
and HTTPS requests from this environment reset the connection. The browser security
policy blocks its internal service-worker administration page, so no internal
worker/cache management or storage deletion was attempted. Production content is
verified on the server filesystem, but receipt of the new build by public HTTPS
clients remains unverified. Local functional/browser checks pass as recorded above.
