#  Online Printing Platform

Une plateforme **Full Stack d'impression en ligne** permettant aux utilisateurs de s'authentifier, de téléverser un document PDF, de configurer les options d'impression et de passer une commande avec calcul automatique du prix.

Ce projet a été développé avec une architecture moderne basée sur **FastAPI**, **React**, et **PostgreSQL**, en respectant les bonnes pratiques de développement, de sécurité et de maintenabilité.

---

## Fonctionnalités

### Authentification sécurisée

- Création de compte
- Connexion utilisateur
- Hashage des mots de passe avec **Argon2**
- Authentification stateless avec **JWT**
- Protection des routes privées
- Gestion des erreurs d'authentification

---
### Téléversement et analyse de PDF

- Upload de fichiers PDF
- Validation du type de fichier
- Analyse automatique avec **PyPDF2**
- Détection instantanée du nombre de pages
- Stockage temporaire des fichiers

---

### Configuration d'impression

L'utilisateur peut choisir :

| Option | Prix |
|---------|------|
| Noir & Blanc | **0.50 DH / page** |
| Couleur | **1.00 DH / page** |

Le prix est recalculé automatiquement en temps réel sans rechargement de la page.

---

###  Gestion des commandes

- Enregistrement des commandes
- Association avec l'utilisateur connecté
- Sauvegarde dans PostgreSQL
- Confirmation de commande
- Gestion robuste des erreurs

---

#  Architecture

```
.
├── backend/
│   ├── routers/
│   ├── models/
│   ├── schemas/
│   ├── database/
│   ├── services/
│   ├── uploads/
│   ├── main.py
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
│
└── README.md
```

---

#  Technologies utilisées

## Backend

- Python 3.x
- FastAPI
- SQLAlchemy
- PostgreSQL
- Pydantic
- JWT Authentication
- Argon2
- PyPDF2
- Uvicorn

---

## Frontend

- React 18
- React Router
- Axios
- CSS3

---

## Base de données

- PostgreSQL

---

#  Milestones

## Milestone 1 — Authentification

Objectifs :

- Création de compte
- Connexion
- JWT
- Argon2
- Routes protégées

---

## Milestone 2 — Upload PDF

Objectifs :

- Téléversement
- Analyse PDF
- Détection automatique du nombre de pages
- Validation des fichiers

---

## Milestone 3 — Configuration d'impression

Objectifs :

- Choix couleur / noir & blanc
- Calcul dynamique du prix
- Interface utilisateur réactive

---

## Milestone 4 — Commandes

Objectifs :

- Sauvegarde PostgreSQL
- Association utilisateur
- Confirmation de commande
- Gestion des erreurs

---

#  Sécurité

Le projet applique plusieurs bonnes pratiques :

- Hashage des mots de passe avec Argon2
- Authentification JWT
- Validation stricte des données via Pydantic
- Aucune information sensible codée en dur
- Protection des routes privées
- Vérification des entrées utilisateur
- Configuration CORS

---

# Installation

## 1. Cloner le projet

```bash
git clone https://github.com/zinebcherradi/print-platform-prototype.git

cd online-printing-platform
```

---

## 2. Backend

Créer un environnement virtuel :

### Windows

```bash
python -m venv venv

venv\Scripts\activate
```

### Linux / macOS

```bash
python3 -m venv venv

source venv/bin/activate
```

Installer les dépendances :

```bash
pip install -r requirements.txt
```

Configurer la connexion PostgreSQL.

Lancer le serveur :

```bash
uvicorn main:app --reload
```

Le backend sera accessible sur :

```
http://localhost:8000
```

---

## 3. Frontend

Se placer dans le dossier frontend :

```bash
cd frontend
```

Installer les dépendances :

```bash
npm install
```

Lancer React :

```bash
npm start
```

Le frontend sera disponible sur :

```
http://localhost:3000
```

---

#  API REST

## Auth

| Méthode | Endpoint |
|----------|----------|
| POST | /register |
| POST | /login |

---

## PDF

| Méthode | Endpoint |
|----------|----------|
| POST | /upload |

---

## Orders

| Méthode | Endpoint |
|----------|----------|
| POST | /orders |
| GET | /orders |

---

# Interface

L'application propose une interface moderne comprenant :

- Authentification
- Téléversement du PDF
- Aperçu des informations du document
- Choix des options d'impression
- Calcul automatique du prix
- Validation de la commande
- Notifications de succès et d'erreur



#  Auteur

Développé dans le cadre d'un test technique Full Stack.

Technologies principales :

- FastAPI
- React
- PostgreSQL
- SQLAlchemy
- JWT
- Argon2
- PyPDF2

---

## Licence

Ce projet est fourni à des fins de démonstration technique et d'évaluation des compétences Full Stack.