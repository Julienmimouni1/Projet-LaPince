# Changelog

Toutes les modifications notables de ce projet sont documentées ici.

Format : [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/)

---

## Comment mettre à jour ce fichier

> **Règle** : chaque PR mergée dans `main` ou `dev` doit ajouter une entrée ici avant le merge.

### 1. Ajouter une version

Copie ce bloc en haut de la section `## [Non publié]` et remplis-le :

```markdown
## [0.x.0] — AAAA-MM-JJ

### Ajouté
- Description courte de la fonctionnalité (branche `feature/xxx`)

### Modifié
- Ce qui a changé dans du code existant

### Corrigé
- Bug résolu + contexte court

### Supprimé
- Ce qui a été retiré
```

### 2. Catégories disponibles

| Catégorie | Usage |
|-----------|-------|
| `Ajouté` | Nouvelle fonctionnalité |
| `Modifié` | Changement dans du code existant |
| `Corrigé` | Correction de bug |
| `Supprimé` | Retrait de code ou de fichier |
| `Infra` | Docker, CI, config, scripts |

### 3. Bonnes pratiques

- Une entrée = une phrase, du point de vue **utilisateur/développeur** (pas du commit)
- Ne pas recopier les messages de commit verbatim — synthétise
- Mentionner la branche source entre parenthèses si utile
- Ne pas toucher aux versions déjà publiées (sauf typo)

---

## [Non publié]

_Entrées pour la prochaine release._

---

## [0.4.0] — 2026-04-27

### Infra
- Ajout de `api.dev.Dockerfile` et `client.dev.Dockerfile` : Dockerfiles dédiés au développement, qui lancent `tsx --watch` (API) et `vite --host` (client) au lieu de compiler pour la production
- Configuration de `develop.watch` dans `docker-compose.yml` : synchronisation automatique des fichiers source dans les conteneurs sans rebuild complet
- Ajout de `server.usePolling: true` dans `vite.config.ts` : correction du hot reload sur Windows (Docker ne propage pas les événements inotify natifs)
- Port du client en dev changé de `80` (nginx) à `5173` (Vite dev server)
- Ajout de commentaires détaillés dans `docker-compose.yml`

---

## [0.3.0] — 2026-04-27

### Ajouté
- Connexion complète front ↔ back sur la page d'inscription : le formulaire appelle `POST /auth/register` et redirige en cas de succès (branche `dev-connectBackFront`)
- Mise à jour de `.env.exemple` avec toutes les variables nécessaires

### Corrigé
- Correction de la configuration Docker après la connexion back/front

---

## [0.2.0] — 2026-04-24

### Ajouté
- Page d'inscription complète avec mise en page responsive mobile/desktop (images, couches couleur, logo, footer)
- Composant `RegisterForm.tsx` : champs prénom, nom, e-mail, mot de passe, confirmation — avec accessibilité (`aria-invalid`, `role="alert"`)
- Gestion de la photo de profil : input file caché + aperçu en temps réel
- Service `authApi.ts` : fonction `registerUser()` appelant `POST /auth/register`
- Utilitaire `cn()` (`clsx` + `tailwind-merge`) pour composer les classes Tailwind conditionnellement
- Typage `ImportMetaEnv` pour `VITE_API_BASE_URL` dans `vite-env.d.ts`
- Regex de validation mot de passe côté back (Zod) et côté front
- Spinner `Loader2` (lucide-react) pendant la soumission du formulaire

### Modifié
- `vite.config.ts` : ajout du plugin `@tailwindcss/vite`
- `index.css` : suppression des styles de démo Vite, reset minimal + imports Tailwind
- `nginx.conf` : ajout du bloc `location /api/` pour proxifier vers le service `api` (correction erreur 405 sur les requêtes POST)
- `RegisterPage.tsx` : intégration du composant `RegisterForm` avec props `isLoading` et `error`

### Corrigé
- Accolade manquante dans `RegisterPage` (commit `acbbb52`)
- Props `isLoading` et `error` absentes sur `RegisterForm` (commit `8be4250`)
- Erreur 405 sur `POST /api/auth/register` : proxy nginx manquant

### Supprimé
- `App.tsx` : boilerplate Vite de démo (compteur, liens React/Vite) — le routing est géré par `router/index.tsx`

---

## [0.1.0] — 2026-04-22 / 2026-04-23

### Ajouté
- Structure initiale du projet : API Express + client React/Vite + PostgreSQL via Docker Compose
- Schéma Prisma, migration et seeding de la base de données
- Route `POST /auth/register` : controller, validation Zod, hashage argon2, insertion en BDD
- Intégration de Prisma Studio dans `docker-compose.yml` (accessible sur `http://localhost:5555`)
- Modèle de Pull Request avec bonnes pratiques (template GitHub)
- README avec commandes d'installation

### Infra
- Refactorisation du `docker-compose.yml` : système de variables d'environnement via `.env`
- Port du client configurable via `CLIENT_LOCAL_PORT` dans `.env`
- Ajout d'OpenSSL dans `api.Dockerfile` (requis par Prisma)
- `.env` retiré du suivi git (`.gitignore`)
- `.env.exemple` ajouté comme référence

---

## [0.0.1] — 2026-04-21

### Ajouté
- Premier commit : setup Docker (API + client + Postgres), installation des dépendances, création du schéma Prisma
