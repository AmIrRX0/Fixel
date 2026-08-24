import { query } from "@anthropic-ai/claude-agent-sdk";
import { buildPrompt } from "./prompt.js";

const AGENT_ENV_ALLOWLIST = new Set([
  "PATH",
  "HOME",
  "USER",
  "LOGNAME",
  "SHELL",
  "TMPDIR",
  "TMP",
  "TEMP",
  "LANG",
  "LC_ALL",
  "CI",
  "GITHUB_ACTIONS",
  "RUNNER_OS",
  "RUNNER_ARCH",
  // Required by the Claude subprocess, but hidden from Bash commands by the
  // sandbox credential policy below.
  "ANTHROPIC_API_KEY",
  "ANTHROPIC_BASE_URL",
]);

export const PROTECTED_AGENT_ENV_VARS = [
  "ANTHROPIC_API_KEY",
  "GITHUB_TOKEN",
  "GH_TOKEN",
  "GIT_AGENT_TOKEN",
  "OPENAI_API_KEY",
  "NPM_TOKEN",
  "NODE_AUTH_TOKEN",
  "AWS_ACCESS_KEY_ID",
  "AWS_SECRET_ACCESS_KEY",
  "AWS_SESSION_TOKEN",
  "GOOGLE_APPLICATION_CREDENTIALS",
];

const PROTECTED_CREDENTIAL_PATHS = [
  "~/.claude",
  "~/.ssh",
  "~/.aws",
  "~/.config/gcloud",
  "~/.docker/config.json",
  "~/.git-credentials",
  "~/.netrc",
  "~/.npmrc",
];

const DEFAULT_AGENT_NETWORK_DOMAINS = [
  "localhost",
  "127.0.0.1",
  "github.com",
  "api.github.com",
  "raw.githubusercontent.com",
  "objects.githubusercontent.com",
  "codeload.github.com",
  "registry.npmjs.org",
  "pypi.org",
  "files.pythonhosted.org",
  "repo.maven.apache.org",
  "crates.io",
  "static.crates.io",
  "proxy.golang.org",
  "sum.golang.org",
  "rubygems.org",
  "api.nuget.org",
];

/**
 * Build the environment inherited by the Claude subprocess.
 *
 * GitHub and package-registry credentials deliberately never cross this
 * boundary. The Anthropic key must reach Claude itself, but sandboxed commands
 * see it removed by buildAgentSandbox().
 */
export function buildAgentEnvironment(source = process.env) {
  const env = {};
  for (const name of AGENT_ENV_ALLOWLIST) {
    if (typeof source[name] === "string") env[name] = source[name];
  }
  env.CLAUDE_AGENT_SDK_CLIENT_APP = "fixel/1.1.0";
  return env;
}

/** Fail closed when command isolation is unavailable. */
export function buildAgentSandbox() {
  return {
    enabled: true,
    failIfUnavailable: true,
    autoAllowBashIfSandboxed: true,
    allowUnsandboxedCommands: false,
    network: {
      allowedDomains: DEFAULT_AGENT_NETWORK_DOMAINS,
      strictAllowlist: true,
      allowLocalBinding: true,
    },
    credentials: {
      envVars: PROTECTED_AGENT_ENV_VARS.map((name) => ({ name, mode: "deny" })),
      files: PROTECTED_CREDENTIAL_PATHS.map((path) => ({ path, mode: "deny" })),
    },
  };
}

/**
 * Run a Claude Agent SDK session that fixes one issue inside `repoDir`.
 * Returns { success, summary, costUsd, numTurns }.
 */
export async function solveIssue({
  repoDir,
  issue,
  comments,
  model,
  maxTurns = 250,
  onProgress,
  queryFn = query,
  processEnv = process.env,
}) {
  const q = queryFn({
    prompt: buildPrompt(issue, comments),
    options: {
      cwd: repoDir,
      model,
      env: buildAgentEnvironment(processEnv),
      tools: ["Read", "Edit", "Write", "Bash", "Glob", "Grep"],
      // Headless operation still needs non-interactive approval. This is safe
      // only in combination with the fail-closed sandbox directly below.
      permissionMode: "bypassPermissions",
      allowDangerouslySkipPermissions: true,
      sandbox: buildAgentSandbox(),
      maxTurns,
      // Don't load user/project settings from the machine running the agent.
      settingSources: [],
      systemPrompt: {
        type: "preset",
        preset: "claude_code",
        append:
          "You are Fixel, an autonomous issue-fixing agent. Make focused, minimal changes that resolve the issue at hand.",
      },
    },
  });

  let summary = "";
  let success = false;
  let costUsd;
  let numTurns;

  for await (const message of q) {
    if (message.type === "assistant" && onProgress) {
      for (const block of message.message?.content ?? []) {
        if (block.type === "text" && block.text.trim()) {
          onProgress(block.text.trim());
        } else if (block.type === "tool_use") {
          onProgress(`[tool] ${block.name}`);
        }
      }
    }
    if (message.type === "result") {
      success = message.subtype === "success";
      summary = message.result ?? "";
      costUsd = message.total_cost_usd;
      numTurns = message.num_turns;
    }
  }

  return { success, summary, costUsd, numTurns };
}
