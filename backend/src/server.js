import 'dotenv/config';
import express from "express";
import  prisma  from "./lib/prisma.js";
import cors from "cors";
import rateLimit from'express-rate-limit';
import { corsOptions } from './config/cors.js';
//App imports
import { rejectHandler } from "./middleware/app-middleware.js";
import usersRouter from "./routes/users.js";
import productRoutes from './routes/productRoutes.js';
import categoryRoutes from "./routes/categoryRoutes.js"
import brandRoutes from './routes/brandRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import authRoutes from './routes/authRoutes.js'

import adminRoutes from './routes/admin.js';
// dotenv.config();
const port = Number(process.env.PORT || 3005);

// Fail at startup if the database cannot be reached.
await prisma.$connect();
const app = express();

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
//gllobal middleware

app.use(cors(corsOptions));
app.use(express.json({ limit: "10kb" }));
app.use(limiter); // Apply rate limiting middleware


// Register user routes
app.use('/auth', authRoutes);

app.get("/", (req, res) => {
    res.json({ message: "Express + Prisma API", users: "/users", auth: "/auth/register", login: "/auth/login" });
});
app.use("/users", usersRouter);
app.use('/products', productRoutes);
app.use('/categories', categoryRoutes);
app.use('/brands', brandRoutes);
app.use('/cart', cartRoutes);
app.use('/order', orderRoutes);
app.use('/admin', adminRoutes);
app.use((req, res) => res.status(404).json({ error: "Route not found." }));

// Express 5 sends rejected async route promises here automatically.
app.use(rejectHandler);
// Connection
const server = app.listen(port, () => {
  console.log(`API running at http://localhost:${port}`);
});
app.use((err, req, res, next) => {
  console.error(err);
  
  // Handle Prisma specific errors (e.g., unique constraint violations like duplicate email)
  if (err.code === 'P2002') {
    return res.status(400).json({ error: 'A record with this value already exists.' });
  }

  res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

function shutdown() {
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
}
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
