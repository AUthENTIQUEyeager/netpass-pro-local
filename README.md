# NetPass Pro — Plateforme WiFi Intelligente

Plateforme complète de vente de tickets WiFi Hotspot connectée à MikroTik.
Paiement via Wave Business, gestion multi-routeurs, dashboard administrateur.

---

## Stack technique

| Couche | Technologie | Hébergement |
|---|---|---|
| Frontend | Next.js 14 + Tailwind | Vercel (gratuit) |
| Backend | Node.js + Express | Render (gratuit) |
| Base de données | PostgreSQL + Prisma | Supabase (gratuit) |
| Paiement | Wave Business API | — |
| Routeur | MikroTik RouterOS API | Sur site |

---

## Installation locale

### 1. Cloner le projet
```bash
git clone https://github.com/ton-compte/netpass-pro.git
cd netpass-pro
```

### 2. Backend
```bash
cd backend
npm install

# Copier le fichier d'environnement
cp .env.example .env
# Remplir les variables dans .env

# Générer le client Prisma
npx prisma generate

# Créer les tables en base
npx prisma migrate dev --name init

# Démarrer en développement
npm run dev
```

### 3. Frontend
```bash
cd frontend
npm install

# Copier le fichier d'environnement
cp .env.local.example .env.local
# Remplir NEXT_PUBLIC_API_URL

# Démarrer en développement
npm run dev
```

### 4. Créer le premier admin
```bash
curl -X POST http://localhost:3001/api/auth/setup \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@netpass.pro","password":"motdepasse","nom":"Administrateur"}'
```

### 5. Ajouter les forfaits par défaut
```bash
curl -X POST http://localhost:3001/api/forfaits \
  -H "Authorization: Bearer TON_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"nom":"1 Heure","duree_heures":1,"prix":500,"vitesse":"10 Mbps","description":"Connexion immediate,1 appareil,Support inclus"}'
```

---

## Déploiement production

### Étape 1 — Supabase (Base de données)

1. Créer un compte sur supabase.com
2. Créer un nouveau projet
3. Aller dans Settings > Database
4. Copier l'URL de connexion (URI)
5. La coller dans DATABASE_URL de ton backend

### Étape 2 — Render (Backend)

1. Créer un compte sur render.com
2. New > Web Service
3. Connecter ton repo GitHub
4. Paramètres :
   - Build Command: `npm install && npx prisma generate && npx prisma migrate deploy`
   - Start Command: `npm start`
   - Root Directory: `backend`
5. Ajouter toutes les variables d'environnement

### Étape 3 — Vercel (Frontend)

1. Créer un compte sur vercel.com
2. Import depuis GitHub
3. Root Directory: `frontend`
4. Ajouter les variables d'environnement :
   - NEXT_PUBLIC_API_URL = URL de ton service Render

### Étape 4 — Wave Business

1. Créer un compte Wave Business
2. Demander l'accès API à Wave
3. Récupérer ta clé API et ton secret webhook
4. Dans le dashboard Wave, configurer l'URL webhook :
   `https://ton-api.onrender.com/webhooks/wave`

### Étape 5 — MikroTik

Sur ton routeur MikroTik, activer l'API :
```
/ip service enable api
/ip service set api port=8728
```

Créer un utilisateur API dédié :
```
/user add name=netpass-api password=motdepasse group=full
```

---

## Variables d'environnement

### Backend (.env)
```
DATABASE_URL=postgresql://...supabase...
JWT_SECRET=cle_aleatoire_64_caracteres
WAVE_API_KEY=wave_sn_prod_xxxxxxxxxxxx
WAVE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxx
FRONTEND_URL=https://ton-site.vercel.app
PORT=3001
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=https://ton-api.onrender.com
NEXT_PUBLIC_APP_NAME=NetPass Pro
```

---

## Structure du projet

```
netpass-pro/
├── backend/
│   ├── src/
│   │   ├── index.js              Point d'entrée Express
│   │   ├── routes/
│   │   │   ├── auth.js           Login admin JWT
│   │   │   ├── commandes.js      Créer commande + Wave
│   │   │   ├── tickets.js        Gestion tickets
│   │   │   ├── forfaits.js       CRUD forfaits
│   │   │   ├── routeurs.js       CRUD routeurs MikroTik
│   │   │   └── stats.js          Statistiques dashboard
│   │   ├── services/
│   │   │   ├── mikrotik.js       RouterOS API
│   │   │   └── wave.js           Wave Payment API
│   │   ├── webhooks/
│   │   │   └── wave.js           Réception paiement confirmé
│   │   └── middlewares/
│   │       ├── auth.js           Vérification JWT
│   │       └── errorHandler.js
│   └── prisma/
│       └── schema.prisma         Schéma base de données
│
└── frontend/
    ├── app/
    │   ├── page.tsx              Landing page
    │   ├── forfaits/page.tsx     Choix du forfait
    │   ├── ticket/page.tsx       Affichage ticket
    │   └── admin/
    │       ├── page.tsx          Dashboard overview
    │       ├── tickets/          Gestion tickets
    │       ├── utilisateurs/     Clients connectés
    │       ├── paiements/        Historique Wave
    │       ├── forfaits/         Gestion forfaits
    │       ├── routeurs/         Gestion MikroTik
    │       └── parametres/       Configuration
    ├── components/
    │   └── ui/Navbar.tsx
    └── lib/api.ts                Appels backend
```

---

## Flux de paiement complet

```
1. Client choisit forfait + site
2. POST /api/commandes → crée commande en BDD
3. Backend appelle Wave API → reçoit checkout_url
4. Client redirigé vers Wave pour payer
5. Wave confirme → POST /webhooks/wave
6. Backend vérifie signature HMAC
7. Backend crée utilisateur dans MikroTik via RouterOS API
8. Ticket enregistré en BDD
9. Client redirigé vers /ticket?ref=ID
10. Client se connecte au WiFi avec ses identifiants
11. MikroTik expire automatiquement après la durée
```

---

## Coût mensuel

| Service | Plan | Coût |
|---|---|---|
| Vercel | Hobby | 0 FCFA |
| Render | Free | 0 FCFA |
| Supabase | Free | 0 FCFA |
| Wave API | — | 0 FCFA + ~1% commission |
| **Total** | | **0 FCFA/mois** |
