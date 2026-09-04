import assert from "node:assert/strict";
import { gzipSync } from "node:zlib";
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../.next/static/chunks/", import.meta.url));
const budgetBytes = 260 * 1024;

async function collect(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await collect(path)));
    if (entry.isFile() && entry.name.endsWith(".js")) files.push(path);
  }
  return files;
}

const files = await collect(root);
const contents = await Promise.all(files.map((file) => readFile(file)));
const total = contents.reduce((sum, content) => sum + gzipSync(content).byteLength, 0);
assert.ok(total <= budgetBytes, `App JavaScript is ${Math.ceil(total / 1024)} KB gzip; budget is ${budgetBytes / 1024} KB.`);
console.log(`Bundle budget passed: ${Math.ceil(total / 1024)} KB gzip of ${budgetBytes / 1024} KB.`);
