import test from "node:test";
import assert from "node:assert/strict";
import { createApp } from "../src/app.js";
import { prisma } from "../src/prisma.js";

test("POST /users rejects missing name before calling the database", async () => {
  const originalCreate = prisma.user.create;
  prisma.user.create = async () => {
    throw new Error("DB should not be called for invalid input");
  };

  const app = createApp(prisma);
  const server = app.listen(0);
  const { port } = server.address();

  try {
    const response = await fetch(`http://127.0.0.1:${port}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "alice@example.com" }),
    });

    assert.equal(response.status, 400);
    const body = await response.json();
    assert.equal(body.error, "Invalid input: expected string, received undefined");
  } finally {
    prisma.user.create = originalCreate;
    await new Promise((resolve, reject) => {
      server.close((error) => {
        if (error) reject(error);
        else resolve();
      });
    });
  }
});
