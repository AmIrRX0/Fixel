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

test("help documents both providers", () => {
  const result = spawnSync(process.execPath, ["src/cli.js", "--help"], {
    cwd: new URL("..", import.meta.url), encoding: "utf8",
  });
  assert.equal(result.status, 0);
  assert.match(result.stdout, /--provider <name>/);
  assert.match(result.stdout, /claude or codex/);
});

test("an unknown provider is rejected before credentials are loaded", () => {
  const env = { ...process.env };
  delete env.GITHUB_TOKEN;
  const result = spawnSync(process.execPath, ["src/cli.js", "--repo", "owner/repo", "--provider", "other"], {
    cwd: new URL("..", import.meta.url), encoding: "utf8", env,
  });
  assert.equal(result.status, 2);
  assert.match(result.stderr, /--provider expects claude or codex/);
  assert.doesNotMatch(result.stderr, /GITHUB_TOKEN is not set/);
});
