import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

test("users logout is registered before the dynamic user id route", async () => {
  const source = await readFile(new URL("../src/routes/users.js", import.meta.url), "utf8");
  const logoutIndex = source.indexOf("router.get('/logout'");
  const dynamicIndex = source.indexOf('router.get("/:id"');
  assert.ok(logoutIndex >= 0 && dynamicIndex >= 0 && logoutIndex < dynamicIndex);
});
