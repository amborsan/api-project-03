import test from "node:test";
import assert from "node:assert/strict";
import { createStaticServer } from "../server.js";

let server;
let baseUrl;

test.before(async () => {
  server = createStaticServer().listen(0);
  await new Promise((resolve) => server.once("listening", resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

test.after(() => new Promise((resolve) => server.close(resolve)));

test("serves the page and JavaScript", async () => {
  const page = await fetch(`${baseUrl}/`);
  assert.equal(page.status, 200);
  assert.match(page.headers.get("content-type"), /^text\/html/);

  const script = await fetch(`${baseUrl}/app.js`);
  assert.equal(script.status, 200);
  assert.match(script.headers.get("content-type"), /^text\/javascript/);
});

test("returns 404 for missing and unsafe paths", async () => {
  assert.equal((await fetch(`${baseUrl}/missing.txt`)).status, 404);
  assert.equal((await fetch(`${baseUrl}/..%2Fpackage.json`)).status, 404);
});
