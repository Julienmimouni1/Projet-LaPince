import { createBrowserRouter } from "react-router-dom";
import RegisterPage from "../pages/auth/RegisterPage";
import LoginPage from "../pages/auth/Login/loginPage";
import PrivateRoute from "../components/PrivateRoute";
import ParametrePage from "../pages/Parametre/ParametrePage";
import LandingPage from "../pages/landingPage/landingPage";
import TransactionPage from "../pages/Transaction/TransactionPage";

export const router = createBrowserRouter([
  // --- ROUTES PUBLIQUES ---
  {
    path: "/",
    element: <LandingPage />,
  },

  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },

  // Nous devons ajouter les routes ici pour le développement, puis pour la production, nous devons séparer les routes privés et publics; sinon, ils ne seront pas affichés dans le navigateur pour le développement sans être identifiés.
  {
    path: "/parameters",
    element: <ParametrePage />,
  },

  // --- ROUTES PRIVÉES (Protégées) ---

  {
    // On met le PrivateRoute en parent
    element: <PrivateRoute />,
    children: [
      {
        path: "/dashboard",
        // element: <DashboardPage />, // À décommenter quand il sera créée
        element: <div>Bienvenue sur ton Dashboard sécurisé !</div>,
      },
      {
        path: "/transactions",
        // Placeholder — sera remplacée par la page de Marie
        element: <TransactionPage />,
      },
      // {
      //   path: "/parameters",
      //   // element: <ParametersPage />, // À décommenter quand il sera créée
      //   element: <ParametrePage />,
      // },
      {
        path: "/mentions-legales",
        // element: <MentionsLegalesPage />, // À décommenter quand il sera créée
        element: <div>Page des mentions légales</div>,
      },
    ],
  },
]);
