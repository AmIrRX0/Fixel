# Security policy

Fixel turns untrusted GitHub issue text and comments into code changes, so its primary security boundary is the agent sandbox—not the prompt.

## Supported versions

Security fixes are applied to the latest release and the current `main` branch. Upgrade to the newest compatible `v1` release before reporting a problem that may already be fixed.

## Security model

- Both provider subprocesses receive an allowlisted environment. GitHub, package registry, cloud-provider, and unrelated API credentials are excluded.
- For Claude, the Anthropic key must reach the SDK itself, but sandboxed shell commands are denied access to it. Claude commands use filesystem isolation, a strict network allowlist, and explicit credential-file denial; sandbox setup fails closed.
- For Codex, local authentication context is retained so the CLI can sign in, while GitHub, Anthropic, OpenAI, package, and unrelated environment secrets are removed. Codex runs ephemerally without loading user config or exec-policy rules. A granular permission profile makes project roots writable, keeps the rest of the filesystem read-only, explicitly denies common Codex/SSH/cloud/package credential paths, and allowlists required network domains.
- Untrusted issue text is passed to Codex through stdin rather than interpolated into a shell command or visible process argument.
- The agent works in a temporary clone. Git commit, push, and pull-request creation happen outside the agent session.
- Public issue text and comments are treated as untrusted input. A generated pull request is a proposal and must be reviewed before merge.

The GitHub Action currently uses the Claude provider and installs the Linux sandbox prerequisites when they are absent. Claude CLI users must meet the [Claude Agent SDK sandbox prerequisites](https://platform.claude.com/docs/en/agent-sdk/overview) for their platform. Codex CLI users need a local `codex login`; do not copy local ChatGPT authentication files or sessions to hosted runners.

## Known boundaries

- Fixel does not prove that generated code is correct or free of vulnerabilities.
- The configured GitHub token can push branches and create pull requests outside the agent sandbox. Use the minimum repository permissions shown in the examples.
- The agent can access the checked-out repository and the explicitly allowlisted package/documentation hosts required to investigate and test a fix.
- The local Codex provider relies on the installed Codex CLI enforcing its granular permission profile. Keep Codex updated, run Fixel on an isolated machine for unfamiliar repositories, and review every generated pull request.
- Repository code and test scripts are also untrusted. Run Fixel on an isolated runner, prefer fork or dry-run mode for unfamiliar projects, and review the resulting diff and CI output.
- Never use an account-wide personal access token when a repository-scoped token or the workflow's `GITHUB_TOKEN` is sufficient.

## Reporting a vulnerability

Please do not open a public issue for an undisclosed vulnerability. Use GitHub's private vulnerability reporting for this repository if it is enabled. Otherwise, contact the maintainer through the private contact method listed on their GitHub profile and include:

- affected version or commit;
- reproduction steps and impact;
- whether the issue is already public or actively exploited;
- any suggested mitigation.

Do not include real credentials or third-party data in a report. A maintainer should acknowledge the report within seven days and coordinate disclosure after a fix is available.
