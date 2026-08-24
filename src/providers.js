import { solveIssue as solveWithClaude } from "./agent.js";
import { solveIssue as solveWithCodex } from "./codex.js";

export const PROVIDERS = ["claude", "codex"];

export function solveIssue(opts, implementations = {}) {
  const provider = opts.provider ?? "claude";
  const solvers = {
    claude: implementations.claude ?? solveWithClaude,
    codex: implementations.codex ?? solveWithCodex,
  };
  const solver = solvers[provider];
  if (!solver) throw new Error(`Unsupported provider: ${provider}`);
  const { provider: _provider, ...solverOpts } = opts;
  return solver(solverOpts);
}
