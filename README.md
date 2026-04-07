# UnionManager Africa 🌍

> Plateforme SaaS complète de gestion syndicale pour l'Afrique

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue)](https://postgresql.org/)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black)](https://vercel.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://typescriptlang.org/)

## 📋 Modules

| # | Module | Description |
|---|--------|-------------|
| 1 | **Dashboard** | Stats en temps réel, graphiques, activité récente |
| 2 | **Membres** | CRUD complet, filtres région/section, fiche détaillée |
| 3 | **Cotisations** | Enregistrement, suivi retards, rapports mensuels |
| 4 | **Réunions** | Planification, participants, feuille présence, PV |
| 5 | **Actions Syndicales** | Grèves, négociations, manifestations, pétitions |
| 6 | **Plaintes** | Déclaration, suivi dossier, historique complet |
| 7 | **Finances** | Recettes/dépenses, bilan, graphiques analytiques |
| 8 | **Documents** | Upload, catégories, partage, versioning |
| 9 | **Communication** | Messages internes, annonces, notifications |
| 10 | **Utilisateurs** | RBAC 6 rôles, audit log, multi-tenant |

## 🚀 Démarrage Rapide

```bash
# 1. Cloner le projet
git clone https://github.com/votre-repo/unionmanager-africa.git
cd unionmanager-africa

# 2. Installer les dépendances
npm install

# 3. Configuration
cp .env.example .env.local
# Editez .env.local

# 4. Initialiser la base de données
psql $DATABASE_URL -f database/schema.sql

# 5. Démarrer
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000)

**Compte démo :** `admin@unionmanager.africa` / `Admin@2025`

## 📁 Structure

```
app/              # Pages Next.js 14 (App Router)
├── api/          # Routes API REST
├── dashboard/    # Tableau de bord
├── membres/      # Gestion membres
├── cotisations/  # Cotisations
├── reunions/     # Réunions
├── plaintes/     # Plaintes
├── finances/     # Finances
├── documents/    # Documents
└── communication/# Communication

components/       # Composants React réutilisables
lib/              # Auth JWT, DB PostgreSQL
types/            # TypeScript types
database/         # Schéma SQL complet
```

## 🔐 Rôles & Permissions

| Rôle | Accès |
|------|-------|
| `super_admin` | Accès total |
| `president` | Tous modules sauf admin utilisateurs |
| `secretaire_general` | Membres, réunions, actions, plaintes |
| `tresorier` | Cotisations, finances uniquement |
| `responsable_section` | Membres de sa section |
| `lecteur` | Lecture seule |

## 🌍 Adapté pour l'Afrique

- 💰 **Multi-devises** : FCFA, CFA, GNF, etc.
- 📱 **Mobile-first** : optimisé pour smartphones
- 📶 **Hors-ligne ready** : PWA optionnel
- 📨 **SMS** : intégration Africa's Talking / Orange
- 💸 **Mobile Money** : Orange Money, Wave, MTN MoMo

## 📖 Documentation

Voir [DEPLOYMENT.md](./DEPLOYMENT.md) pour le guide complet de déploiement sur Vercel.

---

Built with ❤️ for African trade unions
