import { spawn } from "node:child_process";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import path from "node:path";
import { buildPrompt } from "./prompt.js";

const CODEX_ENV_ALLOWLIST = new Set([
  "PATH",
  "HOME",
  "CODEX_HOME",
  "USER",
  "LOGNAME",
  "SHELL",
  "TMPDIR",
  "TMP",
  "TEMP",
  "LANG",
  "LC_ALL",
  "CI",
  "NO_COLOR",
]);

export function buildCodexEnvironment(source = process.env, tempDir) {
  const env = {};
  for (const name of CODEX_ENV_ALLOWLIST) {
    if (typeof source[name] === "string") env[name] = source[name];
  }
  env.NO_COLOR = "1";
  if (tempDir) {
    env.TMPDIR = tempDir;
    env.TMP = tempDir;
    env.TEMP = tempDir;
    env.XDG_CACHE_HOME = path.join(tempDir, "cache");
    env.npm_config_cache = path.join(tempDir, "npm-cache");
    env.PIP_CACHE_DIR = path.join(tempDir, "pip-cache");
  }
  return env;
}

const CODEX_ALLOWED_NETWORK_DOMAINS = [
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

function tomlKey(value) {
  return JSON.stringify(value);
}

export function buildCodexProtectedPaths(source = process.env) {
  const home = source.HOME;
  const codexHome = source.CODEX_HOME || (home ? path.join(home, ".codex") : undefined);
  return [
    codexHome,
    home && path.join(home, ".ssh"),
    home && path.join(home, ".aws"),
    home && path.join(home, ".config", "gcloud"),
    home && path.join(home, ".docker"),
    home && path.join(home, ".git-credentials"),
    home && path.join(home, ".netrc"),
    home && path.join(home, ".npmrc"),
  ].filter(Boolean);
}

export function buildCodexArgs({ repoDir, model, outputPath, protectedPaths = [] }) {
  const filesystem = [
    `${tomlKey(":root") }="read"`,
    `${tomlKey(":workspace_roots") }="write"`,
    ...protectedPaths.map((protectedPath) => `${tomlKey(protectedPath)}="none"`),
  ].join(",");
  const domains = CODEX_ALLOWED_NETWORK_DOMAINS
    .map((domain) => `${tomlKey(domain)}="allow"`)
    .join(",");
  const permissionProfile = `{workspace_roots={${tomlKey(repoDir)}=true},filesystem={${filesystem}},network={enabled=true,domains={${domains}}}}`;
  const args = [
    "exec",
    "--cd",
    repoDir,
    "--config", 'approval_policy="never"',
    "--config", 'default_permissions="fixel"',
    "--config", `permissions.fixel=${permissionProfile}`,
    "--ephemeral",
    "--ignore-user-config",
    "--ignore-rules",
    "--color",
    "never",
    "--output-last-message",
    outputPath,
  ];
  if (model) args.push("--model", model);
  // Read the untrusted issue prompt from stdin. It must never become a shell
  // command or a process-list-visible argument.
  args.push("-");
  return args;
}

function boundedAppend(current, chunk, limit = 32_000) {
  const next = current + chunk;
  return next.length > limit ? next.slice(-limit) : next;
}

function progressWriter(onProgress) {
  let pending = "";
  return (chunk) => {
    if (!onProgress) return;
    pending += chunk;
    const lines = pending.split(/\r?\n/);
    pending = lines.pop() ?? "";
    for (const line of lines) {
      if (line.trim()) onProgress(line.trim());
    }
  };
}

export async function runCodex({
  repoDir,
  prompt,
  model,
  onProgress,
  processEnv = process.env,
  spawnFn = spawn,
}) {
  // Keep command scratch space inside the already-authorized repository root,
  // then remove it before Fixel calculates the diff.
  const tempDir = await mkdtemp(path.join(repoDir, ".fixel-tmp-"));
  const outputPath = path.join(tempDir, "last-message.txt");

  try {
    const args = buildCodexArgs({
      repoDir,
      model,
      outputPath,
      protectedPaths: buildCodexProtectedPaths(processEnv),
    });
    const env = buildCodexEnvironment(processEnv, tempDir);
    const result = await new Promise((resolve, reject) => {
      const child = spawnFn("codex", args, {
        cwd: repoDir,
        env,
        stdio: ["pipe", "pipe", "pipe"],
        shell: false,
      });
      let stdout = "";
      let stderr = "";
      const report = progressWriter(onProgress);

      child.once("error", (err) => {
        if (err.code === "ENOENT") {
          reject(new Error("Codex CLI was not found. Install it, then run `codex login`."));
          return;
        }
        reject(err);
      });
      child.stdout.on("data", (chunk) => {
        const text = chunk.toString();
        stdout = boundedAppend(stdout, text);
        report(text);
      });
      child.stderr.on("data", (chunk) => {
        const text = chunk.toString();
        stderr = boundedAppend(stderr, text);
        report(text);
      });
      child.once("close", (code, signal) => resolve({ code, signal, stdout, stderr }));
      child.stdin.end(prompt);
    });

    if (result.code !== 0) {
      const detail = (result.stderr || result.stdout).trim().slice(-4_000);
      throw new Error(
        `Codex exited with ${result.signal ? `signal ${result.signal}` : `code ${result.code}`}` +
          `${detail ? `: ${detail}` : ". Run `codex login status` to check authentication."}`,
      );
    }

    const summary = (await readFile(outputPath, "utf8")).trim();
    return summary || "Codex completed the requested changes.";
  } finally {
    await rm(tempDir, { recursive: true, force: true });
  }
}

/** Run a locally authenticated Codex CLI session for one issue. */
export async function solveIssueWithCodex({
  repoDir,
  issue,
  comments,
  model,
  onProgress,
  processEnv = process.env,
  runCodexFn = runCodex,
}) {
  const summary = await runCodexFn({
    repoDir,
    prompt: buildPrompt(issue, comments),
    model,
    onProgress,
    processEnv,
  });
  return { success: true, summary };
}
