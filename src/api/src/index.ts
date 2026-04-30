import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import authRouter from "../routes/auth.routes.js";
import userRouter from "../routes/user.routes.js";
import categoryRouter from "../routes/category.routes.js"

// Créer une app Express
const app = express();
const PORT = Number(process.env.PORT) || 3007;

// Sécuriser les headers HTTP
app.use(helmet());
// Autoriser les requêtes cross-origin
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true
}));

// Body parser pour récupérer les body "application/json" dans req.body
app.use(express.json())
//Middleware : Analyse les cookies de la requête pour extraire les tokens d'authentification (JWT) et les préférences utilisateur.
app.use(cookieParser());


app.use("/auth", authRouter);
app.use("/users", userRouter)
app.use("/categories", categoryRouter)
app.get('/', (req, res) => {
    res.json("Hello")
} )

// Démarre un serveur
app.listen(PORT, () => {
  console.info(`🚀 Server started at http://localhost:${PORT}`);
  })