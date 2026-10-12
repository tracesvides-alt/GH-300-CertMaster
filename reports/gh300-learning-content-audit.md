# GH-300 Learning Content Freshness & Accuracy Audit

Audit date: 2026-10-12 (Asia/Tokyo)

Current GH-300 blueprint: **Skills measured as of August 7, 2026**

Machine-readable full inventory and coverage: [gh300-learning-content-audit.json](./gh300-learning-content-audit.json)

## Method and status meanings

The current [Microsoft Learn Study Guide](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/gh-300) and [certification page](https://learn.microsoft.com/en-us/credentials/certifications/github-copilot) were checked before comparing the stored content. Current GitHub Docs and official changelogs were then used for product behavior. Every lesson, glossary term, comparison, and source is enumerated in the JSON inventory with objective, source, syllabus, status, and freshness metadata. All items were screened for syllabus mapping and references; a pre-existing `verified` status is **not** a claim that every sentence was newly fact-checked on this audit date. `lastCheckedAt` in the inventory is this audit's screening date, while the content's `lastVerifiedAt` is preserved unless its substance was verified. `needs-review` items are withheld from automatic promotion to verified.

`CURRENT` means no conflict was detected in this pass; `MINOR_UPDATE` and `MAJOR_UPDATE` denote edits made; `NEEDS_REVIEW` denotes unresolved facts or exam impact. A corrected major item can also remain `needs-review`. A 90-day age is only a recheck signal, not evidence of error.

## Blueprint diff

The current Study Guide still lists the August 7, 2026 skills date. The stored `syllabus.json` has the same six domains, 14 objectives, domain weights, and the listed feature topics. The guide's resource list remains the official starting point for learning material.

| Domain | Current weight | Objectives |
| --- | ---: | --- |
| Responsible AI | 15–20% | d1o1, d1o2 |
| Copilot Features | 25–30% | d2o1, d2o2, d2o3, d2o4 |
| How GitHub Copilot Works | 10–15% | d3o1, d3o2 |
| Prompt Crafting | 10–15% | d4o1, d4o2 |
| Developer Use Cases | 10–15% | d5o1, d5o2 |
| Privacy and Content Exclusion | 10–15% | d6o1, d6o2 |

Syllabus diff: **ADDED 0; REMOVED 0; RENAMED 0; WEIGHT_CHANGED 0; UNCHANGED 14 objectives**. The active version remains `2026-08-07`; no new version directory was needed. The source's detailed skills text, including Spark, is still the exam-scope reference even where current product availability differs.

## Coverage dashboard

| Metric | Result |
| --- | ---: |
| Domains with lessons | 6 / 6 |
| Objectives with lessons | 14 / 14 |
| Objectives with glossary | 14 / 14 |
| Objectives with comparison | 8 / 14 |
| Lessons / glossary / comparisons | 28 / 110 / 12 |
| Status `verified` | 20 / 97 / 10 |
| `needs-review` total | 23 |
| 90-day stale candidates | 0 |
| Broken content references | 0 |
| Active-version mismatches | 0 |

Comparison coverage is intentionally not required for every objective: d1, d3, and portions of d4/d5 are concept or workflow objectives. The most useful missing comparison is **current Copilot CLI vs IDE Agent mode** for d2o2, because old `gh copilot` descriptions still create exam ambiguity. The full objective-to-content mapping is in the JSON inventory.

## Lesson audit and exam focus

| Classification | Lesson IDs | Result |
| --- | --- | --- |
| MINOR_UPDATE | `lesson-d1-principles` | Removed the categorical “Copilot is not Autopilot” claim; autonomous modes exist, while human verification remains essential. |
| MAJOR_UPDATE + NEEDS_REVIEW | `lesson-d2-cli`, `lesson-d2-mcp`, `lesson-d3-data-flow`, `lesson-d6-troubleshooting-limits` | Corrected current CLI capabilities, retired Extensions framing, and contradictory CLI exclusion claims. Exam-answer impact remains for human review. |
| NEEDS_REVIEW | `lesson-d2-agent-edits`, `lesson-d3-prompt-pipeline`, `lesson-d3-lifecycle-limits`, `lesson-d6-ownership-privacy` | Mode distinctions, undocumented internal pipeline claims, overly narrow context scope, and legal/privacy claims require source-level review. |
| CURRENT screening | Remaining 19 lessons | Objective mapping and references are sound; historic `lastVerifiedAt` values were not advanced. |

The current [CLI tool-permission documentation](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/allowing-tools) says the CLI can search, read and edit files, execute commands, and use subagents. Its [autopilot documentation](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/autopilot) describes autonomous continuation and permission choices. Hence the old “prompt text only” CLI glossary and “every command waits for Execute command” description were wrong for the current CLI. The old `gh copilot explain/suggest` extension remains historical; current CLI instruction uses `copilot`.

The **exam focus** should be a choice among capabilities for a scenario, with verification and permission boundaries, rather than a promise that a shortcut, exact command spelling, or a particular answer “will certainly be asked.” Several older `examTips` still contain unsupported frequency language; they remain editorial review candidates rather than evidence-backed exam predictions.

## Glossary and comparison changes

The current [GitHub sunset notice](https://github.blog/changelog/2025-09-24-deprecate-github-copilot-extensions-github-apps/) says **GitHub App-based Copilot Extensions were fully disabled on November 10, 2025**. This does not retire ordinary GitHub Apps or VS Code client-side extensions. `g-copilot-extensions` now identifies the historical feature; `g-mcp`, `lesson-d2-mcp`, and `cmp-mcp-vs-extensions` no longer recommend it for new integrations. The comparison is retained solely to recognize older material; a current decision should use MCP and check the supported surface. Because a removed feature changes the comparison conclusion and may affect exam answers, those items remain `needs-review`.

The [GitHub Spark deprecation notice](https://github.blog/changelog/2026-08-04-upcoming-deprecation-of-github-spark-on-github-com/) says new users/apps were stopped in August 2026, while deployed apps continue. `g-spark` already describes this. Spark stays in the stored exam syllabus but is **not a current new-app workflow**.

The content-exclusion comparison and `g-exclusion-limitations` are marked `needs-review` because two current official pages disagree on the CLI:

- [Exclude content from GitHub Copilot](https://docs.github.com/en/copilot/how-tos/configure-content-exclusion/exclude-content-from-copilot) says Copilot CLI and IDE Agent mode do not support content exclusion.
- [Administer Copilot CLI for your enterprise](https://docs.github.com/en/copilot/how-tos/copilot-cli/administer-copilot-cli-for-your-enterprise) says organization/enterprise/repository exclusion policies apply to CLI and excluded files are not used as context.

The audit removed the unconditional CLI claim from the affected lesson and comparison. No answer that depends on one side of this contradiction should be `verified` until GitHub clarifies the scope. Other content-exclusion and public-code-matching concepts remain distinct, but neither is a guarantee of complete confidentiality or legal compliance.

## Current feature and lifecycle matrix

“Unspecified” means the cited current Docs do not state a single product-wide GA/Preview state; it must not be inferred from a page's existence. Availability varies by plan and surface. “Exam” indicates an explicit current Study Guide topic or its direct supporting concept.

| Feature | Current product state | Exam | Lifecycle | Main use / objective |
| --- | --- | --- | --- | --- |
| Inline suggestions | Available in supported IDEs | Yes | Unspecified | In-editor completions / d2o1 |
| Copilot Chat | Available | Yes | Unspecified | Explanations and questions / d2o1 |
| Agent mode | Available by supported IDE | Yes | Unspecified | Iterative tool and edit tasks / d2o3 |
| Copilot Edits / Edit mode | Surface-dependent | Yes | Unspecified | Controlled multi-file edits / d2o3 |
| Copilot CLI | Available; agentic `copilot` CLI | Yes | Unspecified | Terminal investigation and changes / d2o2 |
| MCP | Available by supported surface | Yes | Unspecified | External tools and data / d2o3 |
| Agent sessions | Available by surface | Yes | Unspecified | Ongoing agent work / d2o3 |
| Subagents | Available by surface | Yes | Unspecified | Delegated agent tasks / d2o3 |
| Spaces | Available; plan details in Docs | Yes | Unspecified | Shared context / d2o3 |
| Spark on github.com | New access/app creation stopped | Yes (still listed) | Retired for new use | Historic app building / d2o3 |
| Code review | Available on supported paid plans | Yes | Unspecified | PR review feedback / d2o3 |
| PR summaries | Available by surface/plan | Yes | Unspecified | Draft PR description / d2o3 |
| Custom instructions | Available | Yes | Unspecified | Persistent rules / d2o3 |
| Prompt files | Available by surface | Yes | Unspecified | Reusable task prompts / d2o3 |
| Content exclusion | Available with surface limits | Yes | Unspecified | Exclude configured content / d6o2 |
| Public code matching/filtering | Available as policy | Yes | Unspecified | Similarity checks / d6o1 |
| Organization policies | Available to admins | Yes | Unspecified | Governance / d2o4 |
| Audit logs | Available to admins | Yes | Unspecified | Governance review / d2o4 |
| REST API | Available | Yes | Unspecified | Subscription administration / d2o4 |
| GitHub App-based Extensions | Disabled since 2025-11-10 | No current feature | Removed | Historical contrast only / d2o3 |

Primary product references: [feature matrix](https://docs.github.com/en/copilot/reference/copilot-feature-matrix), [plans](https://docs.github.com/en/copilot/get-started/plans), [agent mode](https://docs.github.com/en/copilot/how-tos/copilot-in-your-ide/use-copilot-agents/use-agent-mode), [Spaces](https://docs.github.com/en/copilot/concepts/context/spaces), [code review](https://docs.github.com/en/copilot/concepts/agents/code-review), [CLI](https://docs.github.com/en/copilot/concepts/copilot-surfaces/copilot-cli), [PR summary guidance](https://docs.github.com/en/copilot/responsible-use/chat), and the sunset notices above. The feature matrix itself is published as a **public preview matrix**; that label does not make every listed feature Preview.

## Plans, new concepts, and missing material

The current [plan list](https://docs.github.com/en/copilot/get-started/plans) includes **Free, Student, Pro, Pro+, Max, Business, and Enterprise**. The existing lessons generally avoid exact prices and quotas; no price material was added. Code review and administrator controls require their own feature/plan checks rather than assuming that every plan has every feature. Plan availability should be taught only where the scenario requires it.

No new blueprint objective was found, so there is no mandatory new lesson. The strongest additions are a current-CLI-vs-IDE-Agent comparison and a glossary note on **CLI autopilot/tool permissions** within d2o2. The current content-exclusion lesson should be expanded after GitHub resolves the official contradiction. An expanded Spark workflow lesson would be misleading despite the exam guide's lingering mention.

## Fact-level verification and question impact

| Claim | Result | Evidence / action |
| --- | --- | --- |
| Current CLI can inspect repository files | VERIFIED | [CLI tool permissions](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/allowing-tools); corrected glossary. |
| Every CLI action requires per-command approval | CHANGED | Permissions can be granted for a session; [autopilot](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/autopilot) can continue work. |
| GitHub App-based Extensions can be newly installed | CHANGED | [Full sunset](https://github.blog/changelog/2025-09-24-deprecate-github-copilot-extensions-github-apps/); removed recommendations. |
| MCP server supplies tools/resources | VERIFIED | [MCP concept](https://docs.github.com/en/copilot/concepts/context/mcp). |
| CLI categorically ignores content exclusion | NEEDS_REVIEW | Official pages above conflict; removed categorical answer. |
| Spark is suitable for a new app | CHANGED | [Spark notice](https://github.blog/changelog/2026-08-04-upcoming-deprecation-of-github-spark-on-github-com/); retain only historic exam concept. |
| Fixed internal prompt pipeline order | UNSUPPORTED | Existing architecture source is already `needs-review`; the lesson remains `needs-review`. |

`q11` was changed to `needs-review`: although its broad selected option is still plausible, the explanation explicitly says CLI exclusion is unsupported. `q-d2-f11` was already `needs-review` because it presents the old `gh copilot` extension as the current CLI. The JSON report lists all question-bank `needs-review` IDs; these are review candidates, not an instruction to rewrite the whole bank. Related questions attached to changed lessons/comparisons should be checked before they are promoted.

## Human review and source limits

The 23 content items with `needs-review` are listed individually in the JSON report. Prioritize (1) CLI content exclusion resolution with GitHub, (2) old Extensions and mode-choice exam answers, (3) exact internal prompt pipeline and context scope, and (4) privacy/ownership claims. The current audit verified the cited feature claims above; it did **not** establish independent fact-level support for every sentence in the 150 stored content records or every historical `verified` source. Those records retain their previous `lastVerifiedAt` dates. This is the main limit of the `CURRENT` screening classification.

The official source records include URLs, titles, publishers, topics through linked objectives, and reverse content references. A URL being live is insufficient to substantiate every linked claim. The new sunset, CLI permission, and contradictory CLI administration sources were added to the relevant content. Source relevance for remaining records should be reviewed claim by claim before advancing their verification dates. The local `sources:check` run could not reach any GitHub host from the restricted shell network (33/33 `fetch failed`); the specific official pages cited above were independently read through the web research tool, but a complete automated URL/canonical/title recheck remains open.

## Maintenance and final consistency

Run `node scripts/audit-learning-content.mjs YYYY-MM-DD` to regenerate the full inventory, dashboard, needs-review list, broken references, and 90-day stale candidates. The script fails when verified content lacks an official source, references are broken, or an active content version differs from the active syllabus. This audit's order of evidence was: current Microsoft Learn blueprint → current GitHub Docs/changelogs → stored knowledge base → lessons/glossary/comparisons → affected questions. The final automated checks and any remaining failures are reported in the accompanying development result.
