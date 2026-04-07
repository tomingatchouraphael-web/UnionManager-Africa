# 🚀 Guide de Déploiement — UnionManager Africa

## Stack : Next.js 14 · PostgreSQL · Vercel

---

## 1. PRÉREQUIS

- Node.js 18+ installé
- Compte Vercel (gratuit ou Pro)
- Base de données PostgreSQL (Neon.tech recommandé — gratuit)
- Compte Cloudinary (stockage fichiers — gratuit)

---

## 2. CONFIGURATION BASE DE DONNÉES (Neon.tech)

### Étape 1 : Créer une base de données gratuite
1. Allez sur **https://neon.tech**
2. Créez un compte gratuit
3. Créez un nouveau projet : `unionmanager-africa`
4. Copiez la **connection string** (format : `postgresql://user:pass@host/db?sslmode=require`)

### Étape 2 : Initialiser le schéma
```bash
# Installer psql ou utiliser Neon Console
psql "postgresql://user:pass@host/db?sslmode=require" -f database/schema.sql
```

Ou copiez-collez le contenu de `database/schema.sql` dans l'éditeur SQL de Neon.

---

## 3. CONFIGURATION DU PROJET

### Cloner et installer
```bash
git clone https://github.com/votre-repo/unionmanager-africa.git
cd unionmanager-africa
npm install
```

### Variables d'environnement
```bash
cp .env.example .env.local
# Éditez .env.local avec vos valeurs réelles
```

Variables **obligatoires** pour la production :
```
DATABASE_URL=postgresql://...  (depuis Neon.tech)
JWT_SECRET=...                 (minimum 32 caractères aléatoires)
```

### Test local
```bash
npm run dev
# Ouvrez http://localhost:3000
# Login: admin@unionmanager.africa / Admin@2025
```

---

## 4. DÉPLOIEMENT SUR VERCEL

### Option A : Via GitHub (recommandé)

1. **Push sur GitHub**
```bash
git init
git add .
git commit -m "Initial commit - UnionManager Africa"
git remote add origin https://github.com/votre-user/unionmanager-africa.git
git push -u origin main
```

2. **Connecter à Vercel**
   - Allez sur **https://vercel.com**
   - Cliquez **"Add New Project"**
   - Importez votre repo GitHub
   - Vercel détecte automatiquement Next.js

3. **Configurer les variables d'environnement**
   Dans Vercel Dashboard → Settings → Environment Variables :
   ```
   DATABASE_URL        = votre_connection_string_neon
   JWT_SECRET          = votre_secret_jwt_64_chars
   NEXT_PUBLIC_APP_URL = https://votre-app.vercel.app
   NODE_ENV            = production
   ```

4. **Déployer**
   - Cliquez **"Deploy"**
   - Attendez 2-3 minutes
   - Votre app est live sur `https://votre-app.vercel.app`

### Option B : Via Vercel CLI
```bash
npm i -g vercel
vercel login
vercel --prod
```

---

## 5. DOMAINE PERSONNALISÉ (Optionnel)

Dans Vercel → Settings → Domains :
- Ajoutez `unionmanager.votresyndicat.sn`
- Configurez les DNS chez votre registrar

---

## 6. ARCHITECTURE MULTI-TENANT

UnionManager Africa supporte plusieurs syndicats sur la même instance :

```
Syndicat A: subdomain-a.vercel.app → organisation_id = "xxx-001"
Syndicat B: subdomain-b.vercel.app → organisation_id = "xxx-002"
```

Pour créer un nouveau syndicat :
```sql
INSERT INTO organisations (nom, sigle, pays, devise)
VALUES ('Nom du Syndicat', 'SIGLE', 'Sénégal', 'FCFA');
```

---

## 7. SÉCURITÉ EN PRODUCTION

### Checklist obligatoire :
- [ ] JWT_SECRET généré avec `openssl rand -base64 64`
- [ ] HTTPS activé (automatique sur Vercel)
- [ ] Variables d'env jamais commitées dans Git
- [ ] `.gitignore` inclut `.env.local`
- [ ] Base de données avec SSL (`sslmode=require`)
- [ ] Rate limiting activé (middleware Next.js)
- [ ] Backups base de données configurés (Neon auto-backup)

### Générer un JWT secret sécurisé :
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## 8. STRUCTURE DU PROJET

```
unionmanager-africa/
├── app/
│   ├── layout.tsx              # Layout principal avec Sidebar
│   ├── login/page.tsx          # Page de connexion
│   ├── dashboard/page.tsx      # Tableau de bord
│   ├── membres/page.tsx        # Gestion membres
│   ├── cotisations/page.tsx    # Gestion cotisations
│   ├── reunions/page.tsx       # Gestion réunions
│   ├── plaintes/page.tsx       # Gestion plaintes
│   ├── actions/page.tsx        # Actions syndicales
│   ├── finances/page.tsx       # Gestion finances
│   ├── documents/page.tsx      # Documents
│   ├── communication/page.tsx  # Communication
│   └── api/
│       ├── auth/route.ts       # Login / Refresh token
│       ├── membres/route.ts    # CRUD membres
│       ├── cotisations/route.ts
│       ├── reunions/route.ts
│       ├── plaintes/route.ts
│       ├── finances/route.ts
│       ├── documents/route.ts
│       └── stats/route.ts      # Dashboard stats
├── components/
│   ├── Sidebar.tsx             # Navigation latérale
│   ├── StatsCard.tsx
│   ├── DataTable.tsx
│   └── ui/                     # Composants shadcn
├── lib/
│   ├── auth.ts                 # JWT + permissions
│   ├── db.ts                   # Connexion PostgreSQL
│   └── utils.ts
├── types/
│   └── index.ts                # TypeScript types
├── database/
│   └── schema.sql              # Schéma complet PostgreSQL
├── .env.example
├── package.json
└── next.config.js
```

---

## 9. MODULES DISPONIBLES

| Module | Fonctionnalités |
|--------|----------------|
| **Dashboard** | Stats temps réel, graphiques, activité récente |
| **Membres** | CRUD, filtres avancés, fiche détaillée |
| **Cotisations** | Enregistrement, retards, rapport mensuel |
| **Réunions** | Création, participants, présence, PV |
| **Actions** | Grèves, négociations, manifestations |
| **Plaintes** | Déclaration, suivi, historique |
| **Finances** | Recettes/dépenses, bilan, graphiques |
| **Documents** | Upload, catégories, partage |
| **Communication** | Messages internes, annonces |
| **Utilisateurs** | RBAC, 6 rôles, audit log |

---

## 10. SUPPORT ET MAINTENANCE

- Logs Vercel : Dashboard → Logs
- Monitoring base de données : Neon Dashboard
- Backups : Automatiques sur Neon (7 jours)
- Mises à jour : `git push origin main` → déploiement automatique

---

## 💡 CONSEILS AFRIQUE

- **Mobile Money** : Intégrez Orange Money / Wave API pour les cotisations
- **SMS** : Utilisez Twilio ou Africa's Talking pour les rappels
- **Hors ligne** : Activez PWA pour zones à connectivité limitée
- **Multi-langue** : Ajoutez i18n pour Wolof, Bambara, etc.
- **FCFA** : La devise est configurable par organisation
