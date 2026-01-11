# 🚀 ÉONITE - MODULE DE PAIEMENT

Site complet Next.js 14 + Prisma + Mollie, prêt à être déployé.

## ⚡ DÉMARRAGE RAPIDE (5 minutes)

### 1. Installer les dépendances

```bash
npm install
```

### 2. Configuration

```bash
# Copier le fichier d'environnement
cp .env.example .env
```

Éditer `.env` avec vos valeurs :

```env
MOLLIE_API_KEY=test_your_mollie_api_key_here
NEXT_PUBLIC_BASE_URL=http://localhost:3000
DATABASE_URL="postgresql://user:password@localhost:5432/eonite_production"
```

### 3. Initialiser la base de données

```bash
# Générer le client Prisma
npm run prisma:generate

# Créer les tables
npm run prisma:push

# Peupler avec 3 devis de test
npm run prisma:seed
```

Vous verrez :

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

### 4. Lancer le site

```bash
npm run dev
```

Ouvrir : **http://localhost:3000/client/payer-devis**

### 5. Tester le paiement

1. Numéro de devis : `DEV-2024-001`
2. Email : `client@example.com`
3. Cliquer sur "Procéder au paiement"
4. Vous serez redirigé vers Mollie (mode test)

---

## 📁 STRUCTURE DU PROJET

```
eonite-site-complet/
├── app/
│   ├── layout.tsx                      # Layout principal
│   ├── globals.css                     # Styles globaux
│   ├── api/
│   │   ├── pay-quote/route.ts          # API de paiement
│   │   └── mollie-webhook/route.ts     # Webhook Mollie
│   └── client/
│       ├── payer-devis/page.tsx        # Page de paiement
│       └── payment-result/page.tsx     # Page résultat
│
├── components/ui/                      # Composants réutilisables
│   ├── Alert.tsx
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── Input.tsx
│   └── Logo.tsx
│
├── lib/
│   ├── db/
│   │   ├── prisma.ts                   # Client Prisma
│   │   └── quotes.ts                   # Fonctions DB
│   ├── mollie/client.ts                # Client Mollie
│   ├── validation/schemas.ts           # Validation Zod
│   └── logging/logger.ts               # Système de logs
│
├── prisma/
│   ├── schema.prisma                   # Schéma de la base
│   └── seed.ts                         # Données de test
│
└── types/quote.ts                      # Types TypeScript
```

---

## 🧪 COMMANDES UTILES

```bash
# Développement
npm run dev              # Lancer en mode dev
npm run build            # Build pour production
npm run start            # Démarrer en production

# Base de données
npm run prisma:generate  # Générer le client Prisma
npm run prisma:push      # Pousser le schéma
npm run prisma:studio    # Interface visuelle DB
npm run prisma:seed      # Peupler la DB
```

---

## ✅ VÉRIFICATIONS

### Test 1 : Base de données

```bash
npm run prisma:studio
```

→ Ouvre http://localhost:5555 avec vos devis

### Test 2 : API

```bash
curl -X POST http://localhost:3000/api/pay-quote \
  -H "Content-Type: application/json" \
  -d '{"quoteNumber":"DEV-2024-001","email":"client@example.com"}'
```

→ Doit retourner un `checkoutUrl`

### Test 3 : Webhook

```bash
curl http://localhost:3000/api/mollie-webhook
```

→ Doit retourner `{"status":"ok"}`

---

## 🚀 DÉPLOIEMENT

### Option 1 : Vercel (Recommandé)

1. Push sur GitHub
2. Importer sur Vercel
3. Ajouter les variables d'environnement
4. Déployer

### Option 2 : Railway

1. Créer un projet
2. Ajouter PostgreSQL
3. Configurer les variables
4. Déployer

### Option 3 : VPS

1. Installer Node.js 18+
2. Installer PostgreSQL
3. Configurer nginx
4. `npm run build && npm start`

---

## 🔐 SÉCURITÉ PRODUCTION

Avant de déployer :

- [ ] Utiliser `live_xxx` (clé Mollie production)
- [ ] Activer HTTPS
- [ ] Configurer le webhook Mollie
- [ ] Sauvegarder la base de données
- [ ] Configurer les logs
- [ ] Tester le paiement complet

---

## 📞 SUPPORT

- Email : tech@eonite.com
- Docs Mollie : https://docs.mollie.com
- Docs Prisma : https://prisma.io/docs

---

**✅ Le site est prêt à être déployé ! 🎉**
