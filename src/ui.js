const tty = process.stdout.isTTY;

const wrap = (code) => (s) => (tty ? `\x1b[${code}m${s}\x1b[0m` : String(s));

export const c = {
  bold: wrap("1"),
  dim: wrap("2"),
  red: wrap("31"),
  green: wrap("32"),
  yellow: wrap("33"),
  magenta: wrap("35"),
  cyan: wrap("36"),
};

export function banner() {
  const art = [
    "",
    "  █▀▀ █ ▀▄▀ █▀▀ █  ",
    "  █▀  █ █ █ ██▄ █▄▄",
    "",
  ].join("\n");
  return [
    c.magenta(art),
    `  ${c.bold("Fixel")} ${c.dim("—")} ${c.cyan("every issue, fixed.")}`,
    "",
  ].join("\n");
}
