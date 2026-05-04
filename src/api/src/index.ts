import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";

import authRouter from "../routes/auth.routes.js";
import userRouter from "../routes/user.routes.js";
import categoryRouter from "../routes/category.routes.js";
import budgetRoutes from "../routes/budget.routes.js";
import alertRoutes from "../routes/alert.routes.js";
import transactionsRoutes from "../routes/transaction.routes.js"

// Créer une app Express
const app = express();
const PORT = Number(process.env.PORT) || 3007;

// Sécuriser les headers HTTP
app.use(helmet());

// Autoriser les requêtes cross-origin
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true , // Permet d'envoyer les cookies dans les requêtes cross-origin, indispensable pour l'authentification avec JWT stockés en cookie
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'], // Autorise explicitement l'OPTIONS pour les prévols CORS, ce qui est nécessaire pour les requêtes avec credentials
    allowedHeaders: ['Content-Type', 'Authorization'] // Autorise les en-têtes nécessaires pour l'authentification et les données JSON
}));

// Body parser pour récupérer les body "application/json" dans req.body
app.use(express.json())

//Middleware : Analyse les cookies de la requête pour extraire les tokens d'authentification (JWT) et les préférences utilisateur.
app.use(cookieParser());

app.use("/auth", authRouter);
app.use("/users", userRouter);
app.use("/categories", categoryRouter);
app.use("/budgets", budgetRoutes);
app.use("/alerts", alertRoutes);
app.use("/transactions" , transactionsRoutes);


app.get('/', (req, res) => {
    res.json("Hello")
})

// Démarre un serveur
app.listen(PORT, () => {
  console.info(`🚀 Server started at http://localhost:${PORT}`);
})
