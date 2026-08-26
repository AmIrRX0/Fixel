import path from "node:path";
import { readFile, readdir } from "node:fs/promises";

export const LESSONS_DIRECTORY = path.join(".fixel", "lessons");
export const MAX_LESSON_FILES = 32;
export const MAX_LESSON_BYTES = 16 * 1024;
export const MAX_TOTAL_LESSON_BYTES = 64 * 1024;

function parseFrontmatter(text) {
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return null;

  const metadata = {};
  for (const line of match[1].split(/\r?\n/)) {
    const separator = line.indexOf(":");
    if (separator === -1) continue;
    const key = line.slice(0, separator).trim();
    const value = line.slice(separator + 1).trim().replace(/^['"]|['"]$/g, "");
    if (key) metadata[key] = value;
  }
  return { metadata, body: match[2].trim() };
}

export function parseApprovedLesson(text, filename = "lesson.md") {
  const parsed = parseFrontmatter(text);
  if (!parsed) return null;
  if (parsed.metadata.fixel_lesson !== "1") return null;
  if (parsed.metadata.status !== "approved") return null;
  if (!parsed.body) return null;

  return {
    filename,
    sourcePr: /^\d+$/.test(parsed.metadata.source_pr ?? "") ? parsed.metadata.source_pr : undefined,
    body: parsed.body,
  };
}

/**
 * Load only explicitly approved, regular Markdown files from the target repo.
 * Drafts, symlinks, oversized files, and malformed lessons are ignored.
 */
export async function loadApprovedLessons(repoDir) {
  const lessonsDir = path.join(repoDir, LESSONS_DIRECTORY);
  let entries;
  try {
    entries = await readdir(lessonsDir, { withFileTypes: true });
  } catch (err) {
    if (err.code === "ENOENT") return { lessons: [], warnings: [] };
    throw err;
  }

  const warnings = [];
  const lessons = [];
  let totalBytes = 0;
  const candidates = entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
    .sort((a, b) => a.name.localeCompare(b.name));

  if (candidates.length > MAX_LESSON_FILES) {
    warnings.push(`Found ${candidates.length} lesson files; only the first ${MAX_LESSON_FILES} are considered.`);
  }

  for (const entry of candidates.slice(0, MAX_LESSON_FILES)) {
    const fullPath = path.join(lessonsDir, entry.name);
    const text = await readFile(fullPath, "utf8");
    const bytes = Buffer.byteLength(text, "utf8");
    if (bytes > MAX_LESSON_BYTES) {
      warnings.push(`${entry.name} exceeds ${MAX_LESSON_BYTES} bytes and was ignored.`);
      continue;
    }
    if (totalBytes + bytes > MAX_TOTAL_LESSON_BYTES) {
      warnings.push(`${entry.name} would exceed the total lesson budget and was ignored.`);
      continue;
    }

    const lesson = parseApprovedLesson(text, entry.name);
    if (!lesson) continue;
    lessons.push(lesson);
    totalBytes += bytes;
  }

  return { lessons, warnings };
}

export function formatLessonsForPrompt(lessons = []) {
  if (lessons.length === 0) return "";
  return lessons
    .map((lesson) => [
      `### ${lesson.filename}${lesson.sourcePr ? ` (source PR #${lesson.sourcePr})` : ""}`,
      lesson.body,
    ].join("\n"))
    .join("\n\n");
}
