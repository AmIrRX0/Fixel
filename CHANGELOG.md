# Changelog

All notable changes to Fixel will be documented here. The project follows [Semantic Versioning](https://semver.org/).

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
