# Teaching upgrade — execution contract

## Requirements and decisions

- FR-01: A device-local Developer mode opens all lessons without prerequisites. It persists, has a visible indicator and an off switch, and provides a searchable lesson index. Preview attempts do not award XP, mastery or completion.
- FR-02: Across the current curriculum, show a concise, skill-specific rule, formula with applicable conditions, visual explanation and small example. Teach progressively; keep full existing explanations reachable.
- FR-03: Exercise illustrations use given data only. Never treat answer choices, correct answers or targets as givens. Where an exact figure cannot be produced, clearly label a conceptual schematic.
- FR-04: Shared animations honor reduced motion; interruption starts at the current frame. Step controls work by keyboard and permit deliberate navigation.
- NFR-01: Preserve existing lesson IDs, saved learning progress and the digital-circuits additions. No new dependencies or external image service is required.
- NFR-02: Original Vietnamese teaching content; retain useful Chinese/English terms. Prefer short blocks and images over long paragraphs.

Pedagogical reference: [Flag illustrated data science](https://www.flag.com.tw/activity/F1325/) and [Flag learning map](https://www.flag.com.tw/activity/edm/1100703/) emphasize stepwise practice, illustrations and a learning map. Use these general teaching principles, with original wording and diagrams.

## Ownership and interfaces

| Owner | Exclusive implementation files | Interface / acceptance |
|---|---|---|
| teaching agent | `src/app/teaching/**`, `src/components/Lesson.tsx` | `LessonBrief({chapterId,lessonId})`, `RuleCard({skillId})`; briefs cover every current skill; concise progressive sections; valid formulas |
| visual agent | `src/app/learning-visuals/**` | `ExerciseIllustration({exercise,revealed?})`; prompt-only graphics or labeled conceptual diagrams; no solution leakage; focused tests |
| animation agent | `src/components/Canvas2D.tsx`, `src/components/Scene3D.tsx`, `src/components/StepByStep.tsx`, `src/components/motion/**`, `src/chapters/ch5-eigen/Lesson3Eigenspace.tsx`, `src/chapters/ch10-ml/GradientDescentLesson.tsx`, `src/chapters/ch13-optimization-apps/OptimizersLesson.tsx` | responsive/reduced-motion shared and chapter animations and keyboard step controls |
| host | all other new/modified files | Developer mode, shared integration, tests, documentation and final verification |

Agents must not edit outside their paths, add dependencies, commit, or spawn agents. Analysis precedes implementation. Shared integration follows the interfaces above.

## Validation

1. Inspect all changed files and confirm scope/ownership.
2. Focused tests: developer preference persistence and safe preview; curriculum coverage and KaTeX; illustration fidelity and no answer-derived data.
3. Run `npm test`, `npm run build`, `git diff --check`.
4. Independent read-only review of original requests, contract and diff; fix confirmed issues.
5. Browser verification if available; disclose if unavailable. Do not claim screenshots/UI checks that were not performed.

## Status

Implementation complete. Normal learning remains the default; Developer mode is opt-in.

- Coverage: 16 chapters, 81 lessons, 80 skill-specific teaching rules and 259 exercise records.
- Validation: all 254 tests across 17 files passed; TypeScript checking and the production/PWA build passed. The build retains large-chunk warnings for the main bundle and 3D scene.
- Independent review confirmed corrections to diagram proportions, plotted coordinates and module quiz routing; no concrete blockers remain.
- Local development server responded successfully at http://127.0.0.1:5173/.
- Browser visual verification was unavailable; no screenshot or direct browser layout verification is claimed.
