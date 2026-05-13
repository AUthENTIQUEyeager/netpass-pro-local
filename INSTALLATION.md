# NetPass Pro — Guide d'installation locale (Windows)

## Ce qui a été modifié

- **Base de données** : PostgreSQL/Supabase → SQLite local (fichier `backend/netpass.db`)
- **Backend** : écoute sur toutes les interfaces réseau (accessible depuis le WiFi)
- **Frontend** : pointe vers `http://10.10.10.2:3001`
- **Vouchers** : limite augmentée à 200, impression propre en PDF
- **Paiement Wave** : polling automatique (fonctionne sans webhook)

## Étapes d'installation

### 1. Prérequis
Installer **Node.js LTS** : https://nodejs.org (prendre la version LTS)

### 2. Configurer l'IP du PC serveur
Avant d'installer, vérifier que le PC a bien l'IP `10.10.10.2`.
Si l'IP est différente, modifier dans :
- `backend/.env` → changer `SERVEUR_IP` et `FRONTEND_URL`
- `frontend/.env.local` → changer `NEXT_PUBLIC_API_URL`

### 3. Lancer l'installation
Double-cliquer sur **`INSTALL.BAT`** et attendre la fin.

### 4. Démarrer NetPass Pro
Double-cliquer sur **`START.BAT`**.

### 5. Configurer MikroTik
Dans Winbox :
```
IP → Services → api → Enabled : OUI, Port : 8728
IP → Hotspot → vérifier que le hotspot est actif
```

### 6. Premier lancement
1. Aller sur `http://10.10.10.2:3000/admin`
2. Créer le compte administrateur
3. Ajouter le routeur :
   - IP : 10.10.10.1
   - Port API : 8728
   - User : admin
   - Password : 123
4. Tester la connexion

## Paiement Wave
Quand vous aurez la clé API Wave Business, mettre dans `backend/.env` :
```
WAVE_API_KEY=wave_sn_prod_VOTRE_CLE
```
Puis redémarrer via `START.BAT`.

## Vouchers sans internet (mode cash)
Admin → Tickets → "Générer vouchers" → choisir forfait + quantité → Imprimer
