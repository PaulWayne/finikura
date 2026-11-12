# Fini Kura

Site e-commerce de vêtements pour enfants de 3 à 14 ans, vendus à Bamako (6 500 à 15 000 FCFA).
Commande sans compte ni e-mail, confirmation par lien WhatsApp, paiement à la réception.
Lancement : 1er décembre 2026. Cahier des charges : https://claude.ai/artifact/Hb1QZvdjcUdgLohxFiJTE7

## Commandes
- Node 22.23.4 (`.nvmrc`), pnpm 12
- `docker compose up -d` : PostgreSQL 16 (port 5434, bases `medusa` et `strapi`) + Redis 7 (port 6380)
- `pnpm dev` : front (3100), Medusa (9000, admin `/app`) et Strapi (1337, admin `/admin`)
- `pnpm --filter storefront dev | build | lint | typecheck`
- `pnpm --filter medusa seed`, `pnpm --filter strapi seed` (idempotents, lisent les fixtures du front)
- Tests manuels Medusa : `apps/medusa/integration-tests/manual/*.mjs`

## Dépôt
- `apps/storefront` : Next.js (App Router), TypeScript strict, Tailwind, shadcn/ui
- `apps/medusa` : Medusa v2 (vente)
- `apps/strapi` : Strapi v5 (contenu)
- Dans le front :
  - `src/lib/commerce` (Medusa) et `src/lib/content` (Strapi), chacun avec `types.ts`, `raw.ts`, `mappers.ts`, `mock.ts`, `live.ts`, `index.ts` ;
  - `src/mocks/{medusa,strapi}` : fixtures, mêmes handles que les seeds ;
  - `src/messages/fr.ts` : les petits textes d'interface.

## Règles du front
- Les pages et layouts sont des Server Components, sans `"use client"`. L'interactivité vit dans de petits composants client.
- Aucun contenu en dur : le contenu vient de Strapi ou de Medusa, les petits textes de `fr.ts`.
- Les données passent toujours par les services, jamais par un appel direct. Chaque service commence par `import "server-only"`.
- La bascule `COMMERCE_SOURCE` / `CONTENT_SOURCE` = `mock | live`. Le mode mock doit toujours fonctionner.
- Les fixtures ont exactement la forme des réponses réelles (Medusa Store API, Strapi 5 REST) : mock et live passent par les mêmes mappers.
- Cache : `"use cache"` + tags `commerce:catalog` et `content`. Medusa (subscriber) et Strapi (eventHub) appellent `POST /api/revalidate?source=medusa|strapi` avec l'en-tête `x-revalidate-secret`.
- Les mutations passent par des Server Actions. L'identifiant du panier est stocké dans un cookie httpOnly.
- Les couleurs passent uniquement par les tokens Tailwind de la charte. Pas de bleu marine ni de noir, et le rose est réservé au logo.
- Mobile d'abord, moins de 1 Mo au premier chargement, zones tactiles d'au moins 44 px, contraste AA.

## Medusa / Strapi
- Medusa porte ce qui se vend : produits, variantes par âge, prix XOF, stock, catégories `filles`/`garcons`, collections, étiquettes d'occasion, panier, commandes.
- Strapi porte ce qui raconte : réglages globaux, accueil en blocs, pages, campagnes, guides des tailles.
- Le handle est la seule clé commune. Medusa décide si un produit existe. Un contenu qui pointe vers une collection absente ne s'affiche pas, sans planter la page.
- Rien n'est recopié dans Strapi : ni prix, ni stock, ni nom de produit. En cas de doute sur la commande ou le paiement, Medusa fait foi.
- Medusa et Strapi ne communiquent pas entre eux : c'est le front qui assemble.
- Commande : Nom → `first_name`, Téléphone → `phone`, Quartier → `address_1`, Repères → `address_2`, city « Bamako », country_code `ml`. Pas d'e-mail, ni demandé ni fabriqué.
- Statuts et actions Medusa : voir le tableau du cahier des charges. Un fulfillment n'est marqué expédié qu'à la livraison.

## Conventions
- Interface en français. Code et noms techniques en anglais.
- Prix en XOF entiers, affichés uniquement avec `formatPrice` (« 12 500 FCFA »).
- Téléphone : +223 suivi de 8 chiffres. Coordonnées mémorisées en localStorage sur le téléphone de la cliente.
- Vérifier Medusa et Strapi dans la doc de la version installée, pas de mémoire.

## À ne pas faire
- Afficher un tarif de livraison, ou promettre ce que la cliente n'a pas validé : délais, règle d'échange, matières, moyens de paiement.
- Ajouter une fonctionnalité absente du cahier des charges : on la met dans BACKLOG.md.
- Mettre un secret dans le code. Les variables vont dans `.env.example`.
- Pousser, ou créer des issues GitHub, sans accord.
