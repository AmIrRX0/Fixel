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
