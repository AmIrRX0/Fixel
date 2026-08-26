import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { version } = require("../package.json");

for (const flag of ["--version", "-V"]) {
  test(`${flag} prints the package version without credentials or a repository`, () => {
    const env = { ...process.env };
    delete env.GITHUB_TOKEN;
    delete env.ANTHROPIC_API_KEY;

    const result = spawnSync(process.execPath, ["src/cli.js", flag], {
      cwd: new URL("..", import.meta.url),
      encoding: "utf8",
      env,
    });

    assert.equal(result.status, 0);
    assert.equal(result.stdout, `${version}\n`);
    assert.equal(result.stderr, "");
  });
}

test("an unknown provider fails before credentials are loaded", () => {
  const env = { ...process.env };
  delete env.GITHUB_TOKEN;

  const result = spawnSync(
    process.execPath,
    ["src/cli.js", "--repo", "owner/repo", "--provider", "unknown"],
    {
      cwd: new URL("..", import.meta.url),
      encoding: "utf8",
      env,
    },
  );

  assert.equal(result.status, 2);
  assert.match(result.stderr, /--provider must be either `claude` or `codex`/);
  assert.doesNotMatch(result.stderr, /GITHUB_TOKEN is not set/);
});

test("learn requires a positive pull request number before credentials are loaded", () => {
  const env = { ...process.env };
  delete env.GITHUB_TOKEN;

  const result = spawnSync(
    process.execPath,
    ["src/cli.js", "learn", "--repo", "owner/repo"],
    {
      cwd: new URL("..", import.meta.url),
      encoding: "utf8",
      env,
    },
  );

  assert.equal(result.status, 2);
  assert.match(result.stderr, /requires --pr with a positive pull request number/);
  assert.doesNotMatch(result.stderr, /GITHUB_TOKEN is not set/);
});

test("--pr is rejected outside the learn command", () => {
  const result = spawnSync(
    process.execPath,
    ["src/cli.js", "--repo", "owner/repo", "--pr", "11"],
    {
      cwd: new URL("..", import.meta.url),
      encoding: "utf8",
      env: { ...process.env },
    },
  );

  assert.equal(result.status, 2);
  assert.match(result.stderr, /--pr is available only with `fixel learn`/);
});
