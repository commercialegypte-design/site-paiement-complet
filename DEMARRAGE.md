# 🎯 DÉMARRAGE DU SITE - GUIDE VISUEL

## 📦 CE QUI EST INCLUS

```
✅ Site Next.js 14 complet et fonctionnel
✅ 26 fichiers de code source
✅ Base de données Prisma configurée
✅ Intégration Mollie complète
✅ 5 composants UI réutilisables
✅ Validation Zod sur tous les formulaires
✅ Système de logging structuré
✅ 3 devis de test inclus
```

---

## 🚀 INSTALLATION EN 4 ÉTAPES

### ÉTAPE 1 : Installer Node.js

**Vous avez besoin de Node.js 18 ou plus récent.**

Vérifier votre version :
```bash
node --version
```

Si besoin, télécharger : https://nodejs.org/

---

### ÉTAPE 2 : Installer les dépendances

Ouvrir un terminal dans le dossier `eonite-site-complet` :

```bash
npm install
```

**Durée : ~2 minutes**

Vous verrez :
```
added 345 packages
```

---

### ÉTAPE 3 : Configuration

#### A. Copier le fichier d'environnement

```bash
cp .env.example .env
```

#### B. Éditer le fichier `.env`

Ouvrir `.env` et remplacer :

```env
# OBLIGATOIRE : Votre clé API Mollie
MOLLIE_API_KEY=test_dHar4XY7LxsDOtmnkVtjNVWXLSlXsM

# URL de votre site
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Base de données PostgreSQL
DATABASE_URL="postgresql://user:password@localhost:5432/eonite_production"
```

**🔑 Pour obtenir votre clé Mollie :**
1. Aller sur https://www.mollie.com/dashboard
2. Settings → Developers → API keys
3. Copier la clé **Test**

**💾 Pour PostgreSQL :**

Si vous n'avez pas PostgreSQL :

**Option A - Railway (gratuit, facile)** :
1. Aller sur https://railway.app
2. Créer un projet
3. Ajouter PostgreSQL
4. Copier le `DATABASE_URL`

**Option B - Local** :
```bash
# macOS
brew install postgresql
brew services start postgresql

# Ubuntu
sudo apt install postgresql
sudo systemctl start postgresql

# Créer la base
createdb eonite_production
```

---

### ÉTAPE 4 : Initialiser la base de données

```bash
# Générer le client Prisma
npm run prisma:generate

# Créer les tables
npm run prisma:push

# Peupler avec des données de test
npm run prisma:seed
```

**Résultat attendu :**

```
✅ Seeding terminé avec succès!

📊 Devis créés:
   - DEV-2024-001: 150€ (PENDING)
   - DEV-2024-002: 85€ (PENDING)
   - DEV-2024-003: 50€ (PAID)

🧪 Pour tester le paiement:
   - Devis: DEV-2024-001
   - Email: client@example.com
```

---

## ▶️ LANCER LE SITE

```bash
npm run dev
```

**Le site démarre sur :**

```
✓ Ready in 2.5s
➜ Local:   http://localhost:3000
```

---

## 🧪 TESTER LE PAIEMENT

### 1. Ouvrir le navigateur

```
http://localhost:3000/client/payer-devis
```

### 2. Remplir le formulaire

```
Numéro de devis : DEV-2024-001
Email           : client@example.com
```

### 3. Cliquer sur "Procéder au paiement"

→ Vous serez redirigé vers Mollie (mode test)

### 4. Tester le paiement

Sur Mollie, choisir un moyen de paiement :
- **Billie** (B2B Buy Now Pay Later)
- Carte bancaire
- Virement

---

## 🎨 PAGES DISPONIBLES

| URL | Description |
|-----|-------------|
| `/client/payer-devis` | Formulaire de paiement |
| `/client/payment-result` | Page résultat (success/error) |
| `/api/pay-quote` | API de création de paiement |
| `/api/mollie-webhook` | Webhook Mollie |

---

## 🔍 VISUALISER LA BASE DE DONNÉES

```bash
npm run prisma:studio
```

Ouvre http://localhost:5555

Vous pouvez :
- ✅ Voir les 3 devis de test
- ✅ Modifier les données
- ✅ Ajouter de nouveaux devis
- ✅ Voir l'historique des webhooks

---

## 🐛 RÉSOLUTION DE PROBLÈMES

### ❌ "Cannot find module '@prisma/client'"

```bash
npm run prisma:generate
```

### ❌ "Can't reach database server"

Vérifier que PostgreSQL est démarré :

```bash
# macOS
brew services list

# Linux
sudo systemctl status postgresql
```

### ❌ "MOLLIE_API_KEY is not defined"

Vérifier que `.env` existe et contient `MOLLIE_API_KEY=...`

### ❌ Les devis de test n'apparaissent pas

```bash
npm run prisma:seed
```

---

## 📊 COMMANDES UTILES

```bash
# Développement
npm run dev              # Lancer le site
npm run build            # Build pour production
npm run start            # Mode production

# Base de données
npm run prisma:studio    # Interface visuelle
npm run prisma:push      # Mettre à jour le schéma
npm run prisma:seed      # Ajouter les données test

# Qualité
npm run lint             # Vérifier le code
```

---

## 🚀 DÉPLOYER EN PRODUCTION

### Sur Vercel (le plus simple)

1. Push votre code sur GitHub
2. Aller sur https://vercel.com
3. Importer votre repository
4. Ajouter les variables d'environnement :
   - `MOLLIE_API_KEY` (avec clé **live_xxx**)
   - `DATABASE_URL` (PostgreSQL production)
   - `NEXT_PUBLIC_BASE_URL` (votre domaine)
5. Déployer

**⚠️ IMPORTANT avant de passer en production :**

- [ ] Remplacer `test_xxx` par `live_xxx` (clé Mollie production)
- [ ] Configurer le webhook Mollie : `https://votredomaine.com/api/mollie-webhook`
- [ ] Utiliser une base PostgreSQL de production
- [ ] Activer HTTPS (automatique sur Vercel)
- [ ] Tester un vrai paiement de 0.01€

---

## ✅ CHECKLIST

Avant de dire "ça marche" :

- [ ] `npm install` terminé
- [ ] `.env` créé avec vos clés
- [ ] `npm run prisma:generate` OK
- [ ] `npm run prisma:push` OK
- [ ] `npm run prisma:seed` OK (3 devis créés)
- [ ] `npm run dev` OK
- [ ] http://localhost:3000/client/payer-devis accessible
- [ ] Formulaire de paiement fonctionne
- [ ] Redirection vers Mollie OK
- [ ] `npm run prisma:studio` montre les devis

---

## 🎉 C'EST FAIT !

Votre site de paiement Éonite est opérationnel.

**Prochaines étapes :**
1. Personnaliser les couleurs (voir `tailwind.config.ts`)
2. Ajouter votre logo (remplacer `public/logo-eonite.png`)
3. Créer vos propres devis
4. Déployer en production

---

**Questions ? → tech@eonite.com**
