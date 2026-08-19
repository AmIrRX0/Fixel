import os from "node:os";
import path from "node:path";

export function loadConfig() {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    throw new Error(
      "GITHUB_TOKEN is not set. Create a token at https://github.com/settings/tokens " +
        "and export it (or put it in a .env file and run with `node --env-file=.env`).",
    );
  }

  return {
    token,
    model: process.env.AGENT_MODEL || undefined,
    workdir:
      process.env.AGENT_WORKDIR || path.join(os.tmpdir(), "issue-agent"),
  };
}
