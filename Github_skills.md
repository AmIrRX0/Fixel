# Fixel GitHub Growth Playbook

This is the repository's living growth notebook. Update it after every meaningful launch, experiment, user conversation, or repository change. Keep evidence separate from assumptions, record the metric before judging an experiment, and never manufacture stars, testimonials, benchmarks, or usage claims.

## Goal

Make Fixel easy to understand, safe to trust, quick to try, and worth sharing. Stars are a lagging signal. The operating funnel is:

`qualified impression -> repository visit -> understood in 10 seconds -> trusted -> tried -> successful PR -> star/share`

The durable growth loop is successful user outcomes producing public proof, not mass promotion.

## Baseline — 2026-08-24

| Signal | Starting point |
|---|---:|
| Stars | 3 |
| Forks | 0 |
| Releases | 0 |
| Repository description | Missing |
| Topics | Missing |
| Homepage | Missing |
| CI workflow | Missing |
| Automated tests | Missing |
| Product demo | Banner only; no workflow demo |
| Recommended Action reference | `@main` |

This snapshot is the comparison point for launch-readiness work. Re-check it before and 24 hours, 7 days, and 30 days after each distribution push.

## What current breakout repositories teach us

The comparison set was sampled from GitHub Trending on 2026-08-24. Weekly star counts are a time-specific observation, not a promise of similar results.

| Repository | Observed weekly stars | Reusable pattern |
|---|---:|---|
| [career-ops](https://github.com/GauravSingh9356/career-ops) | ~3,973 | Immediate visual demo, measurable outcome, releases, topics, community and press proof |
| [munder-difflin](https://github.com/chaitanyagiri/munder-difflin) | ~2,647 | Memorable one-line concept, strong hero/video, easy-to-share story |
| [token-monitor](https://github.com/skarard/Token-monitor) | ~223 | Demo GIF, download/release badges, focused use case, useful metadata |

The repeated pattern is not "make a long README." It is:

1. State one concrete outcome above the fold.
2. Show the outcome in a short visual proof.
3. Make the first successful run low-friction and versioned.
4. Provide trust signals: tests, CI, security boundaries, releases, and honest limitations.
5. Launch to a specific audience with a useful story, then respond to feedback quickly.

## Positioning

Primary promise:

> **Label an issue. Get a reviewable pull request.**

Repository description:

> Turn a labeled GitHub issue into a reviewable pull request with Claude. Open-source GitHub Action + CLI with fork mode and dry runs.

Why this wording:

- "Reviewable" sets the correct human-in-the-loop expectation. Fixel opens a PR; it does not guarantee correctness or auto-merge code.
- "Label an issue" is a memorable, observable input.
- GitHub Action + CLI explains how it is adopted.
- Fork mode and dry runs reduce the perceived risk of trying it.

Recommended topics:

`github-actions`, `ai-agent`, `coding-agent`, `github-issues`, `pull-request`, `automation`, `claude`, `claude-code`, `developer-tools`, `open-source`, `nodejs`, `devops`

## Trust gates before promotion

Do not run a broad launch until all P0 gates pass:

- [x] Agent shell commands cannot read GitHub, Anthropic, package registry, cloud, or local credentials.
- [x] Agent commands run in a fail-closed sandbox with a strict network allowlist.
- [x] Issue text and comments are explicitly treated as untrusted input.
- [x] Tests exercise the secret boundary and sandbox options.
- [x] CI runs on pushes and pull requests.
- [x] README says that every generated PR must be reviewed before merge.
- [x] Examples use the immutable version tag `@v1.0.0`, not mutable `@main`.
- [ ] A release exists and the Action is installable from an immutable version.
- [ ] A real end-to-end run is recorded; no synthetic success claim is presented as user proof.

Why this comes first: public developer communities quickly reject low-quality automated PRs and opaque AI tooling. Fixel earns permission to spread by being transparent, constrained, and useful.

## Repository conversion checklist

### Understand in 10 seconds

- [x] Outcome-led tagline is visible without scrolling.
- [ ] 20–40 second GIF/video shows issue label -> run -> diff -> PR.
- [ ] README separates "what it does," "try safely," and "production setup."
- [ ] Social preview is 1280×640 and readable at thumbnail size.
- [ ] Description and topics match the words users search for.

### Trust in 60 seconds

- [x] CI badge is green.
- [x] Security model and threat boundaries are documented.
- [x] Supported runner/Node versions are explicit (Node.js 20+).
- [ ] Costs, API-key requirement, permissions, and limitations are disclosed.
- [ ] At least one reproducible example repository or issue/PR pair is linked.
- [ ] Releases and changelog make changes auditable.

### Try in 5 minutes

- [x] Copy-paste Action example uses `AmIrRX0/Fixel@v1.0.0`.
- [x] Minimal required permissions are shown.
- [x] Dry-run path is prominent.
- [ ] Failure messages explain missing prerequisites.
- [ ] A beginner can reach the first safe run without reading the entire README.

## Distribution playbook

### Reddit

Lead with a useful engineering story, not a star request. Choose only communities whose rules allow project posts. A good post includes:

- the concrete pain: an issue backlog and the review work around automated fixes;
- a short demo and an honest architecture/security explanation;
- what failed or changed during development;
- a request for criticism or test cases;
- disclosure that the author built the project.

Do not cross-post identical copy everywhere, buy votes, coordinate upvotes, or automate comments. Reply technically and quickly. The success metric is qualified discussion, installs, and reproducible feedback—not raw impressions.

### LinkedIn

Use a native short video or GIF, a two-line outcome, and one concrete lesson. Prefer a build-in-public sequence:

1. Problem and 20-second demo.
2. Security design and threat model.
3. Real issue-to-PR case study with outcome and limitations.
4. Release announcement with exact install snippet.

Ask for a specific action such as "try it on a small labeled issue and tell me where it fails." Avoid generic engagement bait.

### GitHub-native discovery

- Keep topics, description, social preview, releases, and Marketplace listing complete.
- Create small, well-scoped `good first issue` items with contribution guidance.
- Link real generated PRs as proof.
- Respond to issues and PRs promptly during launch week.
- Use versioned releases and maintain the floating major tag (`v1`) after each compatible release.

## Metrics

Record both conversion and product quality:

| Layer | Metrics |
|---|---|
| Reach | Qualified post views, repository visitors, traffic source |
| Interest | Visitor-to-star rate, README demo plays/clicks, returning visitors |
| Adoption | Workflow copies, Action runs, CLI installs, unique repositories |
| Outcome | PRs opened, PRs merged, no-change/error rate, time to first PR |
| Trust | Security reports, permission failures, reverted PRs, support issues |
| Community | Issues from non-maintainers, external PRs, repeat contributors |

North-star candidate: **reviewed Fixel PRs merged in distinct repositories per week**. Stars help discovery, but successful reviewed PRs validate the product.

## Experiment log

Fill the result only after the measurement window closes.

| Date | Hypothesis | Action | Primary metric | Window | Result | Decision |
|---|---|---|---|---|---|---|
| 2026-08-24 | Trust and versioned installation are prerequisites for effective launch conversion | Add credential isolation, adversarial tests, CI, security docs, and `@v1` examples | All P0 trust gates pass | Before launch | In progress | Pending |
| TBD | A 20–40 second issue-to-PR demo improves repository conversion | Add an honest recorded demo above the fold | Visitor-to-star and install-click change | 7 days | — | — |
| TBD | A technical Reddit story produces qualified testers | Publish in one rules-compatible community and answer every substantive question | Successful runs and actionable reports | 7 days | — | — |
| TBD | A native LinkedIn build-in-public demo reaches maintainers | Publish demo + threat-model lesson | Qualified repo visits and workflow copies | 7 days | — | — |

## Decision journal

- **2026-08-24 — Optimize for real use, not artificial stars.** Bought/fake stars damage credibility and do not create users.
- **2026-08-24 — Secure before launch.** Issue bodies and comments are untrusted; prompt instructions alone are not a security boundary. The agent environment must exclude tokens and its command sandbox must fail closed.
- **2026-08-24 — Promise a reviewable PR, not a correct fix.** This is accurate, aligns with GitHub review workflows, and addresses skepticism about AI-generated code.
- **2026-08-24 — Pin public examples to `@v1.0.0`.** A mutable default branch is not a stable installation contract. Add a floating `v1` tag only when release automation can update it deliberately after compatible releases.
- **2026-08-24 — Verify binary assets after remote publication.** The first PNG blob was truncated in transport while retaining a valid-looking header. Replace it with a visually verified 1280×640 JPEG and validate the fetched artifact before upload.
- **2026-08-24 — Proof must be real.** Do not add a demo, benchmark, testimonial, install number, or success rate until it is reproducible and linked.
- **2026-08-24 — Require Node.js 20+.** The current secured Agent SDK uses RegExp set notation unavailable in Node 18. A direct Node 18 import test failed; Node 20 and 22 pass. Keeping a false Node 18 compatibility claim would create failed first runs.

## Primary references

- [GitHub Docs: Classifying your repository with topics](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/classifying-your-repository-with-topics)
- [GitHub Docs: Customizing your repository's social media preview](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/customizing-your-repositorys-social-media-preview)
- [GitHub Docs: Releasing and maintaining actions](https://docs.github.com/en/actions/sharing-automations/creating-actions/releasing-and-maintaining-actions)
- [GitHub Docs: Publishing actions in GitHub Marketplace](https://docs.github.com/en/actions/sharing-automations/creating-actions/publishing-actions-in-github-marketplace)
- [Anthropic Claude Agent SDK documentation](https://platform.claude.com/docs/en/agent-sdk/overview)
