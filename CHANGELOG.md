# Changelog

All notable changes to Fixel will be documented here. The project follows [Semantic Versioning](https://semver.org/).

## [1.2.0] - 2026-08-26

### Added

- Add `fixel learn --repo owner/repo --pr N` to capture pull-request descriptions, review feedback, inline comments, conversation comments, and failed checks as a local lesson draft.
- Load version-controlled `.fixel/lessons/*.md` files into future issue-fixing prompts only after a maintainer changes their status to `approved`.
- Add a reproducible Never Fail Twice gate benchmark and the first approved lesson derived from Fixel PR #11.

### Security

- Keep generated lessons inert by default and require an explicit human promotion step.
- Treat all captured review and CI material as untrusted evidence, never as executable instructions.
- Bound the number and size of loaded lessons and ignore drafts, malformed files, and symlinks.

## [1.1.0] - 2026-08-24

### Added

- Add a local `--provider codex` path that uses an authenticated Codex CLI without requiring `ANTHROPIC_API_KEY`.
- Add provider routing, credential-isolation, stdin prompt, and CLI validation tests.

### Changed

- Attribute generated pull requests to the provider that actually produced them.
- Keep the GitHub Action explicitly on the Claude provider; local ChatGPT authentication is not copied to hosted runners.

## [1.0.0] - 2026-08-24

### Security

- Run agent shell commands in a fail-closed filesystem and network sandbox.
- Exclude GitHub, package registry, cloud, and unrelated host credentials from the Claude subprocess.
- Deny sandboxed commands access to the Anthropic key and common credential files.

### Added

- Automated security-boundary tests across supported Node.js versions.
- Continuous integration and Dependabot configuration.
- Security policy and a living GitHub growth playbook.

### Changed

- Pin the Claude Agent SDK to an audited exact version.
- Require Node.js 20 or newer for the current Claude Agent SDK and sandbox runtime.
- Position Fixel as producing a reviewable pull request, preserving human review as the final gate.
- Use the immutable `v1.0.0` Action reference in installation examples.
