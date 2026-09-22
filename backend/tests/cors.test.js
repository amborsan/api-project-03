import test from "node:test";
import assert from "node:assert/strict";
import { corsOptions } from "../src/config/cors.js";

test("browser console can call every API method with JSON and JWT", () => {
  assert.equal(corsOptions.origin, "http://localhost:3008");
  assert.deepEqual(corsOptions.methods, ["GET", "POST", "PUT", "PATCH", "DELETE"]);
  assert.deepEqual(corsOptions.allowedHeaders, ["Content-Type", "Authorization"]);
});
