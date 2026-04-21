Suivi de la mise en place

BACKEND

Creation du npm init -y dans le dossier api
toujours dans le dossier api npm install:
    -express // 
    -cors
    -helmet
    -cookie-parser
    -jsonwebtoken
    -argon2
    -zod
    -@prisma/client

Pour typescript:

npm install -D typescript tsx @types/node @types/express @types/cors @types/cookie-parser @types/jsonwebtoken prisma vitest

npx tsc --init
npx prisma init --datasource-provider postgresql



FRONTEND

npm create vite@latest api/client -- --template react-ts

Dans le dossier client

npm install lucide-react react-router-dom @tanstack/react-query
npm install -D tailwindcss @tailwindcss/vite
