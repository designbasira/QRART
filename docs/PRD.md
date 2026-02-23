# PRD — Silhouette QR Live (QRART)

## 1. Vision produit

**Silhouette QR Live** transforme les silhouettes personnelles en QR Codes artistiques imprimés sur des produits Print-on-Demand (t-shirts, mugs, cadres). Le QR code scanné affiche un contenu digital personnalisé (message, photo, vidéo) modifiable à tout moment par le client final.

**Problème résolu** : Les cadeaux personnalisés sont statiques. Une fois offerts, leur contenu ne peut plus évoluer. Silhouette QR Live crée un pont entre l'objet physique et un contenu digital vivant.

**Proposition de valeur** :
- Pour le **créateur Etsy** : outil de création de designs QR silhouette à imprimer sur des produits POD
- Pour le **client final** : capacité de modifier le message/contenu visible après scan, à vie

---

## 2. Personas

### Admin / Créateur Etsy
- **Profil** : Vendeur Etsy de produits personnalisés
- **Besoin** : Créer rapidement des designs QR artistiques à partir de photos clients
- **Workflow** : Upload image → détourage IA → génération QR silhouette → export PNG/SVG → intégration sur produit POD

### Client final (User)
- **Profil** : Personne ayant reçu un produit avec QR code (cadeau, souvenir)
- **Besoin** : Personnaliser et modifier le message affiché après scan du QR
- **Workflow** : Scanner QR → créer un compte → modifier texte/image/vidéo → partager

---

## 3. User Stories

### Admin
| ID | Story | Priorité |
|----|-------|----------|
| A1 | En tant qu'admin, je peux uploader une image et obtenir le détourage automatique | P0 |
| A2 | En tant qu'admin, je peux générer un QR code artistique intégrant la silhouette | P0 |
| A3 | En tant qu'admin, je peux exporter le design en PNG, SVG ou obtenir le lien scan | P0 |
| A4 | En tant qu'admin, je peux gérer la liste de tous les designs créés | P0 |
| A5 | En tant qu'admin, je peux voir la liste des utilisateurs et leurs designs | P1 |
| A6 | En tant qu'admin, je peux générer des mockups produits (t-shirt, mug) | P1 |

### User (Client final)
| ID | Story | Priorité |
|----|-------|----------|
| U1 | En tant qu'user, je peux scanner un QR et voir le contenu personnalisé | P0 |
| U2 | En tant qu'user, je peux modifier le texte du message après scan | P0 |
| U3 | En tant qu'user, je peux ajouter une image au contenu | P0 |
| U4 | En tant qu'user, je peux ajouter un lien YouTube | P0 |
| U5 | En tant qu'user, je peux voir tous mes designs QR et leur statut | P0 |
| U6 | En tant qu'user, je peux prévisualiser le rendu sur mobile en temps réel | P1 |
| U7 | En tant qu'user, je peux gérer mon abonnement | P1 |

### Public (Non authentifié)
| ID | Story | Priorité |
|----|-------|----------|
| P1 | En tant que visiteur, je peux comprendre le produit via la landing page | P0 |
| P2 | En tant que visiteur, je peux m'inscrire ou me connecter | P0 |
| P3 | En tant que visiteur, je peux scanner un QR et voir le contenu sans compte | P0 |

---

## 4. Fonctionnalités MVP

### 4.1 Pipeline de création (Admin)
1. **Upload image** : Drag & drop, formats PNG/JPG/WEBP, max 10MB
2. **Détourage IA** : Suppression arrière-plan via `@imgly/background-removal` (client-side, gratuit)
3. **Génération QR** : QR code artistique via `qr-code-styling` avec silhouette en overlay, error correction H
4. **Export** : PNG (1024/2048px), SVG, lien scan unique

### 4.2 Éditeur de contenu (User)
- **Texte** : Message émotionnel, max 5000 caractères
- **Image** : Upload d'une photo personnelle
- **Lien** : URL YouTube pour vidéo embarquée
- **Preview** : Simulation temps réel du rendu mobile

### 4.3 Page de scan (Public)
- URL courte : `/{short_id}` (nanoid 10 caractères)
- Affichage du contenu personnalisé
- Invitation à créer un compte pour modifier

### 4.4 Authentification
- Email/mot de passe via Supabase Auth
- OAuth Google
- Deux rôles : `admin` et `user` (dans `profiles.role`)
- Code d'invitation requis pour inscription admin

### 4.5 Abonnements
- **Gratuit** : 3 designs QR, contenu dynamique, support email
- **Pro** (9.99€/mois) : 25 designs, exports haute résolution, analytics
- **Creator** (24.99€/mois) : Designs illimités, API access, priorité support

---

## 5. Architecture technique

### Stack
| Couche | Technologie |
|--------|-------------|
| Framework | Next.js 15 (App Router, TypeScript strict) |
| Base de données | Supabase PostgreSQL |
| Auth | Supabase Auth (email + OAuth Google) |
| Storage | Supabase Storage (images, exports) |
| Styling | Tailwind CSS v4 + design system custom |
| QR | qr-code-styling (client-side) |
| Détourage | @imgly/background-removal (client-side) |
| Hosting | Vercel |
| PWA | Service Worker + manifest.json |

### Structure des routes
```
/                        → Landing page
/login                   → Connexion
/signup                  → Inscription
/admin                   → Dashboard admin
/admin/create            → Pipeline création
/admin/designs           → Liste designs admin
/admin/designs/[id]      → Détail design
/admin/users             → Gestion utilisateurs
/user                    → Dashboard user
/user/designs            → Mes designs
/user/designs/[id]       → Éditer contenu
/user/integrations       → Intégrations cloud
/scan/[id]               → Page scan publique
/api/v1/scan/[id]        → API scan
/api/v1/upload           → API upload
/api/v1/designs          → API designs CRUD
/api/generate-mockup     → API mockup génération
```

---

## 6. Modèle de données

### Table `profiles`
| Colonne | Type | Description |
|---------|------|-------------|
| id | uuid (PK, FK auth.users) | ID utilisateur |
| email | text | Email |
| full_name | text | Nom complet |
| role | text | `admin` ou `user` |
| avatar_url | text | URL avatar |
| created_at | timestamptz | Date création |

### Table `designs`
| Colonne | Type | Description |
|---------|------|-------------|
| id | uuid (PK) | ID design |
| short_id | text (unique) | Nanoid 10 chars pour URL courte |
| admin_id | uuid (FK profiles) | Créateur admin |
| user_id | uuid (FK profiles) | Client assigné |
| title | text | Titre du design |
| original_image_url | text | Image originale uploadée |
| silhouette_url | text | Silhouette détourée |
| qr_image_url | text | QR code généré |
| status | text | `draft`, `active`, `archived` |
| scan_count | integer | Compteur de scans |
| created_at | timestamptz | Date création |
| updated_at | timestamptz | Dernière modification |

### Table `scan_content`
| Colonne | Type | Description |
|---------|------|-------------|
| id | uuid (PK) | ID contenu |
| design_id | uuid (FK designs) | Design associé |
| content_type | text | `text`, `image`, `link` |
| text_content | text | Message texte |
| image_url | text | URL image uploadée |
| link_url | text | URL YouTube/externe |
| updated_at | timestamptz | Dernière modification |

### Table `subscriptions`
| Colonne | Type | Description |
|---------|------|-------------|
| id | uuid (PK) | ID abonnement |
| user_id | uuid (FK profiles) | Utilisateur |
| plan | text | `free`, `pro`, `creator` |
| status | text | `active`, `cancelled`, `expired` |
| started_at | timestamptz | Début |
| expires_at | timestamptz | Expiration |

**RLS** : Row Level Security activé sur toutes les tables. Chaque utilisateur ne voit que ses propres données. Les admins ont accès étendu.

---

## 7. Flux utilisateur

### Flux Admin : Création d'un design
```
Upload image → Détourage IA (client) → Preview silhouette
→ Génération QR (client) → Preview QR
→ Export (PNG/SVG/lien) → Design enregistré en BDD
→ Partage du lien scan au client
```

### Flux User : Modification du contenu
```
Scan QR → Page scan publique → Invitation connexion
→ Dashboard → Sélection design → Éditeur contenu
→ Modification texte/image/lien → Preview temps réel
→ Sauvegarde → Contenu mis à jour instantanément
```

### Flux Public : Scan
```
Scan QR physique → Redirection /{short_id}
→ API résout short_id → Affichage contenu personnalisé
→ Incrémentation compteur scans
```

---

## 8. Métriques de succès

| Métrique | Objectif MVP |
|----------|-------------|
| Designs créés / mois | 50+ |
| Taux de scan par design | > 5 scans/design |
| Conversion visiteur → inscription | > 15% |
| Conversion free → pro | > 5% |
| Temps moyen création design | < 3 minutes |
| Uptime | > 99.5% |

---

## 9. Contraintes

- **Performance** : Détourage et QR generation client-side (pas de coût serveur)
- **PWA** : Installation mobile Android obligatoire, bottom nav, mode hors ligne basique
- **Sécurité** : RLS Supabase, validation Zod, pas d'injection SQL/XSS
- **Accessibilité** : Touch targets 48px minimum, contraste WCAG AA
- **Contenu** : Aucune image humaine/animale dans l'UI, uniquement produits POD
- **Bilingue** : Interface FR/EN, français par défaut
- **Responsive** : Mobile-first, breakpoints 375px / 768px / 1024px / 1440px

---

## 10. Risques

| Risque | Impact | Mitigation |
|--------|--------|------------|
| Détourage IA insuffisant sur photos complexes | Moyen | Permettre retouche manuelle future |
| QR trop stylisé = scan impossible | Haut | Error correction H + tests multi-lecteurs |
| Abus contenu après scan (contenu inapproprié) | Moyen | Modération + signalement |
| Performance glass/blur sur vieux mobiles | Moyen | Fallback sans blur, reduced-motion |
| Coût Supabase Storage | Faible | Compression images, quotas par plan |
