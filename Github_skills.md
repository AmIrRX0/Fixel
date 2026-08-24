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

> Turn a labeled GitHub issue into a reviewable pull request with Claude or Codex. Open-source GitHub Action + CLI with fork mode and dry runs.

Why this wording:

- "Reviewable" sets the correct human-in-the-loop expectation. Fixel opens a PR; it does not guarantee correctness or auto-merge code.
- "Label an issue" is a memorable, observable input.
- GitHub Action + CLI explains how it is adopted.
- Fork mode and dry runs reduce the perceived risk of trying it.

Recommended topics:

`github-actions`, `ai-agent`, `coding-agent`, `github-issues`, `pull-request`, `automation`, `claude`, `claude-code`, `codex`, `openai`, `developer-tools`, `open-source`, `nodejs`, `devops`

## Trust gates before promotion

Do not run a broad launch until all P0 gates pass:

- [x] Agent shell commands cannot read GitHub, Anthropic, package registry, cloud, or local credentials.
- [x] Agent commands run in a fail-closed sandbox with a strict network allowlist.
- [x] Issue text and comments are explicitly treated as untrusted input.
- [x] Tests exercise the secret boundary and sandbox options.
- [x] CI runs on pushes and pull requests.
- [x] README says that every generated PR must be reviewed before merge.
- [x] Examples use the immutable version tag `@v1.1.0`, not mutable `@main`.
- [x] Release `v1.1.0` exists and the Action is installable from an immutable version.
- [x] A real Fixel/Codex end-to-end run is recorded: [issue #10](https://github.com/AmIrRX0/Fixel/issues/10) -> [PR #11](https://github.com/AmIrRX0/Fixel/pull/11) -> [release v1.1.0](https://github.com/AmIrRX0/Fixel/releases/tag/v1.1.0).

Why this comes first: public developer communities quickly reject low-quality automated PRs and opaque AI tooling. Fixel earns permission to spread by being transparent, constrained, and useful.

## Repository conversion checklist

### Understand in 10 seconds

- [x] Outcome-led tagline is visible without scrolling.
- [ ] 20–40 second GIF/video shows issue label -> run -> diff -> PR.
- [ ] README separates "what it does," "try safely," and "production setup."
- [x] Social preview is 1280×640 and readable at thumbnail size.
- [x] Description and topics match the words users search for.

### Trust in 60 seconds

- [x] CI badge is green.
- [x] Security model and threat boundaries are documented.
- [x] Supported runner/Node versions are explicit (Node.js 20+).
- [ ] Costs, API-key requirement, permissions, and limitations are disclosed.
- [x] A reproducible Codex-assisted maintenance example is linked: [issue #7](https://github.com/AmIrRX0/Fixel/issues/7) -> [PR #8](https://github.com/AmIrRX0/Fixel/pull/8).
- [x] A real Fixel/Codex product run is linked separately: [issue #10](https://github.com/AmIrRX0/Fixel/issues/10) -> [PR #11](https://github.com/AmIrRX0/Fixel/pull/11).
- [x] Releases and changelog make changes auditable.

### Try in 5 minutes

- [x] Copy-paste Action example uses `AmIrRX0/Fixel@v1.1.0`.
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
| 2026-08-24 | Trust and versioned installation are prerequisites for effective launch conversion | Add credential isolation, adversarial tests, CI, security docs, `@v1.0.0` examples, release metadata, topics, and social preview | All technical and repository P0 trust gates pass | Before launch | Passed; the remaining launch gate is a real recorded end-to-end run | Proceed to controlled dogfood before broad promotion |
| 2026-08-24 | A ChatGPT-authenticated Codex CLI can produce an honest issue-to-PR maintenance case study | Create [issue #7](https://github.com/AmIrRX0/Fixel/issues/7), generate the fix with Codex in a workspace-write sandbox, independently test it, and merge [PR #8](https://github.com/AmIrRX0/Fixel/pull/8) after CI | Issue closed by a reviewed, CI-green PR | Before promotion | Passed: 5 tests and package check passed; PR #8 merged and closed issue #7 | Use as Codex-assisted build-in-public proof, not as proof that Fixel v1.0.0 ran successfully |
| 2026-08-24 | A local Codex provider can remove the Anthropic-key blocker without weakening the credential boundary | Use Fixel itself to solve [issue #10](https://github.com/AmIrRX0/Fixel/issues/10), adversarially probe the generated sandbox, harden it, merge [PR #11](https://github.com/AmIrRX0/Fixel/pull/11), and publish [v1.1.0](https://github.com/AmIrRX0/Fixel/releases/tag/v1.1.0) | A real CI-green PR opens without `ANTHROPIC_API_KEY`, and credential-content access is blocked | Before promotion | Passed: Fixel opened PR #11; initial probe found readable Codex auth, granular permissions changed the result to `AUTH_CONTENT_BLOCKED`; workspace write, 10 tests, Node 20/22 CI, and package check passed | Use this honest find-and-fix story as the primary launch proof |
| TBD | A 20–40 second issue-to-PR demo improves repository conversion | Add an honest recorded demo above the fold | Visitor-to-star and install-click change | 7 days | — | — |
| 2026-08-24 | A technical Reddit story produces qualified testers | Publish a disclosed-builder comment in the official [r/github self-promotion megathread](https://www.reddit.com/r/github/comments/1jy8rea/comment/p5jmxhs/) and answer every substantive question | Successful runs and actionable reports | 7 days | Pending; baseline at publication was 3 stars and 0 forks | Monitor replies and GitHub traffic; do not duplicate the same copy into other communities |
| 2026-08-24 | A LinkedIn build-in-public security story reaches maintainers | Publish the honest sandbox find-and-fix case study with repository, release, and PR proof in a [public LinkedIn post](https://www.linkedin.com/feed/update/urn:li:activity:7497522057832804353/) | Qualified repo visits, workflow copies, and test reports | 7 days | Pending; baseline at publication was 3 stars and 0 forks | Reply to technical questions quickly and compare the 24-hour and 7-day signals with baseline |

## Decision journal

- **2026-08-24 — Optimize for real use, not artificial stars.** Bought/fake stars damage credibility and do not create users.
- **2026-08-24 — Secure before launch.** Issue bodies and comments are untrusted; prompt instructions alone are not a security boundary. The agent environment must exclude tokens and its command sandbox must fail closed.
- **2026-08-24 — Promise a reviewable PR, not a correct fix.** This is accurate, aligns with GitHub review workflows, and addresses skepticism about AI-generated code.
- **2026-08-24 — Pin public examples to `@v1.0.0`.** A mutable default branch is not a stable installation contract. Add a floating `v1` tag only when release automation can update it deliberately after compatible releases.
- **2026-08-24 — Verify binary assets after remote publication.** The first PNG blob was truncated in transport while retaining a valid-looking header. Replace it with a visually verified 1280×640 JPEG and validate the fetched artifact before upload.
- **2026-08-24 — Complete repository-native discovery before external promotion.** Publish `v1.0.0`, use immutable install examples, set an outcome-led description, add focused topics, and verify the social preview survives a settings-page reload.
- **2026-08-24 — Move to controlled dogfood, not a broad launch yet.** The technical and repository gates now pass, but Reddit and LinkedIn promotion should wait for one reproducible issue-to-PR run that can be shown honestly.
- **2026-08-24 — Record failed dogfood attempts too.** Fixel v1.0.0 reached the Claude agent step for issue #7, but the signed-in Claude organization disabled subscription access and required an Anthropic API key. This is an authentication prerequisite, not a successful product run.
- **2026-08-24 — Keep provider attribution exact.** Codex successfully generated the fix for issue #7 using the repository owner's ChatGPT-authenticated Codex CLI; PR #8 passed CI and was merged. This validates the maintenance workflow and provides an honest Codex-assisted case study, but it must not be marketed as a Fixel/Claude-generated PR.
- **2026-08-24 — Separate local auth from hosted automation.** A ChatGPT-authenticated Codex CLI is a valid local Fixel provider and removes the Anthropic-key requirement for local dogfood. It is not a deployable GitHub Actions credential: keep the hosted Action on an explicit provider credential, pass untrusted issue text through stdin, and never expose GitHub or API tokens to the agent subprocess.
- **2026-08-24 — Verify sandbox claims with adversarial smoke tests.** Fixel's first Codex dogfood run opened [PR #11](https://github.com/AmIrRX0/Fixel/pull/11) without `ANTHROPIC_API_KEY`, but a follow-up probe showed that the legacy `workspace-write` profile could read `~/.codex/auth.json`. Do not rely on the profile name or prompt rules as a credential boundary. Use a granular Codex permission profile that writes only project roots, explicitly denies Codex/SSH/cloud/package credential paths, and allows only required network domains. The same non-disclosing probe then returned `AUTH_CONTENT_BLOCKED`.
- **2026-08-24 — Promotion gate passed with qualified proof.** PR #11 passed Node 20/22 CI, closed issue #10 on merge, and shipped as v1.1.0. External promotion may now use the real issue-to-PR story, including the sandbox flaw found during review. The next conversion asset is a short capture of this verified flow—not a staged claim.
- **2026-08-24 — Proof must be real.** Do not add a demo, benchmark, testimonial, install number, or success rate until it is reproducible and linked.
- **2026-08-24 — Require Node.js 20+.** The current secured Agent SDK uses RegExp set notation unavailable in Node 18. A direct Node 18 import test failed; Node 20 and 22 pass. Keeping a false Node 18 compatibility claim would create failed first runs.
- **2026-08-24 — Start Reddit promotion in the community's designated lane.** r/github routes tools, libraries, side projects, and GitHub-hosted work into its recurring self-promotion megathread. Publish there instead of creating a standalone promotional post, disclose that the author built Fixel, and ask for reproducible failures rather than votes or stars.
- **2026-08-24 — Lead LinkedIn with the failure that improved the product.** The first Codex implementation passed normal tests but failed an adversarial credential probe. That concrete find-and-fix story is stronger and more trustworthy than a generic release announcement, and every claim is backed by issue #10, PR #11, CI, and release v1.1.0.
- **2026-08-24 — Controlled launch is now live.** The first distribution pair is the [r/github comment](https://www.reddit.com/r/github/comments/1jy8rea/comment/p5jmxhs/) and [LinkedIn post](https://www.linkedin.com/feed/update/urn:li:activity:7497522057832804353/). Do not judge the experiment from immediate stars. Capture the same GitHub traffic, star, fork, issue, and external-run signals after 24 hours and 7 days.

## Primary references

- [GitHub Docs: Classifying your repository with topics](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/classifying-your-repository-with-topics)
- [GitHub Docs: Customizing your repository's social media preview](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/customizing-your-repositorys-social-media-preview)
- [GitHub Docs: Releasing and maintaining actions](https://docs.github.com/en/actions/sharing-automations/creating-actions/releasing-and-maintaining-actions)
- [GitHub Docs: Publishing actions in GitHub Marketplace](https://docs.github.com/en/actions/sharing-automations/creating-actions/publishing-actions-in-github-marketplace)
- [Anthropic Claude Agent SDK documentation](https://platform.claude.com/docs/en/agent-sdk/overview)
- [OpenAI Codex authentication](https://learn.chatgpt.com/docs/auth)
- [OpenAI Codex developer commands](https://learn.chatgpt.com/docs/developer-commands?surface=cli)
- [OpenAI Codex sandboxing](https://learn.chatgpt.com/docs/sandboxing)
