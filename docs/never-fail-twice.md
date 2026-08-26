# Never Fail Twice

Fixel can preserve a reviewed failure as a version-controlled repository lesson without allowing an agent to approve its own instructions.

## Workflow

1. Capture evidence from an existing pull request:

   ```bash
   export GITHUB_TOKEN="your-read-capable-token"
   fixel learn --repo owner/repository --pr 42
   ```

2. Open `.fixel/lessons/pr-42.md`. It starts with `status: draft` and is ignored by every Fixel fix run.
3. Replace the Rule, Regression command, and Scope placeholders. Remove irrelevant or sensitive evidence.
4. Verify the regression command, then change the frontmatter to `status: approved` in a human-reviewed commit.
5. Future Fixel runs load the approved lesson and ask the selected provider to apply it when relevant and run its regression command.

Use `--output <path>` when the command is not run from the target repository root. Fixel refuses to overwrite an existing draft.

## Lesson format

```markdown
---
fixel_lesson: 1
status: approved
source_pr: 42
source_url: https://github.com/owner/repository/pull/42
---

# Short lesson title

## Rule

One specific repository rule.

## Regression command

`npm test -- test/relevant.test.js`

## Scope

The files or changes to which the rule applies.
```

## Safety model

- PR descriptions, comments, reviews, and check output are untrusted input.
- Capture creates a draft; drafts never enter an agent prompt.
- Only a version-controlled file with `fixel_lesson: 1` and `status: approved` is loaded.
- Lessons cannot override Fixel's credential, sandbox, network, git, or human-review rules.
- The loader accepts only regular Markdown files, at most 32 files, 16 KiB per file, and 64 KiB total.
- Fixel does not commit, push, merge, or approve a lesson on behalf of the maintainer.

## What “self-improving” means here

The repository improves its future agent context through reviewed evidence and regression commands. Fixel does not rewrite its own safety policy, expand its permissions, or promote its own lessons. This is measured learning with a human gate, not unrestricted recursive self-modification.

## Evidence and benchmark

The first approved lesson, [`.fixel/lessons/pr-11.md`](../.fixel/lessons/pr-11.md), comes from a real Fixel PR whose first implementation passed unit tests but failed an adversarial credential probe. The corrected PR blocked the credential read while preserving workspace writes.

Run the deterministic gate benchmark:

```bash
npm run benchmark:lessons
```

The current benchmark verifies capture/promotion mechanics, approved-only loading, expected lesson content, and the immutable prompt safety boundary. It does **not** claim that a model will solve an issue correctly. Agent-level baseline-versus-learned issue replays will be reported separately only after reproducible runs exist.
