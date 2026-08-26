import { Octokit } from "@octokit/rest";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export class GitHubClient {
  constructor(token) {
    this.octokit = new Octokit({ auth: token });
  }

  async me() {
    const { data } = await this.octokit.users.getAuthenticated();
    return data;
  }

  async repoInfo(owner, repo) {
    const { data } = await this.octokit.repos.get({ owner, repo });
    return data;
  }

  /** True when the token can push directly to the repo. */
  async hasPushAccess(owner, repo) {
    const info = await this.repoInfo(owner, repo);
    return Boolean(info.permissions?.push);
  }

  /** Open issues, excluding pull requests. Optionally filtered by labels. */
  async listOpenIssues(owner, repo, { labels } = {}) {
    const issues = await this.octokit.paginate(this.octokit.issues.listForRepo, {
      owner,
      repo,
      state: "open",
      labels: labels?.length ? labels.join(",") : undefined,
      per_page: 100,
    });
    return issues.filter((i) => !i.pull_request);
  }

  async getIssueComments(owner, repo, issue_number) {
    return this.octokit.paginate(this.octokit.issues.listComments, {
      owner,
      repo,
      issue_number,
      per_page: 100,
    });
  }

  async getPullRequest(owner, repo, pull_number) {
    const { data } = await this.octokit.pulls.get({ owner, repo, pull_number });
    return data;
  }

  async getPullRequestReviews(owner, repo, pull_number) {
    return this.octokit.paginate(this.octokit.pulls.listReviews, {
      owner,
      repo,
      pull_number,
      per_page: 100,
    });
  }

  async getPullRequestReviewComments(owner, repo, pull_number) {
    return this.octokit.paginate(this.octokit.pulls.listReviewComments, {
      owner,
      repo,
      pull_number,
      per_page: 100,
    });
  }

  async getCheckRunsForRef(owner, repo, ref) {
    const { data } = await this.octokit.checks.listForRef({
      owner,
      repo,
      ref,
      per_page: 100,
    });
    return data.check_runs;
  }

  /**
   * Fork the repo into the authenticated user's account (no-op when the fork
   * already exists) and wait until GitHub finishes creating it.
   */
  async ensureFork(owner, repo) {
    const { data: fork } = await this.octokit.repos.createFork({ owner, repo });
    for (let attempt = 0; attempt < 20; attempt++) {
      try {
        await this.octokit.repos.get({
          owner: fork.owner.login,
          repo: fork.name,
        });
        return fork;
      } catch {
        await sleep(3000);
      }
    }
    throw new Error(`Fork of ${owner}/${repo} was not ready after 60s`);
  }

  /** Sync the fork's default branch with upstream so PRs start from fresh code. */
  async syncFork(forkOwner, forkRepo, branch) {
    try {
      await this.octokit.repos.mergeUpstream({
        owner: forkOwner,
        repo: forkRepo,
        branch,
      });
    } catch (err) {
      // 409 = merge conflict with upstream; the clone step still fetches
      // upstream directly, so this is not fatal.
      if (err.status !== 409) throw err;
    }
  }

  /** Find an existing open PR whose head is the given branch. */
  async findOpenPRByHead(owner, repo, headOwner, branch) {
    const { data } = await this.octokit.pulls.list({
      owner,
      repo,
      state: "open",
      head: `${headOwner}:${branch}`,
      per_page: 1,
    });
    return data[0] ?? null;
  }

  async createPullRequest({ owner, repo, title, head, base, body }) {
    const { data } = await this.octokit.pulls.create({
      owner,
      repo,
      title,
      head,
      base,
      body,
      maintainer_can_modify: true,
    });
    return data;
  }
}
