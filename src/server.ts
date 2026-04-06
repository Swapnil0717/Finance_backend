import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import session from "express-session";
import passport from "./config/passport";
import routes from "./routes";
import { authMiddleware } from "./middleware/auth.middleware";
import { errorMiddleware } from "./middleware/error.middleware";

dotenv.config();

const app = express();


app.use(
  session({
    secret: "super-secret",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Middlewares
app.use(cors());
app.use(express.json());

// Health check
app.get("/health", (_req, res) => {
  res.status(200).json({ status: "OK" });
});

// Debug route (authenticated user)
app.get("/me", authMiddleware, (req: any, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
});

// API Routes
app.use("/", routes);

// Global Error Handler (must be last)
app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Google oauth  running on http://localhost:5000/auth/google`);
});