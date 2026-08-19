<div align="center">

# 🔧 Fixel

**Every issue, fixed.**

*یک ریپو بهش بده؛ ایشوهای باز رو می‌خونه، با Claude فیکس می‌کنه و برای هر کدوم Pull Request می‌زنه.*

</div>

---

Fixel is an autonomous GitHub issue-fixing agent. Point it at a repository, it reads the open issues, fixes them with [Claude](https://claude.com) via the Claude Agent SDK, and opens a pull request per issue. If you can't push to the repo, it forks it first and opens PRs from your fork.

## ✨ چی کار می‌کنه؟

1. با `GITHUB_TOKEN` به گیت‌هاب وصل می‌شه
2. اگر به ریپو دسترسی push نداشته باشی (یا `--fork` بدی) خودش **فورک** می‌زنه و فورک رو با upstream سینک می‌کنه
3. ایشوهای باز رو لیست می‌کنه (با قابلیت فیلتر با لیبل یا شماره ایشو)
4. برای هر ایشو:
   - یک برنچ تازه از آخرین کد base می‌سازه (`fixel/issue-N`)
   - متن ایشو + کامنت‌هاش رو به Claude می‌ده و Claude داخل کلونِ ریپو کد رو فیکس می‌کنه
   - اگر تغییری ایجاد شده باشه: کامیت → پوش → **باز کردن PR** با `Fixes #N` (تا با مرج شدن PR، ایشو خودکار بسته بشه)
5. اگر برای ایشویی از قبل PR باز وجود داشته باشه، دوباره‌کاری نمی‌کنه

## 📦 پیش‌نیازها

- Node.js نسخه ۱۸ به بالا و `git`
- یک [GitHub token](https://github.com/settings/tokens) — کلاسیک با اسکوپ `repo`، یا fine-grained با دسترسی Contents (خواندن/نوشتن) + Issues (خواندن) + Pull requests (خواندن/نوشتن). در حالت فورک، فقط روی فورکِ خودت دسترسی push لازمه.
- کلید API آنتروپیک (`ANTHROPIC_API_KEY`) — یا اینکه `claude` CLI روی سیستم لاگین باشه

## 🚀 نصب و اجرا

```bash
git clone https://github.com/AmIrRX0/fixel.git
cd fixel
npm install

cp .env.example .env   # توکن‌ها رو داخلش بذار

# روی ریپوی خودت: ۳ تا ایشوی باز اول رو حل کن و PR بزن
node --env-file=.env src/cli.js --repo myuser/myapp

# روی ریپوی بقیه: فورک بزن، فقط ایشوی ۴۲ رو حل کن، پیشرفت رو هم نشون بده
node --env-file=.env src/cli.js --repo bigorg/oss-project --fork --issue 42 --verbose

# اول فقط تست کن ببین چه تغییری می‌ده، بدون پوش و PR
node --env-file=.env src/cli.js --repo myuser/myapp --dry-run
```

## ⚙️ آپشن‌ها

| آپشن | توضیح |
|---|---|
| `--repo <owner/name>` | ریپوی هدف (اجباری) |
| `--fork` | فورک بزن و PR رو از فورک باز کن (اگر دسترسی push نداشته باشی خودکار فعال می‌شه) |
| `--issue <n>` | فقط این ایشو (قابل تکرار: `--issue 3 --issue 7`) |
| `--max-issues <n>` | حداکثر تعداد ایشو در هر اجرا (پیش‌فرض: ۳) |
| `--labels <a,b>` | فقط ایشوهایی که این لیبل‌ها رو دارن |
| `--base <branch>` | برنچ مقصد PRها (پیش‌فرض: برنچ اصلی ریپو) |
| `--model <id>` | مدل Claude (مثلاً `claude-opus-5`) |
| `--dry-run` | فقط فیکس لوکال و نمایش diff — بدون پوش و PR |
| `--verbose` | نمایش قدم‌به‌قدم کار ایجنت |

## 🔒 نکات امنیتی

- توکن گیت‌هاب هیچ‌وقت داخل URL ریموت یا آرگومان‌های قابل‌مشاهده قرار نمی‌گیره (از credential helper موقتی استفاده می‌شه).
- ایجنت داخل یک کلونِ موقتی و ایزوله کار می‌کنه و اجازه‌ی commit/push مستقیم نداره — کامیت و پوش رو خود Fixel به‌صورت کنترل‌شده انجام می‌ده.
- متن ایشوها ورودیِ خارجی و غیرقابل‌اعتماده؛ در پرامپت به ایجنت گفته شده دستورهای خارج از محدوده‌ی فیکس (لو دادن secret، تغییر تنظیمات و…) رو نادیده بگیره. با این حال بهتره برای ریپوهای غریبه از یک توکن حداقلی و حالت `--fork` استفاده کنی و PRها رو قبل از مرج خودت بازبینی کنی.
- برای اجرای دوره‌ای (مثلاً هر شب) می‌تونی همین دستور رو داخل cron یا GitHub Actions بذاری.

## 🧠 معماری

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
