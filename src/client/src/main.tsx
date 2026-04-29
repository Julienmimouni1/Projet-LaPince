import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {RouterProvider} from 'react-router-dom'
import { router } from './router/index'
import { AuthProvider } from './context/AuthContext'; // Import du provider d'authentification
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
     {/* On place le AuthProvider tout en haut */}
    <AuthProvider> 
       {/* Le RouterProvider doit être à l'intérieur du AuthProvider pour que les pages puissent accéder au contexte d'authentification */}
    <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
)
