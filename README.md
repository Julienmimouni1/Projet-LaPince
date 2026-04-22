# La Pince

Application web de gestion de finances personnelles.
Objectif du projet : permettre à l’utilisateur de suivre ses revenus, dépenses et catégories, avec une base technique propre, collaborative et déployable.

## Sommaire

- Présentation du projet
- Stack technique
- Prérequis
- Installation
- Configuration des variables d’environnement
- Lancement du projet
- Organisation du travail
- Conventions Git
- Règles de pull request
- Structure du projet
- Dépannage

---

## Présentation du projet

**La Pince** est une application web permettant de suivre ses finances personnelles de façon simple et intuitive.

Fonctionnalités prévues dans le MVP :
- Inscription et connexion.
- Consultation du profil utilisateur.
- Gestion des transactions.
- Gestion des catégories.
- Base prête pour les budgets, alertes et statistiques dans les évolutions futures.

---

## Stack technique

### Front-end
- React 19
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Shadcn UI

### Back-end
- Node.js
- Express
- TypeScript
- Prisma
- Zod
- JWT
- Argon2

### Base de données
- PostgreSQL

### DevOps
- Docker
- Docker Compose

### Qualité et collaboration
- Git
- GitHub
- Pull Requests
- Peer review obligatoire

---

## Prérequis

Avant de commencer, installer :
- Node.js
- npm
- Docker
- Docker Compose
- Git

Vérifier les versions si besoin :
```bash
node -v
npm -v
git --version
docker -v
docker compose version
```

---

## Installation

### 1. Cloner le dépôt
```bash
git clone <URL_DU_DEPOT>
cd cda-la-pince
```


### 2. Créer le .env à la racine du projet
Créer un fichier `.env` à partir de `.env.example` et ajouter les valeurs.


### Règles importantes pour le dev
- Le fichier `.env` ne doit jamais être commité.
- Le fichier `.env.example` doit rester dans le dépôt.
- Chaque membre doit utiliser les mêmes noms de variables.

---

## Lancement du projet

### Avec Docker
À la racine du projet :

```bash
docker compose up --build
docker compose up -b
```

puis 

```bash
docker exec -it <NOM_DU_CONTENEUR> npx prisma migrate dev --name <NOM_MIGRATION>
```


## Conventions Git

### Branches
- `main` : branche de production.
- `develop` : branche d’intégration.
- `feat/nom-fonctionnalite` : nouvelle fonctionnalité.
- `fix/nom-bug` : correction.
- `chore/nom-tache` : tâche technique.

### Règles
- Ne jamais travailler directement sur `main`.
- Toute modification passe par une Pull Request.
- Une PR doit être relue et approuvée par au moins 1 membre avant fusion.
- La branche `main` est protégée.

### Exemples
```bash
git checkout -b feat/auth-register
git checkout -b fix/navbar-responsive
git checkout -b chore/docker-setup
```

---

## Règles de pull request

Chaque Pull Request doit contenir :
- Un titre clair.
- Une description de ce qui a été fait.
- Le pourquoi de la modification.
- Les étapes pour tester.
- Les captures d’écran si nécessaire.

### Avant merge
- Code relu.
- 1 approve minimum.
- Tests passés.
- Aucun conflit non résolu.

---


## Dépannage

### Problème de base de données
Vérifier que le conteneur PostgreSQL est bien lancé :
```bash
docker ps
```

### Problème de migration Prisma
```bash
cd api
npx prisma migrate dev
```

ou 

```bash
docker exec -it <NOM_DU_CONTENEUR> npx prisma migrate dev --name <NOM_MIGRATION>
```

### Problème de dépendances
```bash
npm install
```

### Problème de port déjà utilisé
Vérifier qu’aucune autre application n’utilise le port `3000` côté API ou `5173` côté front.

---

## Bonnes pratiques

- Commiter souvent avec des messages clairs.
- Garder les PR petites et lisibles.
- Synchroniser le front et le back sur les formats d’API.
- Documenter toute décision technique importante.
- Mettre à jour ce README si une commande ou une structure change.