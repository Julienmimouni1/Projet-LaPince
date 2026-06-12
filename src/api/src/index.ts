import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";

import authRouter from "../routes/auth.routes.js";
import userRouter from "../routes/user.routes.js";
import categoryRouter from "../routes/category.routes.js";
import transactionRouter from "../routes/transaction.routes.js";
import budgetRoutes from "../routes/budget.routes.js";
import alertRoutes from "../routes/alert.routes.js";
import statsRoutes from "../routes/stats.routes.js";

// Créer une app Express
const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Sécuriser les headers HTTP
app.use(helmet());

// Origines autorisées : CORS_ORIGIN peut contenir plusieurs URLs séparées par une virgule
const allowedOrigins = [
  "http://localhost:5173",
  ...(process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(",").map((o) => o.trim()) : []),
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Autoriser les requêtes sans origin (Postman, curl)
      if (!origin) return callback(null, true);
      // Autoriser toutes les URLs de preview Vercel du projet
      if (origin.match(/^https:\/\/projet-la-pince[\w-]*\.vercel\.app$/)) {
        return callback(null, true);
      }
      // Autoriser les origines explicitement listées
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`CORS: origin ${origin} not allowed`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);


// Body parser pour récupérer les body "application/json" dans req.body
app.use(express.json());

//Middleware : Analyse les cookies de la requête pour extraire les tokens d'authentification (JWT) et les préférences utilisateur.
app.use(cookieParser());

app.use("/auth", authRouter);
app.use("/users", userRouter);
app.use("/categories", categoryRouter);
app.use("/transactions", transactionRouter);
app.use("/budgets", budgetRoutes);
app.use("/alerts", alertRoutes);
app.use("/stats", statsRoutes);

app.get("/", (req, res) => {
  res.json("Hello");
});

export default app;

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.info(`🚀 Server started at http://localhost:${PORT}`);
  });
}
