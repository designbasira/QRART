# Design System — Silhouette QR Live

> Les couleurs = Etsy. La sensation futuriste vient du glass + motion, pas des couleurs.

---

## 1. Color Tokens

### Light Mode — Etsy Premium

| Token | Value | Usage |
|-------|-------|-------|
| `color.background` | `#FFF8F3` | Page background, warm cream |
| `color.surface` | `#FFFFFF` | Card backgrounds, inputs |
| `color.surface_alt` | `#F5EFE6` | Alternate surface, hover states |
| `color.primary` | `#F1641E` | CTA buttons, active states, links |
| `color.primary_soft` | `#FFE6D6` | Primary bg soft (badges, pills, active nav bg) |
| `color.accent` | `#DDBEA9` | Decorative accents, step numbers, warm touches |
| `color.text.primary` | `#2C2C2C` | Headings, body text |
| `color.text.secondary` | `#6E6E6E` | Subtitles, descriptions, placeholders |
| `color.border` | `#E8E2D9` | Card borders, dividers, input borders |
| `color.success` | `#2E7D32` | Active status, checkmarks, positive |
| `color.warning` | `#ED6C02` | Warning states |
| `color.danger` | `#D32F2F` | Delete, danger zone, errors |
| `color.focus_ring` | `rgba(241, 100, 30, 0.35)` | Focus outlines |

### Dark Mode — Etsy Night

| Token | Value | Usage |
|-------|-------|-------|
| `color.background` | `#1E1C1A` | Page background, warm dark |
| `color.surface` | `#2A2725` | Card backgrounds |
| `color.surface_alt` | `#3A3531` | Alternate surface, hover |
| `color.primary` | `#FF8A4C` | CTA buttons, active states |
| `color.primary_soft` | `rgba(255, 138, 76, 0.18)` | Primary bg soft |
| `color.accent` | `#C6A58B` | Decorative warm accents |
| `color.text.primary` | `#F5F2EE` | Headings, body text |
| `color.text.secondary` | `#C8C3BD` | Subtitles, descriptions |
| `color.border` | `#3F3A36` | Card borders, dividers |
| `color.success` | `#43A047` | Active status |
| `color.warning` | `#FB8C00` | Warning states |
| `color.danger` | `#E53935` | Delete, danger zone |
| `color.focus_ring` | `rgba(255, 138, 76, 0.35)` | Focus outlines |

**Dark mode = warm (pas noir pur)**. Le fond `#1E1C1A` a une teinte brune chaude.

---

## 2. Typography

### Fonts

| Role | Font | Fallback | Usage |
|------|------|----------|-------|
| **Sans UI** (principal) | Plus Jakarta Sans | Inter, system-ui, sans-serif | Tout le texte d'interface |
| **Script emotion** | Caveat | cursive | Titres émotionnels, numéros d'étapes, accents handwritten |
| **Serif premium** (optionnel) | Playfair Display | Georgia, serif | Hero H1, titres sections landing |

### Type Scale (mobile-first)

| Token | Size | Usage |
|-------|------|-------|
| `display` | 44px | Hero headlines, landing H1 |
| `h1` | 34px | Page titles |
| `h2` | 26px | Section titles |
| `h3` | 20px | Card titles, subsections |
| `body` | 16px | Body text, descriptions |
| `caption` | 14px | Labels, secondary info |
| `micro` | 12px | Badges, timestamps, short_id |

### Font Weights

| Token | Value | Usage |
|-------|-------|-------|
| `regular` | 400 | Body text, descriptions |
| `medium` | 500 | Nav links, labels |
| `semibold` | 600 | Card titles, button text, section titles |
| `bold` | 700 | Page titles, hero headlines, stat numbers |

---

## 3. Spacing System (8pt grid)

| Token | Value | Usage |
|-------|-------|-------|
| `xs` | 4px | Inline spacing, icon gaps |
| `sm` | 8px | Tight component spacing |
| `md` | 16px | Standard padding, gaps |
| `lg` | 24px | Card padding, section gaps |
| `xl` | 32px | Section margins |
| `2xl` | 48px | Large section separations |
| `3xl` | 64px | Hero padding, major sections |

---

## 4. Border Radius (tres arrondi)

| Token | Value | Usage |
|-------|-------|-------|
| `radius.card` | 24px | Cards, conteneurs principaux |
| `radius.panel` | 28px | Panneaux sidebar, modals larges |
| `radius.button` | 18px | Boutons, CTAs |
| `radius.input` | 16px | Inputs, textareas, selects |
| `radius.modal` | 32px | Modals, dialogs |
| `radius.pill` | 999px | Badges, pills, toggles, avatars |

---

## 5. Glassmorphism Rules

> La "touch tech" — subtile pour performance PWA.

### Light Glass

```css
.glass-light {
  background: rgba(255, 255, 255, 0.62);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  border: 1px solid rgba(232, 226, 217, 0.70);
  background-image: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.75),
    rgba(255, 255, 255, 0.40)
  );
}
```

### Dark Glass

```css
.glass-dark {
  background: rgba(42, 39, 37, 0.58);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  border: 1px solid rgba(63, 58, 54, 0.75);
  background-image: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.08),
    rgba(255, 255, 255, 0.03)
  );
}
```

**Performance** : Limiter le nombre d'éléments avec `backdrop-filter` simultanément. Éviter le glass imbriqué (glass sur glass).

---

## 6. Shadow System (soft, Etsy premium)

| Token | Value | Usage |
|-------|-------|-------|
| `shadow.soft` | `0 8px 22px rgba(0,0,0,0.08)` | Cards au repos |
| `shadow.floating` | `0 18px 52px rgba(0,0,0,0.12)` | Cards hover, éléments flottants |
| `shadow.glass` | `0 10px 30px rgba(0,0,0,0.10)` | Panneaux glass |

---

## 7. Motion & Animation Tokens

> Fluides, pas "gaming". Subtiles et premium.

### Timing

| Token | Value | Usage |
|-------|-------|-------|
| `motion.fast` | `150ms ease-out` | Micro-interactions (toggle, pill) |
| `motion.normal` | `240ms cubic-bezier(0.22, 1, 0.36, 1)` | Transitions standard (hover, tab switch) |
| `motion.slow` | `420ms cubic-bezier(0.22, 1, 0.36, 1)` | Entrées, panneaux, modals |

### Interactions

| Token | Value | Usage |
|-------|-------|-------|
| `hover.scale` | `1.02` | Cards au hover |
| `card.float.y` | `-6px` | Cards lift on hover (`translateY(-6px)`) |
| `glass.fade` | opacity + blur | Apparition douce d'éléments glass |
| `scroll.parallax` | léger | Landing page uniquement |

### Stagger Animation
```css
.stagger > *:nth-child(1) { animation-delay: 0ms; }
.stagger > *:nth-child(2) { animation-delay: 80ms; }
.stagger > *:nth-child(3) { animation-delay: 160ms; }
.stagger > *:nth-child(4) { animation-delay: 240ms; }
.stagger > *:nth-child(5) { animation-delay: 320ms; }
.stagger > *:nth-child(6) { animation-delay: 400ms; }
```

### Keyframes
```css
@keyframes fade-in {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes slide-up {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes scale-in {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
```

**Respect `prefers-reduced-motion`** : Désactiver toutes les animations si l'utilisateur le demande.

---

## 8. Component Base Tokens

### Buttons

| Property | Value |
|----------|-------|
| Height | 48px |
| Padding-x | 20px |
| Border-radius | 18px |
| Font-weight | 600 |
| Font-size | 16px |
| Primary bg | `color.primary` |
| Primary text | `#FFFFFF` |
| Secondary bg | transparent |
| Secondary border | `color.border` |
| Secondary text | `color.text.primary` |
| Danger bg | transparent |
| Danger border | `color.danger` |
| Danger text | `color.danger` |
| Focus | `color.focus_ring` ring |
| Disabled | `opacity: 0.5; cursor: not-allowed` |

### Inputs

| Property | Value |
|----------|-------|
| Height | 48px |
| Border-radius | 16px |
| Background | `color.surface` |
| Border | 1px solid `color.border` |
| Focus | ring + border `color.primary` |
| Font-size | 16px |
| Padding-x | 16px |
| Placeholder | `color.text.secondary` |

### Cards / Glass Panels

| Property | Value |
|----------|-------|
| Padding | 24px |
| Border-radius | 24px (cards) / 28px (panels) |
| Glass | on by default |
| Border | 1px subtle (`color.border` at 70% opacity) |
| Shadow | `shadow.glass` |
| Hover | `translateY(-6px)` + `shadow.floating` |

### Mobile Bottom Bar

| Property | Value |
|----------|-------|
| Height | 72px |
| Background | glass (light or dark) |
| Icons | 24px |
| Labels | 12px |
| Active state | `color.primary` + pill highlight |
| Inactive state | `color.text.secondary` |
| Border-top | 1px `color.border` |
| Safe area | padding-bottom for iOS notch |

---

## 9. Dark Mode Mapping

| Trigger | Method |
|---------|--------|
| Auto | `prefers-color-scheme: dark` media query |
| Manuel | Toggle switch, préférence stockée dans `profiles` via Supabase |

**Classe racine** : `<html class="dark">` pour activer le dark mode.

**Transition** : `motion.normal` (240ms) pour le switch de thème.

**Le dark mode doit rester warm** : fond `#1E1C1A` (pas `#000000`), accents `#FF8A4C` (pas bleu froid).

---

## 10. Contraintes UI

| Contrainte | Règle |
|-----------|-------|
| Responsive | Mobile-first PWA (Android), breakpoints 375 / 768 / 1024 / 1440 |
| Navigation mobile | Bottom bar (72px), pas de hamburger menu |
| Navigation desktop | Icon sidebar (72px) ou text sidebar (260px) |
| Images | Uniquement produits POD (t-shirt, mug, cadre) |
| Interdit | Images humaines, animales, cartoon, stock non-POD |
| Touch targets | Minimum 48px sur mobile |
| Accessibilité | Contraste WCAG AA, focus visible, reduced-motion |
| Langue | FR par défaut, toggle EN disponible |
| Emotion | Premium, cadeau personnalisé, souvenir, chaleur Etsy |
| Performance | Glass subtil (max 3-4 éléments blur simultanés), lazy loading images |

---

## 11. Références visuelles

| Inspiration | Élément applicable |
|-------------|-------------------|
| Hero fashion premium (produit central, typo verticale géante) | Landing page hero |
| Floating glass UI elements, specs/attributs flottants | Landing page produits |
| Composants arrondis, ombres douces, layout modulaire | Mobile PWA cards |
| Dashboard sidebar icônes + widgets glass flottants (light) | User/Admin dashboard light |
| Dashboard dark warm + glass panels + accents vibrants | User dashboard dark mode |
