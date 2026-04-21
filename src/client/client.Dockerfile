# ===== Premier step : construire le dossier dist ======

# Image de base
FROM node:22-alpine AS builder

# Définir l'espace de travail
WORKDIR /app

# Copier les métadonnées du projet
COPY package*.json ./

# Installe les dépendances
RUN npm install

# Copier le reste du code
# (penser au .dockerignore pour ne pas copier certains fichiers)
COPY ./ ./ 

# Problème : 
# - il faut rajouter la variable `VITE_API_BASE_URL` dans l'image avant de lancer le build, afin de définir l'adresse de l'API dans le dossier dist/
# - solution : on rajoutera au moment du build l'argument `docker build --build-arg VARIABLE=VALEUR`
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
# ARG = permet d'accepter l'argument --build-arg
# ENV = permet d'injecter la variable dans l'environnement lorsqu'on lance des commandes RUN
# On pourrait appeler l'ARG autrement, mais dans ce cas attention lorsqu'on le fourni avec --build-arg

# Build le code vers le dossier 'dist'
RUN npm run build



# ===== Deuxième step : conteneur NGinx qui sert le dist ======

# Image de base 
# Pas besoin de donner un nom à l'étape puisque c'est la dernière
FROM nginx:alpine

# Supprimer ce qui se trouve dans le dossier que sert Nginx (/user/share/nginx/html)
RUN rm -rf /usr/share/nginx/html/*

# Remplacer par ce qui se trouve dans notre dossier `/dist` de l'étape précédente
# --from permet de copier le dossier dist de l'étape précédente que l'on a nommé "builder"
COPY --from=builder /app/dist /usr/share/nginx/html

# Documentation : Nginx expose sur le port 80 dans le conteneur
EXPOSE 80 

# Commande qui se lance au démarrage du conteneur
CMD ["nginx", "-g", "daemon off;"]
