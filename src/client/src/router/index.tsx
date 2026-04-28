import { createBrowserRouter } from 'react-router-dom'
import RegisterPage from '../pages/auth/RegisterPage'
import LoginPage from '../pages/auth/LoginPage'
import PrivateRoute from '../components/PrivateRoute'

export const router = createBrowserRouter([

    // --- ROUTES PUBLIQUES ---

  {
    path: '/register',
    element: <RegisterPage />,
  },
{
  path: '/login',
  element: <LoginPage />,
},

 // --- ROUTES PRIVÉES (Protégées) ---

  {
    // On met le PrivateRoute en parent
    element: <PrivateRoute />, 
    children: [
      {
        path: '/dashboard',
        // element: <DashboardPage />, // À décommenter quand il sera créée
        element: <div>Bienvenue sur ton Dashboard sécurisé !</div>,
      },
      {
        path: '/parameters',
        // element: <ParametersPage />, // À décommenter quand il sera créée
        element: <div>Page des paramètres</div>,
      }, 
      {
        path: '/mentions-legales',
        // element: <MentionsLegalesPage />, // À décommenter quand il sera créée
        element: <div>Page des mentions légales</div>,
      }
    ]
  }

])