import express from "express";
import usersRouter from "./routes/users.js";

export function createApp(prisma) {
  const app = express();
  app.use(express.json({ limit: "10kb" }));

  app.get("/", (req, res) => {
    res.json({ message: "Express + Prisma API", users: "/users" });
  });
  app.use("/users", usersRouter);
  app.use((req, res) => res.status(404).json({ error: "Route not found." }));

  // Express 5 sends rejected async route promises here automatically.
  app.use((error, req, res, next) => {
    if (error?.name === "ZodError") {
      return res.status(400).json({ error: error.issues?.[0]?.message || "Invalid request body." });
    }
    if (error.code === "P2002") {
      return res.status(409).json({ error: "That email is already in use." });
    }
    if (error.code === "P2025") {
      return res.status(404).json({ error: "User not found." });
    }
    if (error.type === "entity.parse.failed") {
      return res
        .status(400)
        .json({ error: "Request body must be valid JSON." });
    }
    if (error.status >= 400 && error.status < 500) {
      return res.status(error.status).json({ error: "Invalid request body." });
    }
    console.error(error);
    res.status(500).json({ error: "Something went wrong." });
  });

  return app;
}
