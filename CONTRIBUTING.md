# Contributing to Fixel 🔧

Thanks for wanting to help! Fixel is small on purpose — plain ESM JavaScript, two dependencies, no build step.

## Getting started

```bash
git clone https://github.com/AmIrRX0/Fixel.git
cd Fixel
npm install
node src/cli.js --help
```

Test your changes safely against a real repo with `--dry-run` (no push, no PR):

```bash
node --env-file=.env src/cli.js --repo you/some-repo --dry-run --verbose
```

## Guidelines

- Keep it dependency-light. Reach for the standard library before adding a package.
- One focused change per PR, with a clear description of the before/after behavior.
- Run `node --check src/*.js` before pushing.
- Security-sensitive areas (token handling in `src/git.js`, prompt rules in `src/agent.js`) get extra scrutiny in review — explain your reasoning in the PR.

## Ideas up for grabs

Check the [roadmap in the README](README.md#-roadmap) — the unchecked items are open. Comment on an issue (or open one) before starting big work so we don't collide.
