# Gestion Horaires

Application de gestion des horaires (backend Node.js + frontend React/Vite) pour l'administration, les ressources humaines et les enseignants.

## Description

Cette application permet de gérer les enseignants, les matières, les heures effectuées, les validations et les paramètres de planning. Elle se compose d'un backend Express (API REST) et d'un frontend React créé avec Vite.

## Structure du dépôt

- `backend/` : API Node.js / Express, modèles Sequelize, routes et contrôleurs.
- `frontend/` : Application React (Vite) pour l'interface utilisateur.
- `docker/` : Scripts SQL d'initialisation (ex. `init.sql`).
- `docker-compose.yml` : Orchestration Docker pour la base de données, le backend et le frontend.

## Stack technique

- Backend : Node.js, Express, Sequelize (ou autre ORM), SQLite/MySQL/Postgres (configurable)
- Frontend : React, Vite, Tailwind CSS
- Conteneurs : Docker & Docker Compose

## Prérequis

- Docker & Docker Compose installés
- (Optionnel) Node.js et npm/yarn si vous lancez sans Docker

## Installation (avec Docker)

1. Construire et démarrer les services :

```
docker-compose up -d --build backend frontend
```

2. Démarrer les conteneurs (si arrêtés) :

```
docker start gestion_horaires_frontend gestion_horaires_db gestion_horaires_backend
```

3. Accéder à l'application frontend : http://localhost:3000

Remarques :

- Pour relancer le backend : `docker restart gestion_horaires_backend`
- Commandes utilitaires (Windows) pour lister et tuer un processus sur un port :

```
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

## Installation (sans Docker)

Backend :

```
cd backend
npm install
npm run dev   # ou npm start selon la configuration
```

Frontend :

```
cd frontend
npm install
npm run dev
```

## Configuration

Le backend utilise des variables d'environnement pour la configuration (base de données, port, secret JWT, etc.). Créez un fichier `.env` dans `backend/` avec au minimum :

```
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=changeme
DB_NAME=gestion_horaires
JWT_SECRET=une_chaine_secrete
```

Adapter selon votre SGBD (MySQL/Postgres/SQLite). Le fichier `backend/src/config/database.js` contient la configuration actuelle.

## Base de données

- Le dossier `docker/init.sql` contient le script d'initialisation utilisé par le conteneur DB.
- Si vous lancez en local sans Docker, exécutez manuellement le script SQL ou laissez Sequelize synchroniser les modèles selon la configuration.

## Points d'entrée et routes principales

L'API expose plusieurs routes (voir `backend/src/routes/`):

- `authRoutes.js` : authentification (login, refresh)
- `enseignantRoutes.js` : gestion des enseignants
- `heureRoutes.js` : gestion des heures (création, validation)
- `matiereRoutes.js` : gestion des matières
- `parametreRoutes.js` : paramètres applicatifs
- `referentielRoutes.js` : référentiels métiers
- `dashboardRoutes.js` : statistiques et agrégations

Consultez les contrôleurs dans `backend/src/controllers/` pour la liste complète des endpoints et des paramètres attendus.

## Comptes de démonstration

Utilisateurs fournis dans le README frontend (exemples) :

- Admin : moussaibrahimcoulibaly2@gmail.com / moussa15
- RH : aminata.kone@gestheure.ci / rh123
- Enseignant : amadou.diallo@gestheure.com / prof123

Ces comptes sont fournis à titre d'exemple pour les tests locaux. Changez les mots de passe en production.

## Scripts utiles

- Docker Compose : `docker-compose up -d --build`
- Backend (local) : `npm run dev` ou `npm start` depuis `backend/`
- Frontend (local) : `npm run dev` depuis `frontend/`

## Développement

- Respectez la structure `frontend/src/` pour les composants et context providers.
- Les services API sont centralisés dans `frontend/src/services/api.js`.
- Utilisez les middlewares d'authentification et de rôle situés dans `backend/src/middlewares/`.

## Tests

Si des tests existent dans le projet, exécutez-les avec :

```
cd backend
npm test

cd frontend
npm test
```

## Déploiement

- La manière la plus simple de déployer est via `docker-compose` en adaptant les variables d'environnement et en configurant un proxy inverse (Nginx) si nécessaire. Un fichier `nginx.conf` est présent dans `frontend/` pour référence.
