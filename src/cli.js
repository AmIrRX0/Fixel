#!/usr/bin/env node
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { version } = require("../package.json");

const HELP = `
🔧 fixel — every issue, fixed: an AI coding agent fixes issues and opens pull requests

Usage:
  fixel --repo <owner/name> [options]

Options:
  --repo <owner/name>   Target repository (required)
  -V, --version         Show the version
  --fork                Fork the repo and open PRs from the fork
                        (automatic when you don't have push access)
  --issue <n>           Only work on issue #n (repeatable: --issue 3 --issue 7)
  --max-issues <n>      Max number of issues to process in one run (default: 3)
  --labels <a,b>        Only pick issues that have these labels
  --base <branch>       Base branch for PRs (default: repo default branch)
  --provider <name>     Agent provider: claude or codex (default: claude)
  --model <id>          Provider model (default: the provider's CLI default)
  --workdir <dir>       Where repos get cloned (default: OS temp dir)
  --dry-run             Fix locally and show the diff, but don't push or open PRs
  --verbose             Stream the agent's progress
  -h, --help            Show this help

Environment:
  GITHUB_TOKEN          required — GitHub token used for API + git push
  ANTHROPIC_API_KEY     Claude API key (Claude only; optional if logged in)

Examples:
  fixel --repo myuser/myapp --provider codex --max-issues 5
  fixel --repo bigorg/oss-project --fork --issue 42 --verbose
  fixel --repo myuser/myapp --labels bug,good-first-issue --dry-run
`;

export function parseArgs(argv) {
  const opts = { provider: "claude", issues: [], labels: [], maxIssues: 3, fork: false, dryRun: false, verbose: false };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    const next = () => {
      const v = argv[++i];
      if (v === undefined) throw new Error(`Missing value for ${arg}`);
      return v;
    };
    switch (arg) {
      case "--repo": opts.repo = next(); break;
      case "--fork": opts.fork = true; break;
      case "--issue": opts.issues.push(Number(next())); break;
      case "--max-issues": opts.maxIssues = Number(next()); break;
      case "--labels": opts.labels = next().split(",").map((s) => s.trim()).filter(Boolean); break;
      case "--base": opts.base = next(); break;
      case "--provider": opts.provider = next(); break;
      case "--model": opts.model = next(); break;
      case "--workdir": opts.workdir = next(); break;
      case "--dry-run": opts.dryRun = true; break;
      case "--verbose": opts.verbose = true; break;
      case "-V":
      case "--version": console.log(version); process.exit(0);
      case "-h":
      case "--help": console.log(HELP); process.exit(0);
      default: throw new Error(`Unknown option: ${arg}`);
    }
  }
  return opts;
}

async function main() {
  let opts;
  try {
    opts = parseArgs(process.argv.slice(2));
  } catch (err) {
    console.error(`Error: ${err.message}\n${HELP}`);
    process.exit(2);
  }

  if (!opts.repo || !/^[^/\s]+\/[^/\s]+$/.test(opts.repo)) {
    console.error(`Error: --repo <owner/name> is required.\n${HELP}`);
    process.exit(2);
  }
  if (opts.issues.some((n) => !Number.isInteger(n) || n <= 0)) {
    console.error("Error: --issue expects a positive issue number.");
    process.exit(2);
  }
  if (!["claude", "codex"].includes(opts.provider)) {
    console.error("Error: --provider expects claude or codex.");
    process.exit(2);
  }

  const [{ loadConfig }, { run }, { banner }] = await Promise.all([
    import("./config.js"),
    import("./runner.js"),
    import("./ui.js"),
  ]);

  console.log(banner());
  const config = loadConfig();
  const [owner, repo] = opts.repo.split("/");

  const results = await run({
    owner,
    repo,
    token: config.token,
    provider: opts.provider,
    model: opts.model ?? config.model,
    workdir: opts.workdir ?? config.workdir,
    fork: opts.fork,
    issues: opts.issues,
    maxIssues: opts.maxIssues,
    labels: opts.labels,
    base: opts.base,
    dryRun: opts.dryRun,
    verbose: opts.verbose,
  });

  const failed = results.filter((r) => r.status === "agent-error").length;
  process.exit(failed > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error(`Fatal: ${err.message}`);
  process.exit(1);
});
