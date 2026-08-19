<div align="center">

# 🔧 Fixel

**Every issue, fixed.**

*Point it at a GitHub repo — it reads the open issues, fixes them with Claude, and opens a pull request for each one.*

[English](#-english) · [فارسی](#-فارسی)

</div>

---

## 🇬🇧 English

Fixel is an autonomous GitHub issue-fixing agent. Point it at a repository, it reads the open issues, fixes them with [Claude](https://claude.com) via the Claude Agent SDK, and opens a pull request per issue. If you can't push to the repo, it forks it first and opens PRs from your fork.

### ✨ What it does

1. Connects to GitHub with your `GITHUB_TOKEN`
2. If you don't have push access to the repo (or you pass `--fork`), it **forks** the repo and syncs the fork with upstream
3. Lists the open issues (filterable by label or issue number)
4. For each issue:
   - Creates a fresh branch off the latest base code (`fixel/issue-N`)
   - Feeds the issue text + its comments to Claude, which fixes the code inside a clone of the repo
   - If anything changed: commit → push → **open a PR** with `Fixes #N` (so the issue closes automatically on merge)
5. Skips issues that already have an open PR — no duplicate work

### 📦 Requirements

- Node.js 18+ and `git`
- A [GitHub token](https://github.com/settings/tokens) — classic with the `repo` scope, or fine-grained with Contents (read/write) + Issues (read) + Pull requests (read/write). In fork mode, push access is only needed on **your fork**.
- An Anthropic API key (`ANTHROPIC_API_KEY`) — or a logged-in `claude` CLI on the machine

### 🚀 Install & run

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

### ⚙️ Options

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

### 🔒 Security notes

- The GitHub token never appears in remote URLs or visible process arguments (a transient credential helper is used instead).
- The agent works inside a throwaway, isolated clone and is not allowed to commit or push by itself — Fixel performs commit and push in a controlled way outside the agent session.
- Issue text is untrusted external input; the prompt tells the agent to ignore any instructions outside the scope of the fix (leaking secrets, changing settings, …). Still, for unfamiliar repos prefer a minimal token plus `--fork` mode, and review PRs before merging.
- For periodic runs (e.g. nightly), wrap the same command in cron or GitHub Actions.

### 🧠 Architecture

```
src/cli.js      ← argument parsing & input validation
src/runner.js   ← orchestration: fork/clone → pick issues → branch → agent → commit → push → PR
src/agent.js    ← one Claude Agent SDK session per issue (file & bash tools)
src/github.js   ← GitHub API via Octokit (issues, forks, PRs)
src/git.js      ← git operations with safe authentication
src/config.js   ← env loading
```

---

## 🇮🇷 فارسی

<div dir="rtl">

Fixel یک ایجنت خودکار حل ایشوهای گیت‌هاب است. یک ریپو بهش بده؛ ایشوهای باز را می‌خواند، با <a href="https://claude.com">Claude</a> و از طریق Claude Agent SDK کد را فیکس می‌کند و برای هر ایشو یک Pull Request باز می‌کند. اگر به ریپو دسترسی push نداشته باشی، اول فورک می‌زند و PRها را از فورک باز می‌کند.

### ✨ چی کار می‌کنه؟

<ol>
<li>با <code>GITHUB_TOKEN</code> به گیت‌هاب وصل می‌شه</li>
<li>اگر به ریپو دسترسی push نداشته باشی (یا <code>--fork</code> بدی) خودش <b>فورک</b> می‌زنه و فورک رو با upstream سینک می‌کنه</li>
<li>ایشوهای باز رو لیست می‌کنه (با قابلیت فیلتر با لیبل یا شماره ایشو)</li>
<li>برای هر ایشو:
<ul>
<li>یک برنچ تازه از آخرین کد base می‌سازه (<code>fixel/issue-N</code>)</li>
<li>متن ایشو + کامنت‌هاش رو به Claude می‌ده و Claude داخل کلونِ ریپو کد رو فیکس می‌کنه</li>
<li>اگر تغییری ایجاد شده باشه: کامیت ← پوش ← <b>باز کردن PR</b> با <code>Fixes #N</code> (تا با مرج شدن PR، ایشو خودکار بسته بشه)</li>
</ul>
</li>
<li>اگر برای ایشویی از قبل PR باز وجود داشته باشه، دوباره‌کاری نمی‌کنه</li>
</ol>

### 📦 پیش‌نیازها

<ul>
<li>Node.js نسخه ۱۸ به بالا و <code>git</code></li>
<li>یک <a href="https://github.com/settings/tokens">GitHub token</a> — کلاسیک با اسکوپ <code>repo</code>، یا fine-grained با دسترسی Contents (خواندن/نوشتن) + Issues (خواندن) + Pull requests (خواندن/نوشتن). در حالت فورک، فقط روی فورکِ خودت دسترسی push لازمه.</li>
<li>کلید API آنتروپیک (<code>ANTHROPIC_API_KEY</code>) — یا اینکه <code>claude</code> CLI روی سیستم لاگین باشه</li>
</ul>

### 🚀 نصب و اجرا

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

### ⚙️ آپشن‌ها

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

### 🔒 نکات امنیتی

<ul>
<li>توکن گیت‌هاب هیچ‌وقت داخل URL ریموت یا آرگومان‌های قابل‌مشاهده قرار نمی‌گیره (از credential helper موقتی استفاده می‌شه).</li>
<li>ایجنت داخل یک کلونِ موقتی و ایزوله کار می‌کنه و اجازه‌ی commit/push مستقیم نداره — کامیت و پوش رو خود Fixel به‌صورت کنترل‌شده انجام می‌ده.</li>
<li>متن ایشوها ورودیِ خارجی و غیرقابل‌اعتماده؛ در پرامپت به ایجنت گفته شده دستورهای خارج از محدوده‌ی فیکس (لو دادن secret، تغییر تنظیمات و…) رو نادیده بگیره. با این حال بهتره برای ریپوهای غریبه از یک توکن حداقلی و حالت <code>--fork</code> استفاده کنی و PRها رو قبل از مرج خودت بازبینی کنی.</li>
<li>برای اجرای دوره‌ای (مثلاً هر شب) می‌تونی همین دستور رو داخل cron یا GitHub Actions بذاری.</li>
</ul>

### 🧠 معماری

</div>

```
src/cli.js      ← پارس آرگومان‌ها و ورودی‌ها
src/runner.js   ← ارکستراسیون: فورک/کلون → انتخاب ایشو → برنچ → ایجنت → کامیت → پوش → PR
src/agent.js    ← اجرای Claude Agent SDK روی هر ایشو (query با ابزارهای فایل و bash)
src/github.js   ← کارهای API گیت‌هاب با Octokit (ایشوها، فورک، PR)
src/git.js      ← عملیات git با احراز هویت امن
src/config.js   ← خواندن env
```

---

<div align="center">

🔧 *Fixel — every issue, fixed.*

</div>
