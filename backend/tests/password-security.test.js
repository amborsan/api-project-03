import test from "node:test";
import assert from "node:assert/strict";
import bcrypt from "bcrypt";
import { hashPassword, withHashedPassword, stripPassword, verifyPassword } from "../src/utils/password-security.js";

test("hashPassword creates a bcrypt hash", async () => {
  const hash = await hashPassword("123123");
  assert.notEqual(hash, "123123");
  assert.equal(await bcrypt.compare("123123", hash), true);
});

test("withHashedPassword preserves user fields and hashes password", async () => {
  const result = await withHashedPassword({ name: "Ali", password: "123123" });
  assert.equal(result.name, "Ali");
  assert.equal(await bcrypt.compare("123123", result.password), true);
});

test("stripPassword removes password from API output", () => {
  assert.deepEqual(stripPassword({ id: 1, name: "Ali", password: "hash" }), { id: 1, name: "Ali" });
});

test("legacy plain-text passwords verify once and are upgraded", async () => {
  let upgraded;
  assert.equal(await verifyPassword("123123", "123123", (hash) => { upgraded = hash; }), true);
  assert.equal(await bcrypt.compare("123123", upgraded), true);
});
