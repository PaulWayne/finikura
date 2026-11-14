# Mettre à jour Medusa sans perdre nos personnalisations

Une mise à jour de Medusa ne supprime aucun de nos ajouts. Tout ce que Fini Kura ajoute vit dans `apps/medusa/src`, et l'installation ne touche que `node_modules`. Le risque est ailleurs : Medusa peut changer un comportement sur lequel s'appuie un de nos ajouts. Les tests et les vérifications ci-dessous servent à le détecter avant la production.

## Ce qui est à nous, et ce qui peut casser

| Ajout | Fichiers | Ce qu'une mise à jour peut changer | Ce qui le détecte |
|---|---|---|---|
| Encart « Statut Fini Kura » et ses 4 actions | `src/admin/widgets/fini-kura-status.tsx`, `src/workflows/fk-status/`, `src/api/admin/orders/[id]/fini-kura-status/` | Les statuts natifs (paiement, livraison) sur lesquels le statut Fini Kura est calculé | `fk-status.spec.ts` (intégration) |
| Encart « Dernières commandes » | `src/admin/widgets/fini-kura-recent-orders.tsx`, `src/api/admin/fini-kura/recent-orders/` | Le nom des zones d'encart, l'ordre d'affichage (déjà changé en 2.22, voir plus bas) | `upgrade-guard.unit.spec.ts`, puis contrôle visuel |
| Page « Par téléphone » | `src/admin/routes/commandes-telephone/`, `src/api/admin/fini-kura/orders-by-phone/` | Le filtre sur l'adresse de livraison | `orders-by-phone.spec.ts` |
| Alerte e-mail de nouvelle commande, e-mails de compte | `src/modules/smtp-notification/`, `src/subscribers/`, `src/workflows/send-*.ts` | Les événements `order.placed`, invitations, mot de passe | `order-alert.spec.ts`, `admin-accounts.spec.ts`, tests unitaires des e-mails |
| Revalidation du site | `src/subscribers/revalidate-storefront.ts` | Les noms d'événements produit, stock et prix | Recette : un prix changé dans l'admin apparaît sur le site |
| Commande sans e-mail | utilisé par le site (`apps/storefront`) | Les champs exigés à la commande | `checkout.spec.ts`, e2e live |
| Traductions françaises de nos encarts | `src/admin/i18n/` | Le chargement des traductions d'extension | Contrôle visuel, admin en français |
| Données à nous | `metadata.confirmed_at` des commandes, `metadata` des produits (légendes de photos) | Rien : Medusa garde les métadonnées telles quelles | — |

On ne modifie jamais le code de Medusa lui-même : pas de correctif dans `node_modules`, pas d'import de fichiers internes (`dist/`), pas de `patch` pnpm. On n'utilise que l'API publique (`@medusajs/framework`, `@medusajs/medusa/core-flows`, `@medusajs/admin-sdk`, `@medusajs/ui`). C'est ce qui rend la mise à jour sûre.

## Procédure

1. Sur une branche dédiée (`medusa-2.x.y`), mettre **tous** les paquets `@medusajs/*` à la même version exacte dans `apps/medusa/package.json`, sans `^`. `@medusajs/ui` suit sa propre numérotation : prendre celle qu'exige la nouvelle version de `@medusajs/dashboard`.
2. Lire les notes de version de Medusa entre l'ancienne et la nouvelle version : chercher « breaking », « widget », « zone », « order », « fulfillment », « payment », « notification ».
3. `pnpm install`, puis dans `apps/medusa` :
   - `pnpm test:unit` (dont le garde-fou des zones d'encart) ;
   - `pnpm test:integration:ci` (statuts, téléphone, alerte, commande, comptes) ;
   - `pnpm typecheck`, `pnpm lint`, `pnpm build`.
4. À la racine : `pnpm test:e2e:live` (une commande complète du site jusqu'à Medusa).
5. Appliquer les migrations sur une copie de la base de production avant la vraie : `medusa db:migrate`.
6. Contrôle visuel dans l'admin, en français :
   - Commandes : l'encart « Dernières commandes » est là, une ligne ouvre la commande ;
   - une commande : l'encart « Statut Fini Kura » et ses boutons fonctionnent de « Nouvelle » à « Livrée et payée » ;
   - « Par téléphone » dans le menu Commandes ;
   - un prix changé dans l'admin apparaît sur le site après rechargement.
7. Seulement ensuite : fusion, puis déploiement (voir `deploiement.md`), sauvegarde de la base faite juste avant.

## Déjà vu : Medusa 2.22 et l'ordre des encarts

Depuis 2.22, l'admin a une mise en page personnalisable : les zones « before » et « after » ne fixent plus la position d'un encart, qui s'affiche après les blocs de Medusa. L'ordre se règle dans l'admin (icône des curseurs, en haut à droite) et s'enregistre dans la base. Une mise à jour garde ce réglage ; un encart dont la zone disparaît, lui, disparaît sans erreur, d'où le garde-fou `upgrade-guard.unit.spec.ts`.
