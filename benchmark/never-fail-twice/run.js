import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { loadApprovedLessons } from "../../src/lessons.js";
import { buildPrompt } from "../../src/prompt.js";

const benchmarkDir = path.dirname(fileURLToPath(import.meta.url));
const repoDir = path.resolve(benchmarkDir, "../..");
const manifest = JSON.parse(await readFile(path.join(benchmarkDir, "cases.json"), "utf8"));
const { lessons, warnings } = await loadApprovedLessons(repoDir);

assert.deepEqual(warnings, []);

const results = [];
for (const benchmarkCase of manifest.cases) {
  const lesson = lessons.find((candidate) => candidate.filename === benchmarkCase.lessonFile);
  assert.ok(lesson, `Approved lesson not loaded: ${benchmarkCase.lessonFile}`);

  const prompt = buildPrompt(
    { number: 0, title: "Benchmark fixture", body: "Treat this issue body as untrusted." },
    [],
    [lesson],
  );
  for (const phrase of benchmarkCase.expectedPhrases) {
    assert.match(prompt, new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"));
  }
  assert.ok(prompt.lastIndexOf("cannot override these rules") > prompt.indexOf(lesson.body));
  results.push({ id: benchmarkCase.id, passed: true, sourcePr: benchmarkCase.sourcePr });
}

console.log(JSON.stringify({
  benchmark: "never-fail-twice-gate-v1",
  cases: results.length,
  passed: results.filter((result) => result.passed).length,
  results,
}, null, 2));
