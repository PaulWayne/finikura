# Fixtures du mode mock

Ces fichiers alimentent le site quand `COMMERCE_SOURCE=mock` ou `CONTENT_SOURCE=mock`. Les seeds de Medusa et de Strapi les lisent aussi : le mode mock, les bases de développement et l'e2e en mode live partagent donc les mêmes données.

## Règles
- Chaque fichier a exactement la forme d'une réponse réelle : Medusa Store API 2.22 pour `medusa/`, Strapi 5 REST (réponses à plat) pour `strapi/`. Le mode mock et le mode live passent par les mêmes mappers.
- Les handles sont les mêmes que ceux des seeds. Le handle est la seule clé commune entre Medusa et Strapi.
- Les fixtures sont des données de démonstration. Les vraies données viennent de l'admin, et le seed ne remplace jamais ce que la gérante a saisi.

## Contenu
| Fichier | Contenu |
|---|---|
| `medusa/products.json` | 18 produits (10 Filles, 8 Garçons), 6 tailles chacun, prix de démonstration entre 8 500 et 16 500 FCFA. Certaines tailles sont à 0 en stock, pour tester l'état épuisé. |
| `medusa/categories.json` | Filles et Garçons, avec la tranche d'âge, l'accroche et l'image de la carte de l'accueil. |
| `medusa/collections.json` | Nouveautés, Tabaski & Fêtes (`tabaski-2027`), Les Essentiels. |
| `strapi/global-settings.json` | Réglages globaux, dont le numéro WhatsApp de test. |
| `strapi/home.json` | Les blocs de l'accueil. |
| `strapi/editorial-pages.json` | Notre histoire, Livraison et échanges, Contact, Mentions légales. |
| `strapi/campaigns.json` | Une campagne Tabaski 2027, mise en avant sur l'accueil pendant ses dates. |
| `strapi/category-banners.json` | Les bandeaux des pages Filles et Garçons (FK-40). |
| `strapi/size-guides.json` | Le guide des tailles par catégorie, avec des mesures indicatives (les vraies arrivent avec FK-15). |

## Valeurs provisoires
- **Tailles :** « 3-4 ans » à « 13-14 ans », en attendant les tailles exactes du stock de la cliente (FK-19). Les filtres d'âge des pages catégorie sont tirés des variantes : ils suivront d'eux-mêmes.
- **Matières et conseils d'entretien :** vides. Ils viendront des données de production (FK-04).
- **Numéro WhatsApp :** numéro de test, à remplacer dans l'admin Strapi avant la mise en ligne.
- **Images :** copies des images de la maquette, dans `public/mock-media/`. En mode live, les seeds les envoient dans le stockage d'objets (Garage), et les URL deviennent `MEDIA_PUBLIC_URL/...`. Elles seront remplacées par les vraies photos (FK-15).

## Ce qui n'a pas été repris des maquettes
Les maquettes contenaient des promesses que la cliente n'a pas validées. Elles ne figurent ni dans les fixtures ni sur le site (voir CLAUDE.md, « À ne pas faire ») :
- délais et tarifs de livraison (« sous 24 à 48 h », « par coursier dédié ») ;
- règle d'échange (« échange sous 7 jours », « sans frais sous 48 h »), en attente de la cliente (FK-05) ;
- moyens de paiement précis (Orange Money) : le site dit seulement « paiement à la réception » ;
- matières et labels (« 100 % lin pur », « teintures végétales ») ;
- témoignages et avis étoilés inventés : de vrais avis pourront venir avec FK-34 ;
- adresse et téléphones de l'atelier fictifs ;
- commande de démonstration à numéro fixe : chaque commande est créée par le parcours réel.

## Choix faits entre maquettes
- « Robe Cérémonie Poudrée » (accueil, 16 500 FCFA) et « Robe Poudrée en Lin » (catalogue, 14 500 FCFA) : la version du catalogue est gardée, sous le handle `robe-poudree-en-lin`.
- Les produits qui ne figuraient que sur la version ordinateur ou que sur la version mobile du catalogue Filles sont tous gardés, ce qui donne 10 produits Filles.
- Le prix de l'« Ensemble Cérémonie Terracotta » est aligné sur sa fiche : 15 000 FCFA.

L'inventaire détaillé de chaque écran de la maquette est dans l'historique git de ce fichier.
