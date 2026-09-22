export const corsOptions = {
  origin: "http://localhost:3008",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  maxAge: 86400
};
