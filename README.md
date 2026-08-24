<div align="center">

<img src="assets/banner.svg" alt="Fixel — label an issue, get a reviewable pull request." width="100%"/>

**Label an issue. Get a reviewable pull request.**

*Fixel is an open-source GitHub Action and CLI that turns a labeled issue into a focused code change for you to review.*

[![License: MIT](https://img.shields.io/badge/License-MIT-a855f7.svg)](LICENSE)
[![CI](https://github.com/AmIrRX0/Fixel/actions/workflows/ci.yml/badge.svg)](https://github.com/AmIrRX0/Fixel/actions/workflows/ci.yml)
[![Node.js ≥20](https://img.shields.io/badge/Node.js-%E2%89%A520-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org)
[![Powered by Claude](https://img.shields.io/badge/Powered%20by-Claude-d97757)](https://claude.com)
[![GitHub Action](https://img.shields.io/badge/GitHub-Action-2088FF?logo=githubactions&logoColor=white)](#-use-as-a-github-action)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

[English](#-english) · [فارسی](#-فارسی)

</div>

---

## 🇬🇧 English

Fixel is a human-gated GitHub issue-fixing agent. Point it at a repository and it uses [Claude](https://claude.com) through the Claude Agent SDK to propose a focused pull request for each selected issue. If you cannot push to the repository, Fixel can work through your fork. **It never auto-merges: review the diff and CI before merging.**

```mermaid
flowchart LR
    A["🏷️ Open issue"] --> B["🔍 Fixel reads it<br/>(+ comments)"]
    B --> C["🌿 Fresh branch<br/>fixel/issue-N"]
    C --> D["🤖 Claude fixes<br/>the code"]
    D --> E["✅ Commit & push"]
    E --> F["🚀 PR opened<br/>Fixes #N"]
    F --> G["🎉 Merge →<br/>issue auto-closes"]
```

### ⚡ Use as a GitHub Action

The zero-setup way. Copy [`examples/label-trigger.yml`](examples/label-trigger.yml) to `.github/workflows/fixel.yml` in your repo, add your `ANTHROPIC_API_KEY` secret, and then — **just add the `fixel` label to any issue.** A pull request shows up by itself:

```yaml
name: Fixel
on:
  issues:
    types: [labeled]

jobs:
  fix:
    if: github.event.label.name == 'fixel'
    runs-on: ubuntu-latest
    permissions:
      contents: write
      pull-requests: write
      issues: read
    steps:
      - uses: AmIrRX0/Fixel@v1.0.0
        with:
          anthropic-api-key: ${{ secrets.ANTHROPIC_API_KEY }}
          github-token: ${{ secrets.GITHUB_TOKEN }}
          issue-number: ${{ github.event.issue.number }}
```

Prefer a night shift? [`examples/nightly.yml`](examples/nightly.yml) makes Fixel fix up to 3 `bug`-labeled issues every night while you sleep. 😴

### 💻 Use as a CLI

```bash
git clone https://github.com/AmIrRX0/Fixel.git
cd Fixel
npm install

cp .env.example .env   # put your tokens in it

# Your own repo: fix the first 3 open issues and open PRs
node --env-file=.env src/cli.js --repo myuser/myapp

# Someone else's repo: fork it, fix only issue #42, stream progress
node --env-file=.env src/cli.js --repo bigorg/oss-project --fork --issue 42 --verbose

# Try it safely first: fix locally and show the diff, no push, no PR
node --env-file=.env src/cli.js --repo myuser/myapp --dry-run
```

### ✨ What it does

1. Connects to GitHub with your `GITHUB_TOKEN`
2. If you don't have push access to the repo (or you pass `--fork`), it **forks** the repo and syncs the fork with upstream
3. Lists the open issues (filterable by label or issue number)
4. For each issue: fresh branch off the latest base (`fixel/issue-N`) → Claude fixes the code inside a clone → commit → push → **PR with `Fixes #N`** (so the issue closes automatically on merge)
5. Skips issues that already have an open PR — no duplicate work

### ⚙️ CLI options

| Option | Description |
|---|---|
| `--repo <owner/name>` | Target repository (required) |
| `--fork` | Fork the repo and open PRs from the fork (automatic when you lack push access) |
| `--issue <n>` | Only this issue (repeatable: `--issue 3 --issue 7`) |
| `--max-issues <n>` | Max issues per run (default: 3) |
| `--labels <a,b>` | Only issues carrying these labels |
| `--base <branch>` | Base branch for PRs (default: the repo's default branch) |
| `--model <id>` | Claude model (e.g. `claude-opus-5`) |
| `--dry-run` | Fix locally and show the diff — no push, no PR |
| `--verbose` | Stream the agent's progress step by step |

### 📦 Requirements

- Node.js 20+ and `git`
- The [Claude Agent SDK sandbox prerequisites](https://platform.claude.com/docs/en/agent-sdk/overview) for your platform (`bubblewrap` and `socat` on Linux). The GitHub Action installs missing Linux prerequisites automatically.
- A [GitHub token](https://github.com/settings/tokens) — classic with the `repo` scope, or fine-grained with Contents (read/write) + Issues (read) + Pull requests (read/write). In fork mode, push access is only needed on **your fork**. (As an Action, `secrets.GITHUB_TOKEN` just works.)
- An Anthropic API key (`ANTHROPIC_API_KEY`) — or a logged-in `claude` CLI on the machine

### 🔒 Security notes

- The GitHub token never appears in remote URLs or visible process arguments (a transient credential helper is used instead).
- The agent works inside a throwaway clone and its shell commands run in a fail-closed filesystem/network sandbox. GitHub and other host credentials are excluded; the Anthropic key is denied to sandboxed commands.
- The agent is not allowed to commit or push by itself — Fixel performs those operations outside the agent session.
- Issue text, comments, repository code, and tests are untrusted input. Use an isolated runner and minimum-permission token, prefer `--fork` or `--dry-run` for unfamiliar repositories, and always review generated code before merging. See the full [security policy](SECURITY.md).

### 🗺️ Roadmap

- [x] CLI with fork mode, labels filter, dry-run
- [x] GitHub Action with label trigger + nightly schedule
- [ ] Comment trigger (`@fixel fix this`) on issues
- [ ] Auto-retry when CI fails on the opened PR
- [ ] Cost report comment on each PR

### 🧠 Architecture

```
action.yml      ← GitHub Action wrapper (label an issue → get a PR)
src/cli.js      ← argument parsing & input validation
src/runner.js   ← orchestration: fork/clone → pick issues → branch → agent → commit → push → PR
src/agent.js    ← one Claude Agent SDK session per issue (file & bash tools)
src/github.js   ← GitHub API via Octokit (issues, forks, PRs)
src/git.js      ← git operations with safe authentication
src/config.js   ← env loading
```

> ⭐ **If Fixel saved you a debugging night, star the repo** — it's how other developers find it.

---

## 🇮🇷 فارسی

<div dir="rtl">

Fixel یک ایجنت حل ایشوهای گیت‌هاب با کنترل انسانی است. یک ریپو به آن بده؛ ایشوهای انتخاب‌شده را می‌خواند، با <a href="https://claude.com">Claude</a> و از طریق Claude Agent SDK یک Pull Request پیشنهادی می‌سازد. اگر دسترسی push نداشته باشی، از فورک استفاده می‌کند. <b>Fixel هیچ PRی را خودکار مرج نمی‌کند؛ diff و CI را قبل از مرج بررسی کن.</b>

### ⚡ استفاده به‌عنوان GitHub Action

راحت‌ترین راه، بدون هیچ سروری: فایل <a href="examples/label-trigger.yml"><code>examples/label-trigger.yml</code></a> را در ریپوی خودت در مسیر <code>.github/workflows/fixel.yml</code> کپی کن، سیکرت <code>ANTHROPIC_API_KEY</code> را اضافه کن و بعد — <b>فقط روی هر ایشویی لیبل <code>fixel</code> بزن.</b> پول‌ریکوئست خودش ظاهر می‌شود! برای اجرای شبانه هم <a href="examples/nightly.yml"><code>examples/nightly.yml</code></a> را بردار: هر شب تا ۳ ایشوی دارای لیبل <code>bug</code> را وقتی خوابی فیکس می‌کند 😴

### 💻 استفاده به‌عنوان CLI

</div>

```bash
git clone https://github.com/AmIrRX0/Fixel.git
cd Fixel
npm install

cp .env.example .env   # توکن‌ها رو داخلش بذار

# روی ریپوی خودت: ۳ تا ایشوی باز اول رو حل کن و PR بزن
node --env-file=.env src/cli.js --repo myuser/myapp

# روی ریپوی بقیه: فورک بزن، فقط ایشوی ۴۲ رو حل کن، پیشرفت رو هم نشون بده
node --env-file=.env src/cli.js --repo bigorg/oss-project --fork --issue 42 --verbose

# اول فقط تست کن ببین چه تغییری می‌ده، بدون پوش و PR
node --env-file=.env src/cli.js --repo myuser/myapp --dry-run
```

<div dir="rtl">

### ✨ چی کار می‌کنه؟

<ol>
<li>با <code>GITHUB_TOKEN</code> به گیت‌هاب وصل می‌شه</li>
<li>اگر به ریپو دسترسی push نداشته باشی (یا <code>--fork</code> بدی) خودش <b>فورک</b> می‌زنه و فورک رو با upstream سینک می‌کنه</li>
<li>ایشوهای باز رو لیست می‌کنه (با قابلیت فیلتر با لیبل یا شماره ایشو)</li>
<li>برای هر ایشو: برنچ تازه از آخرین کد base (<code>fixel/issue-N</code>) ← فیکس توسط Claude داخل کلونِ ریپو ← کامیت ← پوش ← <b>PR با <code>Fixes #N</code></b> (تا با مرج، ایشو خودکار بسته بشه)</li>
<li>اگر برای ایشویی از قبل PR باز وجود داشته باشه، دوباره‌کاری نمی‌کنه</li>
</ol>

### ⚙️ آپشن‌های CLI

| آپشن | توضیح |
|---|---|
| <code>--repo &lt;owner/name&gt;</code> | ریپوی هدف (اجباری) |
| <code>--fork</code> | فورک بزن و PR رو از فورک باز کن (اگر دسترسی push نداشته باشی خودکار فعال می‌شه) |
| <code>--issue &lt;n&gt;</code> | فقط این ایشو (قابل تکرار: <code>--issue 3 --issue 7</code>) |
| <code>--max-issues &lt;n&gt;</code> | حداکثر تعداد ایشو در هر اجرا (پیش‌فرض: ۳) |
| <code>--labels &lt;a,b&gt;</code> | فقط ایشوهایی که این لیبل‌ها رو دارن |
| <code>--base &lt;branch&gt;</code> | برنچ مقصد PRها (پیش‌فرض: برنچ اصلی ریپو) |
| <code>--model &lt;id&gt;</code> | مدل Claude (مثلاً <code>claude-opus-5</code>) |
| <code>--dry-run</code> | فقط فیکس لوکال و نمایش diff — بدون پوش و PR |
| <code>--verbose</code> | نمایش قدم‌به‌قدم کار ایجنت |

### 📦 پیش‌نیازها

<ul>
<li>Node.js نسخه ۲۰ به بالا و <code>git</code></li>
<li>یک <a href="https://github.com/settings/tokens">GitHub token</a> — کلاسیک با اسکوپ <code>repo</code>، یا fine-grained با دسترسی Contents (خواندن/نوشتن) + Issues (خواندن) + Pull requests (خواندن/نوشتن). در حالت فورک، فقط روی فورکِ خودت دسترسی push لازمه. (در حالت Action همون <code>secrets.GITHUB_TOKEN</code> کافیه.)</li>
<li>کلید API آنتروپیک (<code>ANTHROPIC_API_KEY</code>) — یا اینکه <code>claude</code> CLI روی سیستم لاگین باشه</li>
</ul>

### 🔒 نکات امنیتی

<ul>
<li>توکن گیت‌هاب هیچ‌وقت داخل URL ریموت یا آرگومان‌های قابل‌مشاهده قرار نمی‌گیره (از credential helper موقتی استفاده می‌شه).</li>
<li>فرمان‌های ایجنت داخل sandbox فایل‌سیستم/شبکه با حالت fail-closed اجرا می‌شوند؛ توکن GitHub و credentialهای میزبان وارد محیط ایجنت نمی‌شوند.</li>
<li>ایجنت اجازه‌ی commit/push مستقیم ندارد — این کارها را Fixel بیرون از session ایجنت انجام می‌دهد.</li>
<li>متن ایشو، کامنت‌ها، کد ریپو و تست‌ها ورودی غیرقابل‌اعتماد هستند. روی runner ایزوله و با حداقل دسترسی اجرا کن، برای ریپوهای غریبه از <code>--fork</code> یا <code>--dry-run</code> استفاده کن و PR را همیشه قبل از مرج بازبینی کن. جزئیات در <a href="SECURITY.md">سیاست امنیتی</a> آمده است.</li>
</ul>

### 🗺️ نقشه راه

<ul>
<li>✅ CLI با حالت فورک، فیلتر لیبل و dry-run</li>
<li>✅ GitHub Action با تریگر لیبل + زمان‌بندی شبانه</li>
<li>⬜ تریگر با کامنت (<code>@fixel fix this</code>) روی ایشوها</li>
<li>⬜ تلاش مجدد خودکار وقتی CI روی PR قرمز می‌شه</li>
<li>⬜ کامنت گزارش هزینه روی هر PR</li>
</ul>

<blockquote>⭐ اگه Fixel یک شب دیباگ رو برات نجات داد، به ریپو استار بده — بقیه‌ی دولوپرها این‌طوری پیداش می‌کنن.</blockquote>

</div>

---

<div align="center">

🔧 *Fixel — label an issue, get a reviewable pull request.*

</div>
