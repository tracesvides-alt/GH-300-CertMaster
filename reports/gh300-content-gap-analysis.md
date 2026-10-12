# GH-300 Content Gap Analysis

Audit date: 2026-10-12. Blueprint: [Microsoft Learn GH-300 Study Guide, skills measured August 7, 2026](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/gh-300).

## Current inventory before expansion

| Domains | Objectives | Lessons | Glossary terms | Comparisons | Official sources | Verified questions |
| ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 6 | 14 | 28 | 110 | 12 | 40 | 196 |

The full record inventory, including IDs, links, status, and verification dates, is in [gh300-content-gap-inventory.json](./gh300-content-gap-inventory.json). The objective map below uses the current Study Guide rather than inferring requirements from the existing lesson titles.

## Before expansion

| Coverage | Objectives | Reason |
| --- | --- | --- |
| COMPLETE | 11 | Lessons, essential terms, and verified questions exist. Some accuracy reviews from the prior audit are tracked separately. |
| THIN | d2o2, d3o1 | CLI sessions/file operations and data-flow examples have limited teaching depth. |
| PARTIAL | d2o3 | Spaces is in the glossary/comparison but absent from lesson text; Agent Sessions/Sub-Agents have definitions but minimal lesson explanation. Spark is a historical syllabus term after product retirement. |
| MISSING | None | All 14 objectives have at least one lesson. |

## Supplement plan, fixed before content changes

| Priority | Type | Target | Required addition |
| --- | --- | --- | --- |
| P0 | B. Expand Lesson | `lesson-d2-cli` | Supported installation, workspace trust, file work, approvals, and session resume; keep CLI exclusion conflict flagged. |
| P1 | B. Expand Lesson | `lesson-d2-agent-edits` | Agent Sessions vs Sub-Agents in an actual task; keep mode-choice claims requiring review. |
| P1 | B. Expand Lesson | `lesson-d2-chat-essentials` | Spaces as reusable, shared Chat context; link to existing glossary and comparison. |
| P1 | B. Expand Lesson | `lesson-d3-data-flow`, `lesson-d3-retention-privacy` | Concrete input/output and training-versus-retention scenarios without inventing a fixed internal pipeline. |
| P1 | D. Add Comparison | MCP vs Agent Mode | Protocol/tool connection versus an agent's workflow; current capability choice. |
| P1 | Improve existing Glossary | Agent Sessions, Sub-Agents, Spaces | Correct overbroad claims and align lesson links; no new term required. |
| P2 | Possible comparison | CLI vs IDE Agent Mode | Useful if future verified questions show repeated confusion. |

No new Lesson or Glossary Term is planned. Spark remains a historical term because the current Study Guide still names it, while [GitHub's retirement notice](https://github.blog/changelog/2026-08-04-upcoming-deprecation-of-github-spark-on-github-com/) says new use stopped. Adding a current-use Spark lesson would mislead learners.

## Objective → knowledge → content map

The Study Guide's 14 objectives and their subtopics are mapped to 57 unique required glossary concepts in [the full inventory](./gh300-content-gap-inventory.json). Each inventory row includes the actual Lesson, Glossary, Comparison, and Verified Question IDs; the compact matrix below shows counts after expansion. A comparison is required where two similar capabilities must be distinguished, rather than for every objective.

| Objective | Required subtopics (abridged) | Lessons | Glossary | Comparisons | Verified questions | Content status |
| --- | --- | ---: | ---: | ---: | ---: | --- |
| d1o1 | Generative-AI risks, ethics, mitigation | 2 | 8 | 0 | 16 | COMPLETE |
| d1o2 | Validate outputs, responsible operation | 2 | 9 | 0 | 14 | COMPLETE |
| d2o1 | IDE enablement, suggestions, Chat, Agent mode | 2 | 11 | 3 | 19 | COMPLETE |
| d2o2 | CLI setup, commands, sessions, file/script work | 1 | 7 | 0 | 13 | THIN: CLI-specific questions |
| d2o3 | Edits, Agent Mode, MCP, Sessions, Sub-Agents, Spaces, Spark, review, instructions | 5 | 19 | 8 | 14 | THIN: several concepts untested |
| d2o4 | Organization policy, audit logs, subscription API | 1 | 9 | 1 | 15 | COMPLETE |
| d3o1 | Data use/flow, context, prompt building, response handling | 3 | 10 | 0 | 12 | COMPLETE* |
| d3o2 | Suggestion lifecycle, model limitations | 1 | 7 | 0 | 12 | COMPLETE* |
| d4o1 | Prompt context, zero-shot/few-shot | 2 | 16 | 2 | 15 | COMPLETE |
| d4o2 | Prompt process, conversation refinement | 2 | 7 | 0 | 11 | COMPLETE |
| d5o1 | Generation, refactoring, documentation, modernization | 2 | 12 | 1 | 15 | COMPLETE |
| d5o2 | Tests, edge cases, security/performance | 2 | 10 | 1 | 13 | COMPLETE |
| d6o1 | Exclusion, editor settings, ownership/privacy | 2 | 16 | 2 | 13 | COMPLETE* |
| d6o2 | Public-code matching, exclusion troubleshooting | 2 | 9 | 1 | 14 | COMPLETE* |

`*` indicates structural coverage, with individual claims still marked `needs-review` in the [accuracy audit](./gh300-learning-content-audit.md). The Study Guide is the exam blueprint; official product documentation is used for current behavior. Objective counts alone do not prove every concept is assessed by a correctly tagged question.

## Added

| Change | Count | Result |
| --- | ---: | --- |
| New Lessons | 0 | Existing teaching paths were sufficient. |
| Expanded Lessons | 5 | `lesson-d2-cli`, `lesson-d2-agent-edits`, `lesson-d2-chat-essentials`, `lesson-d3-data-flow`, `lesson-d3-retention-privacy`. |
| New Glossary Terms | 0 | Existing terms and aliases cover the required concepts. |
| Updated Glossary Terms | 3 | Sessions, Sub-Agents, and Spaces definitions and links were corrected; Spark's lesson link was corrected. |
| New Comparison Guides | 1 | `cmp-mcp-vs-agent-mode`, with role, use case, and combined-use examples. |
| Corrected Comparison Guides | 1 | `cmp-spaces-vs-chat` no longer claims ordinary Chat is confined to one local repository or that Spaces shares every chat thread. |
| New Official Sources | 4 | GitHub Docs for CLI installation, CLI use, CLI sessions, and IDE subagents. |

The CLI supplement covers installation, directory trust, permissions, files, scripts, and session resume using [installation](https://docs.github.com/en/copilot/how-tos/copilot-cli/set-up-copilot-cli/install-copilot-cli), [usage](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/overview), and [session](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/work-with-multiple-sessions) documentation. [IDE subagents](https://docs.github.com/en/copilot/how-tos/copilot-in-your-ide/use-copilot-agents/use-subagents) support the independent-context distinction. [Spaces](https://docs.github.com/en/copilot/concepts/context/spaces) provides organized, shareable context; [MCP](https://docs.github.com/en/copilot/concepts/context/mcp) connects tools and data, while [Agent Mode](https://docs.github.com/en/copilot/how-tos/copilot-in-your-ide/use-copilot-agents/use-agent-mode) carries out a tool-using workflow. The extra data-flow examples deliberately avoid asserting one undocumented internal pipeline for every Copilot surface.

## Lesson depth, sequence, and redundancy

All 28 Lessons have an objective, explanatory sections, key points, mistakes, review content, glossary links, and official-source links. The five expansions address missing concrete use or distinctions rather than adding duplicate Lessons. Average section-text length by domain is now about 828 / 1,060 / 705 / 816 / 754 / 787 characters per Lesson (d1–d6); d3 rose from about 619. Length is a screening proxy, not a quality grade. The remaining short Lessons have separate scopes, while the unverified details of the d3 pipeline remain flagged for source-level review.

The present order progresses from responsible use, to IDE suggestions/Chat, CLI, Agent Mode, MCP, governance, data flow, prompting, developer use cases, and privacy. Within d2, CLI precedes Sessions/Sub-Agents and MCP; within d3, input/flow precedes lifecycle limits. No order change was needed. Lesson prose explains scenarios, Glossary provides short definitions, and Comparison Guides focus on decisions. No new synonym-only term or duplicated Lesson was added. Normalized terms, full names, and aliases have no collision across different Glossary IDs. The new MCP comparison covers a distinct pairing from the existing MCP-vs-Extensions guide.

## Glossary, search, and essential checklist

All 110 Glossary entries have short/detailed definitions, why-it-matters, use cases, exam points, common confusions, related terms, and official source IDs. The 55 existing `essential` terms were retained; no extra term was promoted solely to raise a count. The inventory contains a per-term checklist for Lesson, Glossary, official source, and directly linked Verified Question. Its results are **55/55 Lesson**, **55/55 Glossary**, **55/55 official-source link**. **31/55 have no directly linked Verified Question**; this is an editorial assessment/linking gap, not proof that their ideas never appear in a question stem. Five essential terms have an official source link but no source currently marked `verified`; these relate to architecture, lifecycle, context limits, or ownership and remain in the accuracy-review queue.

Glossary search in `lib/knowledge.ts` matches `term`, `fullName`, `aliases`, and `shortDefinition` without case sensitivity. For example, the MCP entry is reachable through its acronym, `Model Context Protocol`, and Japanese alias; Spaces now also has Japanese aliases. No search implementation change was needed.

## Remaining gaps and question cross-check

The 13 questions tagged d2o2 do not directly mention Copilot CLI, whereas the two Verified stems that do (`q-d2-a22`, `q-d2-e13`) are tagged d2o1. Six of seven Verified stems explicitly mentioning Agent Mode are tagged d2o2, although the Agent Mode capability is listed under d2o3 in the Study Guide. Zero Verified stems explicitly mention Copilot Edits, Spaces, Spark, Agent Sessions, or Sub-Agents. Eleven mention MCP, but only eight are tagged d2o3. These are stem-string checks, so they may miss synonym or scenario-based assessment; they do show that objective counts overstate direct coverage for d2o2/d2o3. The newly added MCP-vs-Agent-Mode comparison also has no directly linked question. No questionable question was silently relabeled or promoted in this content-only pass.

The prior audit's **23 content items marked `needs-review`** remain so (8 Lessons, 13 Glossary entries, 2 Comparisons), alongside four questions withheld from Verified status. In particular, [GitHub's general exclusion page](https://docs.github.com/en/copilot/how-tos/configure-content-exclusion/exclude-content-from-copilot) and [CLI enterprise administration page](https://docs.github.com/en/copilot/how-tos/copilot-cli/administer-copilot-cli-for-your-enterprise) still conflict about CLI exclusion. This supplement does not turn that disputed claim into an exam rule. The current Study Guide still names Spark, while [GitHub's retirement notice](https://github.blog/changelog/2026-08-04-upcoming-deprecation-of-github-spark-on-github-com/) says new use/app creation stopped; the existing historic term remains, without recommending Spark for new work.

## Coverage after expansion

| Measure | Result |
| --- | ---: |
| Objective Lesson coverage | 14/14 = 100% |
| Objective Glossary coverage | 14/14 = 100% |
| Required concept IDs in Glossary | 57/57 = 100% |
| Essential terms linked to official sources | 55/55 = 100% |
| Objectives with a Comparison Guide | 8/14 = 57%; the other six have no essential pairwise choice |
| Objectives with Verified Questions | 14/14 = 100% by tag; see semantic gaps above |
| Broken references / active syllabus mismatches | 0 / 0 |
| Post-expansion classification | COMPLETE 12; THIN 2 (question specificity); PARTIAL 0; MISSING 0 |

The machine-readable inventory records all IDs and the essential checklist. Its integrity check reports zero broken links and zero Verified content without an official-source reference. The previous [full accuracy audit](./gh300-learning-content-audit.md) remains the claim-level review queue; this report does not treat a stored `verified` flag as fresh validation of every sentence.

## P2 candidates

- Add a current CLI vs IDE Agent Mode comparison if future question reviews show repeated confusion. A targeted question/label review for d2o2 and d2o3 is a higher priority than expanding more Lessons.
- Create a small set of scenario-based questions for Spaces, Copilot Edits, Agent Sessions/Sub-Agents, and MCP vs Agent Mode after confirming their objective labels against the Study Guide.
- Recheck official architecture and ownership sources before promoting the five essential terms that lack a source marked `verified` or resolving disputed content-exclusion answers.
