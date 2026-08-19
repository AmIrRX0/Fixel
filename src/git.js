import { execFile } from "node:child_process";
import { promisify } from "node:util";
import fs from "node:fs";
import path from "node:path";

const execFileAsync = promisify(execFile);

/**
 * Run a git command. The token is injected through a one-off credential
 * helper (never embedded in the remote URL, so it can't leak via
 * `git remote -v` or error messages).
 */
async function git(args, { cwd, token } = {}) {
  const fullArgs = [];
  if (token) {
    fullArgs.push(
      "-c",
      `credential.helper=!f() { echo username=x-access-token; echo "password=$GIT_AGENT_TOKEN"; }; f`,
    );
  }
  fullArgs.push(...args);
  const { stdout } = await execFileAsync("git", fullArgs, {
    cwd,
    maxBuffer: 32 * 1024 * 1024,
    env: {
      ...process.env,
      GIT_TERMINAL_PROMPT: "0",
      ...(token ? { GIT_AGENT_TOKEN: token } : {}),
    },
  });
  return stdout.trim();
}

export class GitRepo {
  constructor(dir, token) {
    this.dir = dir;
    this.token = token;
  }

  /**
   * Clone `cloneRepo` (the repo we push to — origin or the fork) into `dir`.
   * When `upstream` differs, it is added as a second remote so branches can
   * start from the upstream default branch even if the fork is stale.
   */
  static async clone({ dir, cloneRepo, upstream, token }) {
    fs.rmSync(dir, { recursive: true, force: true });
    fs.mkdirSync(path.dirname(dir), { recursive: true });
    const url = `https://github.com/${cloneRepo}.git`;
    await git(["clone", url, dir], { token });
    const repo = new GitRepo(dir, token);
    await repo.run(["config", "user.name", "fixel"]);
    await repo.run(["config", "user.email", "fixel-agent@users.noreply.github.com"]);
    if (upstream && upstream !== cloneRepo) {
      await repo.run(["remote", "add", "upstream", `https://github.com/${upstream}.git`]);
      await repo.run(["fetch", "upstream"], { auth: true });
    }
    return repo;
  }

  run(args, { auth = false } = {}) {
    return git(args, { cwd: this.dir, token: auth ? this.token : undefined });
  }

  /** Create a fresh branch off the given start point (discarding any local copy). */
  async checkoutNewBranch(branch, startPoint) {
    await this.run(["checkout", "-B", branch, startPoint]);
  }

  async hasChanges() {
    const status = await this.run(["status", "--porcelain"]);
    return status.length > 0;
  }

  async diffStat() {
    await this.run(["add", "-A"]);
    return this.run(["diff", "--cached", "--stat"]);
  }

  async commitAll(message) {
    await this.run(["add", "-A"]);
    await this.run(["commit", "-m", message]);
  }

  async push(branch) {
    const backoffs = [2000, 4000, 8000, 16000];
    for (let attempt = 0; ; attempt++) {
      try {
        await this.run(["push", "-u", "origin", branch, "--force-with-lease"], {
          auth: true,
        });
        return;
      } catch (err) {
        if (attempt >= backoffs.length) throw err;
        await new Promise((r) => setTimeout(r, backoffs[attempt]));
      }
    }
  }
}
