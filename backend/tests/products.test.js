import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

test("product listing only includes relations present in the Product model", async () => {
  const controller = await readFile(new URL("../src/controllers/productController.js", import.meta.url), "utf8");
  const schema = await readFile(new URL("../prisma/schema.prisma", import.meta.url), "utf8");
  assert.match(schema, /model Product\s*\{/);
  assert.doesNotMatch(schema, /variants\s+ProductVariant/);
  assert.doesNotMatch(controller, /variants:\s*true/);
});
