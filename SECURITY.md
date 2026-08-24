# Security policy

Fixel turns untrusted GitHub issue text and comments into code changes, so its primary security boundary is the agent sandbox—not the prompt.

## Supported versions

Security fixes are applied to the latest release and the current `main` branch. Upgrade to the newest compatible `v1` release before reporting a problem that may already be fixed.

## Security model

- The Claude subprocess receives an allowlisted environment. GitHub, package registry, cloud-provider, and unrelated host credentials are excluded.
- The Anthropic key must reach Claude itself, but sandboxed shell commands are denied access to it.
- Shell commands run with filesystem isolation, a strict network allowlist, and explicit credential-file denial.
- Sandbox setup fails closed. Fixel will stop instead of silently running agent commands without isolation.
- The agent works in a temporary clone. Git commit, push, and pull-request creation happen outside the agent session.
- Public issue text and comments are treated as untrusted input. A generated pull request is a proposal and must be reviewed before merge.

The GitHub Action installs the Linux sandbox prerequisites when they are absent. CLI users must meet the [Claude Agent SDK sandbox prerequisites](https://platform.claude.com/docs/en/agent-sdk/overview) for their platform.

## Known boundaries

- Fixel does not prove that generated code is correct or free of vulnerabilities.
- The configured GitHub token can push branches and create pull requests outside the agent sandbox. Use the minimum repository permissions shown in the examples.
- The agent can access the checked-out repository and the explicitly allowlisted package/documentation hosts required to investigate and test a fix.
- Repository code and test scripts are also untrusted. Run Fixel on an isolated runner, prefer fork or dry-run mode for unfamiliar projects, and review the resulting diff and CI output.
- Never use an account-wide personal access token when a repository-scoped token or the workflow's `GITHUB_TOKEN` is sufficient.

## Reporting a vulnerability

Please do not open a public issue for an undisclosed vulnerability. Use GitHub's private vulnerability reporting for this repository if it is enabled. Otherwise, contact the maintainer through the private contact method listed on their GitHub profile and include:

- affected version or commit;
- reproduction steps and impact;
- whether the issue is already public or actively exploited;
- any suggested mitigation.

Do not include real credentials or third-party data in a report. A maintainer should acknowledge the report within seven days and coordinate disclosure after a fix is available.

