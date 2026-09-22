import test from "node:test";
import assert from "node:assert/strict";
import { ROUTE_PRESETS, createRequest, readResponse } from "../api.js";

const expectedRoutes = [
  "GET /", "POST /auth/register", "POST /auth/login", "GET /auth/logout",
  "GET /users", "GET /users/:id", "POST /users", "PUT /users/:id",
  "PATCH /users/:id", "DELETE /users/:id", "POST /users/register",
  "POST /users/login", "GET /users/logout", "GET /products", "POST /products",
  "GET /categories", "POST /categories", "GET /categories/:slug/products",
  "GET /brands", "GET /brands/:id", "POST /brands", "GET /cart/:userId",
  "POST /cart", "POST /order/checkout", "GET /admin"
];

test("presets cover every registered route", () => {
  assert.deepEqual(ROUTE_PRESETS.map(({ method, route }) => `${method} ${route}`), expectedRoutes);
});

test("GET has no body or empty authorization header", () => {
  assert.deepEqual(createRequest("/users", "GET", "", "", true), {
    url: "http://localhost:3005/users",
    options: { method: "GET", headers: {} }
  });
});

test("JSON POST gets content type and JWT", () => {
  assert.deepEqual(createRequest("/cart", "POST", '{"userId":1}', "abc", true).options, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: "Bearer abc" },
    body: '{"userId":1}'
  });
});

test("malformed JSON is rejected", () => {
  assert.throws(() => createRequest("/users", "POST", "{bad", "", false), /valid JSON/);
});

test("GET bodies are rejected instead of being silently discarded", () => {
  assert.throws(() => createRequest("/users", "GET", '{"unexpected":true}', "", false), /cannot include a body/);
});

test("empty and non-JSON responses remain readable", async () => {
  assert.equal(await readResponse(new Response(null, { status: 204 })), "");
  assert.equal(await readResponse(new Response("Server unavailable", { status: 500 })), "Server unavailable");
  assert.equal(await readResponse(new Response('{"ok":true}', { status: 200 })), '{\n  "ok": true\n}');
});
