import test from "node:test";
import assert from "node:assert/strict";
import { EventEmitter } from "node:events";
import { PassThrough } from "node:stream";

import { buildCodexArgs, buildCodexEnvironment, solveIssue as solveWithCodex } from "../src/codex.js";
import { solveIssue } from "../src/providers.js";

test("provider router defaults to Claude and routes Codex explicitly", async () => {
  const calls = [];
  const implementations = {
    claude: async (opts) => { calls.push(["claude", opts]); return "claude-result"; },
    codex: async (opts) => { calls.push(["codex", opts]); return "codex-result"; },
  };

  assert.equal(await solveIssue({ issue: 1 }, implementations), "claude-result");
  assert.equal(await solveIssue({ provider: "codex", issue: 2 }, implementations), "codex-result");
  assert.deepEqual(calls.map(([provider]) => provider), ["claude", "codex"]);
  assert.equal(calls[1][1].provider, undefined);
});

test("Codex arguments enforce workspace-write and contain no prompt text", () => {
  const args = buildCodexArgs({ repoDir: "/tmp/repo with spaces", model: "test-model" });
  assert.deepEqual(args, [
    "exec", "--sandbox", "workspace-write", "--approve-for-me", "--ephemeral",
    "--ignore-user-config", "--ignore-rules", "--json", "--color", "never",
    "--cd", "/tmp/repo with spaces", "--model", "test-model", "-",
  ]);
});

test("Codex environment keeps local login paths but excludes credentials", () => {
  const env = buildCodexEnvironment({
    PATH: "/usr/bin", HOME: "/home/user", CODEX_HOME: "/home/user/.codex",
    GITHUB_TOKEN: "github-secret", GH_TOKEN: "gh-secret", NPM_TOKEN: "npm-secret",
    NODE_AUTH_TOKEN: "node-secret", OPENAI_API_KEY: "api-secret", RANDOM_SECRET: "secret",
  });
  assert.deepEqual(env, {
    PATH: "/usr/bin", HOME: "/home/user", CODEX_HOME: "/home/user/.codex",
  });
});

test("Codex runner sends untrusted issue text over stdin and parses its summary", async () => {
  let invocation;
  let prompt = "";
  const spawnFn = (command, args, options) => {
    invocation = { command, args, options };
    const child = new EventEmitter();
    child.stdin = new PassThrough();
    child.stdout = new PassThrough();
    child.stderr = new PassThrough();
    child.stdin.on("data", (chunk) => { prompt += chunk; });
    child.stdin.on("finish", () => {
      child.stdout.end(`${JSON.stringify({ type: "item.completed", item: { type: "agent_message", text: "Fixed and tested." } })}\n`);
      queueMicrotask(() => child.emit("close", 0, null));
    });
    return child;
  };

  const result = await solveWithCodex({
    repoDir: "/tmp/repo",
    issue: { number: 10, title: "Untrusted", body: "$(printenv)" },
    comments: [],
    processEnv: { PATH: "/usr/bin", GITHUB_TOKEN: "secret" },
    spawnFn,
  });

  assert.equal(invocation.command, "codex");
  assert.equal(invocation.options.env.GITHUB_TOKEN, undefined);
  assert.equal(invocation.args.includes("$(printenv)"), false);
  assert.match(prompt, /\$\(printenv\)/);
  assert.match(prompt, /untrusted input/);
  assert.equal(result.summary, "Fixed and tested.");
});
