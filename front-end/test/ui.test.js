import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

test("page exposes every control used by app.js", async () => {
  const html = await readFile(new URL("../index.html", import.meta.url), "utf8");
  for (const id of [
    "preset", "method", "path", "body", "token", "include-token",
    "clear-token", "send", "status", "response"
  ]) {
    assert.match(html, new RegExp(`id=["']${id}["']`));
  }
  assert.match(html, /<script type="module" src="\.\/app\.js"><\/script>/);
  const app = await readFile(new URL("../app.js", import.meta.url), "utf8");
  assert.match(app, /elements\.body\.disabled = \["GET", "HEAD"\]\.includes\(preset\.method\)/);
});
