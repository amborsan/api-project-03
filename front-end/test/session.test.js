import test from "node:test";
import assert from "node:assert/strict";
import { persistToken, updateTokenAfterResponse, TOKEN_KEY } from "../session.js";

const storage = () => {
  const values = new Map();
  return {
    values,
    setItem(key, value) { values.set(key, value); },
    removeItem(key) { values.delete(key); },
    getItem(key) { return values.get(key) || null; }
  };
};

test("manual tokens are persisted and logout clears them", () => {
  const store = storage();
  assert.equal(persistToken(store, " pasted "), "pasted");
  assert.equal(store.getItem(TOKEN_KEY), "pasted");
  assert.equal(updateTokenAfterResponse(store, "/users/logout?now=1", { ok: true, body: "" }, "pasted"), "");
  assert.equal(store.getItem(TOKEN_KEY), null);
});

test("successful login saves a token with a query string", () => {
  const store = storage();
  const result = updateTokenAfterResponse(store, "/auth/login?demo=1", { ok: true, body: '{"token":"abc"}' }, "");
  assert.equal(result, "abc");
  assert.equal(store.getItem(TOKEN_KEY), "abc");
});
