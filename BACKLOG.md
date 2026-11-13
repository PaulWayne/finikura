# Backlog Fini Kura

État au 12 novembre 2026, après l'étape 4 (front Next.js branché sur Medusa 2.22.6 et Strapi 5.61.1). Lancement : 1er décembre 2026.

- **Priorité :**
  - P0 : indispensable pour le 1er décembre ;
  - P1 : juste après le lancement ;
  - P2 : plus tard.
- **Taille :**
  - S : moins d'une demi-journée ;
  - M : 1 à 2 jours ;
  - L : 3 jours ou plus.
- **Origine :**
  - « État des lieux » : écart relevé à l'étape 1 ;
  - « Cahier des charges » : exigence du brief ;
  - « Cliente » : décision en attente ;
  - « Étapes 3-4 » : constat fait pendant l'installation et le branchement.

Les éléments ne sont pas encore des issues GitHub. On les crée seulement après accord.

## Récapitulatif

| ID | Titre | Prio | Taille | Dépend de |
|---|---|---|---|---|
| FK-01 | Message WhatsApp complet et numéro depuis Strapi | P0 | M | — |
| FK-02 | Coordonnées mémorisées en localStorage | P0 | S | — |
| FK-03 | Pages éditoriales depuis Strapi | P0 | L | FK-15 pour le contenu final |
| FK-04 | Retrait des promesses non validées | P0 | M | — |
| FK-05 | Règle d'échange unique ou retirée | P0 | S | Cliente : règle d'échange, FK-04 |
| FK-06 | Encart « Statut Fini Kura » dans l'admin Medusa | P0 | L | — |
| FK-07 | Alerte e-mail à chaque nouvelle commande | P0 | M | FK-09 |
| FK-08 | Comptes de l'admin (la cliente, sa sœur) | P0 | S | FK-09 |
| FK-09 | Hébergement, domaine, HTTPS, sauvegardes, Redis | P0 | L | — |
| FK-10 | Statistiques de visites | P0 | S | FK-09 |
| FK-11 | Contraste AA et focus visibles | P0 | M | FK-12 |
| FK-12 | Couleurs uniquement par les tokens de la charte | P0 | L | — |
| FK-13 | Pages introuvables : vrai statut 404 | P0 | S | — |
| FK-14 | Vérifications restantes dans l'admin et WhatsApp | P0 | S | FK-01 |
| FK-15 | Contenu réel (photos, guide des tailles) | P0 | M | Données de production |
| FK-16 | Historique des commandes par téléphone dans l'admin | P1 | M | FK-06 |
| FK-17 | Page campagne | P1 | M | — |
| FK-18 | Ménage Medusa : canal et clé par défaut | P1 | S | — |
| FK-19 | Tranches d'âge des variantes | P1 | S | Cliente : tranches d'âge |
| FK-20 | Bouton WhatsApp flottant | P1 | S | FK-01 |
| FK-21 | Qualité du code front (lint, gros composants) | P1 | M | — |
| FK-22 | Tests automatisés | P1 | M | — |
| FK-23 | Accès à la page de confirmation | P1 | S | — |
| FK-24 | Diaspora : région Europe en euros, Wero | P2 | L | FK-25 |
| FK-25 | Paiement en ligne | P2 | L | — |
| FK-26 | Comptes clients | P2 | L | — |
| FK-27 | Coût et marge par article | P2 | M | Cliente : coût et marge |
| FK-28 | CI sur Forgejo | P2 | M | FK-22, FK-29, FK-35 |
| FK-29 | PostgreSQL en conteneur pour les tests Medusa | P2 | S | FK-22 |
| FK-30 | Statistiques : ajouts au panier, commandes, clics WhatsApp | P2 | S | FK-10 |
| FK-31 | Bouton « Demander à un proche » (partage WhatsApp du produit) | P1 | S | — |
| FK-32 | Bouton « Une question sur la taille ? » (WhatsApp prérempli) | P1 | S | FK-01 |
| FK-33 | Photos portées avec l'âge et la taille de l'enfant | P1 | S | FK-15, cliente : photos |
| FK-34 | Avis et photos des clientes | P2 | M | Cliente : accord des clientes |
| FK-35 | Parcours e2e en mode live (front + Medusa + Strapi, seeds) | P2 | M | FK-29 |

**Charge P0 :** 4 L, 5 M et 6 S. Cela fait environ 20 à 25 jours de travail pour une personne seule. Or il reste 19 jours calendaires, et une partie dépend des réponses de la cliente.

**Décision du 12 novembre 2026 :** tout le périmètre P0 est maintenu pour le 1er décembre, sans réduction. Le planning n'a donc pas de marge, et les réponses de la cliente (section « En attente de la cliente ») sont sur le chemin critique. Il faut les obtenir au plus tôt.

---

## P0 : indispensable pour le 1er décembre

### FK-01 · Message WhatsApp complet et numéro depuis Strapi
**Description.** Aujourd'hui, le lien de confirmation n'envoie que le numéro de commande. Le cahier des charges exige les articles, les tailles et le total. Il reste aussi 10 numéros fictifs ou écrits en dur dans le code (`22370000000`, `22376458912`). Le numéro doit venir des réglages globaux Strapi (`whatsapp_number`).

**Critères d'acceptation**
- [ ] Le message pré-rempli contient :
  - le numéro de commande (FK-…) ;
  - chaque article avec sa taille et sa quantité ;
  - le total au format `formatPrice` ;
  - le nom, le quartier et les repères.
- [ ] Le numéro de destination est celui saisi dans Strapi. Une recherche de `wa.me/` et de `223` dans `apps/storefront/src`, hors `mocks`, ne trouve plus aucun numéro en dur.
- [ ] Si le numéro est vide dans Strapi, le bouton ne s'affiche pas et la page ne plante pas.
- [ ] Le lien s'ouvre sur un téléphone Android et un iPhone avec le message complet. Les accents et les sauts de ligne sont bien encodés.

**Taille** M · **Dépend de** — (numéro de test en place) · **Origine** état des lieux (bloquant), cahier des charges

### FK-02 · Coordonnées mémorisées en localStorage
**Description.** Le nom, le téléphone, le quartier et les repères doivent être pré-remplis à la commande suivante, sur le même téléphone. Rien n'est mémorisé aujourd'hui.

**Critères d'acceptation**
- [x] Après une commande réussie, les quatre champs sont enregistrés dans le localStorage, et seulement eux.
- [x] À la visite suivante, le formulaire est pré-rempli et chaque champ reste modifiable.
- [x] Le site fonctionne si le localStorage est indisponible (navigation privée) : lecture et écriture sont protégées par try/catch.
- [x] Rien n'est enregistré si la commande échoue.

**Fait (branche `fk-13-fk-02`).** Les champs sont enregistrés sous la clé `fk_contact` et relus avec le même schéma que le formulaire : un contenu corrompu est ignoré.

**Taille** S · **Dépend de** — · **Origine** état des lieux (bloquant), cahier des charges

### FK-03 · Pages éditoriales depuis Strapi
**Description.** Les pages Notre histoire, Livraison et échanges, Contact, Guide des tailles et Mentions légales sont encore écrites en dur dans les composants. Pourtant, les pages Strapi et les guides des tailles existent et sont servis par `contentService.getEditorialPage` et `getAllSizeGuides`. Il faut rendre ces pages à partir des blocs, et ajouter la page Mentions légales dans Strapi.

**Critères d'acceptation**
- [ ] Chaque page lit son contenu par `contentService`. Les composants ne contiennent plus de texte éditorial, seulement les petits textes de `fr.ts`.
- [ ] Une modification publiée dans Strapi apparaît sur la page sans redéploiement (revalidation `content`).
- [ ] Une page absente de Strapi renvoie 404 (voir FK-13).
- [ ] Le mode mock affiche les mêmes pages à partir de `src/mocks/strapi`.

**Taille** L · **Dépend de** FK-15 pour le contenu final · **Origine** état des lieux (bloquant)

### FK-04 · Retrait des promesses non validées
**Description.** Il reste 31 occurrences de promesses que la cliente n'a pas validées : « TVA incluse », « Orange Money » ou « Moov Money », « 24 à 48 h », « sous 24 h », « 7 jours », « 14 jours », « 48 h », « 100 % lin », « Validés avec l'adresse ». S'y ajoutent les mentions inventées de l'étape 1 (atelier certifié, teintures végétales, adresse et e-mail fictifs), et tout ce qui contredit le questionnaire de la cliente. Celle-ci vit en Europe et n'a parlé ni d'atelier à Bamako, ni de lin, ni d'artisans : « créées à Bamako », « maîtres artisans », « maison installée au cœur de Bamako » doivent disparaître. Les seules mentions décidées sont « Paiement à la réception » et « Livraison à votre charge, montant confirmé sur WhatsApp ».

**Critères d'acceptation**
- [x] Une recherche de ces expressions dans `apps/storefront/src` et dans le contenu Strapi ne trouve plus rien.
- [x] Le panier et la commande affichent exactement « Livraison à votre charge, montant confirmé sur WhatsApp ». Aucun montant de livraison n'apparaît nulle part.
- [x] Le bandeau « Article ajouté avec succès » du panier ne contient plus de promesse.
- [x] Les textes de repli des mappers sont vides, et jamais inventés.

**Taille** M · **Dépend de** — · **Origine** état des lieux, cahier des charges

**Fait (branche `fk-04-fk-05`).** Les matières et les conseils d'entretien des produits sont vidés : ils viendront des données de production. Les accordéons correspondants ne s'affichent que si Medusa les renseigne. Restent à voir avec la cliente :
- les handles contiennent encore « lin » (par exemple `robe-poudree-en-lin`). Ils servent de clé commune avec Strapi et seront remplacés avec les vrais produits ;
- les étiquettes « BEST-SELLER » et « NOUVEAUTÉ » des fixtures ne reposent sur aucune donnée de vente ;
- un prix de fixture (16 500 FCFA) dépasse la fourchette du questionnaire (15 000 FCFA au plus).

### FK-05 · Règle d'échange unique ou retirée
**Description.** Le site annonce tantôt 7 jours, tantôt 48 h, tantôt 14 jours. Tant que la cliente n'a pas fixé la règle, la mention « Échange possible » est retirée. Ensuite, la règle est écrite une seule fois, dans Strapi.

**Questions à poser à la cliente :**
1. Échange seulement (autre taille ou autre article), ou aussi remboursement ?
2. Délai, à compter de la livraison ?
3. Conditions : non porté, non lavé, étiquettes attachées ?
4. Exclusions : articles en promotion, tenues de cérémonie ?
5. Qui paie le second trajet du coursier : la cliente, la boutique, ou la boutique seulement en cas d'erreur ?
6. Procédure : demande sur WhatsApp avec le numéro de commande, puis passage du coursier ?
7. Si la taille voulue est épuisée : avoir, autre article, ou remboursement ?

Dans Medusa 2.22.6, un échange se gère depuis la fiche commande (retour de l'article, nouvel article, différence de prix). Je vérifierai la procédure dans l'admin installée avant de la documenter pour la cliente.

**Critères d'acceptation**
- [x] Une seule règle d'échange existe, saisie dans Strapi, ou aucune mention d'échange n'est affichée.
- [x] Les fiches produit, le panier, la page Livraison et échanges et la confirmation sont cohérents.

**État.** Mention retirée partout, en attente de la règle. Quand la cliente la donne, elle s'écrit dans le bloc « Échanges » de la page Strapi `livraison-et-echanges`, et nulle part ailleurs.

**Taille** S · **Dépend de** Cliente : règle d'échange, FK-04 · **Origine** état des lieux (bloquant), cliente

### FK-06 · Encart « Statut Fini Kura » dans l'admin Medusa
**Description.** Un widget sur la fiche commande de l'admin affiche le statut Fini Kura en français, avec un bouton par étape. Chaque bouton appelle une route admin qui exécute un workflow enchaînant les actions du tableau des statuts du cahier des charges. Les étapes 3 et 4 ont vérifié par un test réel l'ordre des actions sur le stock (script manuel, remplacé par `integration-tests/http/fk-status.spec.ts` dans FK-22).

| Bouton | Actions Medusa | Stock |
|---|---|---|
| Confirmée sur WhatsApp | `metadata.confirmed_at` sur la commande | reste réservé |
| Partie en livraison | création du fulfillment, **non** marqué expédié | sort du stock |
| Livrée et payée | marqué expédié et livré, paiement capturé, commande complétée | sortie définitive |
| Refusée | annulation du fulfillment s'il existe, puis de la commande | remis en stock |

**Critères d'acceptation**
- [x] Le widget affiche « Nouvelle », « Confirmée sur WhatsApp », « En livraison », « Livrée et payée » ou « Refusée ou annulée », calculé à partir de l'état Medusa.
- [x] Seuls les boutons possibles sont actifs. Par exemple, « Livrée et payée » n'est actif qu'en livraison, et « Refusée » ne l'est plus une fois la commande livrée.
- [x] Chaque bouton passe par un workflow, avec retour arrière en cas d'erreur, et non par des appels directs aux modules.
- [x] Un refus à la porte, après « Partie en livraison », remet la pièce en stock. C'est vérifié par un test.
- [x] Le fulfillment n'est jamais marqué expédié avant « Livrée et payée ».
- [x] Les libellés sont en français. Le statut natif de Medusa reste visible.

**Fait (branche `fk-06`).** Le calcul du statut est dans `apps/medusa/src/lib/fk-status.ts`. Les quatre workflows sont dans `src/workflows/fk-status/` : ils composent les workflows natifs avec `runAsStep`, et revérifient que l'action est permise. La route est `GET|POST /admin/orders/:id/fini-kura-status`, et le widget est placé dans la zone `order.details.before`. Le test manuel de l'époque (remplacé par `integration-tests/http/fk-status.spec.ts` dans FK-22) donnait ces résultats :
- au départ en livraison, le stock baisse de 1 et rien n'est expédié ;
- « Livrée et payée » donne completed, delivered et captured ;
- un refus après le départ remet la pièce en stock ;
- une action interdite renvoie 400.

L'affichage du widget dans l'admin a été vérifié.

**Taille** L · **Dépend de** — · **Origine** cahier des charges

### FK-07 · Alerte e-mail à chaque nouvelle commande
**Description.** Un subscriber `order.placed` envoie un e-mail à la cliente, c'est-à-dire la gérante. Il contient le numéro, les articles, les tailles, le total, le nom, le téléphone et le quartier, avec un lien vers la commande dans l'admin. Il faut choisir un fournisseur d'e-mail (module Notification de Medusa) et lui créer un compte, ce qui demande ton accord. Les acheteuses ne reçoivent pas d'e-mail, puisqu'on ne leur en demande pas.

**Critères d'acceptation**
- [x] Une commande passée sur le site envoie un e-mail à chaque utilisateur de l'admin (provider SMTP Hostinger, template react-email).
- [ ] Reçu en moins d'une minute : à vérifier au déploiement (FK-09), avec la boîte Hostinger.
- [x] L'e-mail est en français, les montants sont en FCFA sans décimales.
- [x] Un échec d'envoi n'empêche pas la commande et apparaît dans les journaux.
- [x] La clé du fournisseur n'est que dans les variables d'environnement, et le nom de la variable figure dans `.env.example`.

**Fait** : `src/modules/smtp-notification` (provider SMTP, template `order-placed.tsx`, aperçu `pnpm --filter medusa email:dev`), workflow `send-order-alert`, subscriber `order-placed-alert`. Sans `SMTP_HOST`, l'e-mail s'affiche dans la console (provider local). Plus tard, si la gérante le demande : objet et introduction modifiables depuis Strapi.

**Taille** M · **Dépend de** FK-09 · **Origine** cahier des charges

### FK-08 · Comptes de l'admin
**Description.** Les comptes de la cliente et de sa sœur sont créés par invitation dans l'admin Medusa, et le compte éditeur de chacune dans l'admin Strapi. Le compte de développement (`admin@finikura.test`) n'existe pas en production.

**Critères d'acceptation**
- [ ] Les deux personnes se connectent à l'admin Medusa et à l'admin Strapi, en français, avec leur propre mot de passe.
- [ ] Aucun compte de développement ni mot de passe partagé en production.
- [x] Une courte fiche explique comment réinitialiser un mot de passe (`docs/fiche-acces.md`).

**Fait** : e-mails d'invitation et de nouveau mot de passe de l'admin Medusa (templates `user-invite` et `password-reset`, subscribers), « Mot de passe oublié » de Strapi par la même boîte SMTP, marche à suivre sans mot de passe imposé dans `docs/deploiement.md`. **Reste au déploiement** : créer les comptes et cocher les deux premiers critères.

**Taille** S · **Dépend de** FK-09 · **Origine** cahier des charges

### FK-09 · Hébergement, domaine, HTTPS, sauvegardes, Redis
**Description.** Il faut mettre en production le front, Medusa, Strapi, PostgreSQL et Redis :
- un nom de domaine et le HTTPS ;
- des sauvegardes quotidiennes de PostgreSQL (bases `medusa` et `strapi`) et des médias Strapi, conservées hors du serveur ;
- les modules Redis de Medusa (bus d'événements, verrous, cache). Aujourd'hui, Medusa tourne en mémoire, ce qui ne convient pas en production.

Chaque choix (hébergeur, registraire) demande ton accord, car il implique un compte et un coût.

**Décidé (12 novembre 2026).**
- **Hébergement :** sur le VPS Hostinger existant, géré avec Dokploy. D'autres sites tournent déjà sur ce serveur : les ports, les noms de conteneurs, les volumes et les bases ne doivent pas entrer en conflit avec eux, et il faut vérifier la mémoire disponible.
- **Domaine et e-mail :** la cliente choisit entre `fini-kura.fr` et `finikura.fr`.

**Critères d'acceptation**
- [ ] Le site répond en HTTPS sur le domaine, et le HTTP redirige vers le HTTPS.
- [ ] Les URL de production sont dans les variables d'environnement : `MEDUSA_BACKEND_URL`, `STRAPI_URL`, `STOREFRONT_REVALIDATE_URL`, CORS. Aucun secret n'est dans le dépôt.
- [ ] Medusa démarre avec Redis : plus de message « fake redis » ni « in-memory locking » dans les journaux.
- [ ] Une sauvegarde a lieu chaque nuit. Une restauration a été testée sur une base vide, en relançant le site dessus.
- [ ] La revalidation Medusa → front et Strapi → front fonctionne en production, avec le secret partagé.
- [ ] Le site est en mode live (`COMMERCE_SOURCE=live`, `CONTENT_SOURCE=live`).

**Avancement (branche `fk-09`).**
- **Préparé :** Redis dans Medusa (vérifié en dev), le `Dockerfile` avec une cible par appli, `infra/dokploy/docker-compose.prod.yml` et son `.env.example`, les scripts `infra/backup/` (sauvegarde et restauration testées), et la doc `docs/deploiement.md`.
- **Non résolu :** dans l'image de production, Medusa n'arrive pas à se connecter à PostgreSQL pour ses migrations (expiration au bout de 10 s), alors qu'une connexion directe depuis le même conteneur fonctionne. `ssl_mode=disable` ne suffit pas. À diagnostiquer sur le VPS.
- **Reste à faire :** le domaine, la destination des sauvegardes hors du serveur, et la mise en ligne.

**Taille** L · **Dépend de** — · **Origine** cahier des charges, étapes 3-4 (Redis)

### FK-10 · Statistiques de visites
**Description.** Un outil de mesure d'audience léger, sans cookie de préférence, pour ne pas imposer de bandeau de consentement. Il doit respecter la limite de 1 Mo au premier chargement.

**Critères d'acceptation**
- [ ] Les visites et les pages vues remontent dans un tableau de bord accessible à la cliente.
- [x] Le script pèse moins de 5 Ko et ne bloque pas l'affichage.
- [x] Aucune donnée personnelle (téléphone, nom) n'est envoyée à l'outil.

**Fait** : Umami 3.4.1 auto-hébergé (`stats.DOMAIN`, base `umami`, sauvegardée chaque nuit), composant `Analytics` chargé après l'affichage et seulement si `UMAMI_SCRIPT_URL` et `UMAMI_WEBSITE_ID` sont définis. Vérifié en local le 13/11/2026 avec un Umami jetable : script de 4,7 Ko (2,3 Ko compressé), aucun cookie, seuls les chemins des pages et les `utm_*` sont stockés, aucune trace du nom, du téléphone ni du quartier après une commande test. **Reste au déploiement** : créer le site et le compte de la gérante dans Umami, puis cocher le premier critère. Les événements (panier, commande, WhatsApp) sont dans FK-30.

**Taille** S · **Dépend de** FK-09 · **Origine** cahier des charges

### FK-11 · Contraste AA et focus visibles
**Description.** Voici les écarts relevés à l'étape 1 :
- texte crème sur le bandeau sauge : 2,5:1 ;
- texte blanc sur terracotta : 3,5:1 ;
- 16 textes en opacité réduite ;
- 9 `outline-none` sans style de remplacement.

Il faut aussi ajouter `aria-invalid`, `aria-describedby` et `autocomplete` au formulaire de commande.

**Critères d'acceptation**
- [x] Tous les textes atteignent au moins 4,5:1, ou 3:1 pour les grands textes. Le contrôle se fait avec un outil de contraste sur l'accueil, une catégorie, une fiche produit, le panier et la commande.
- [x] Chaque élément interactif a un focus visible au clavier.
- [x] Les champs en erreur sont annoncés par les lecteurs d'écran.
- [x] Les zones tactiles font toujours au moins 44 px.

**Fait (branche `fk-11`).** Le texte est en brun `brand-text`, ou en blanc sur fond taupe. Les accents (terracotta, sauge, bleu, vert WhatsApp) ne servent plus qu'aux fonds clairs, aux points, aux icônes et aux bordures. Le bandeau passe en sauge clair, les badges ont un point de couleur, et le bouton WhatsApp est taupe avec l'icône dans un rond vert. Le focus est global (`:focus-visible` en taupe). Les petits boutons-icônes ont une zone tactile élargie (`.touch-area`). ESLint interdit désormais `text-brand-text/10` à `/80` et un `outline-none` sans `focus-visible:`. Exceptions WCAG : le logo, les boutons désactivés et les liens du fil d'Ariane, qui sont en ligne.

**Taille** M · **Dépend de** FK-12 · **Origine** état des lieux, CLAUDE.md

### FK-12 · Couleurs uniquement par les tokens de la charte
**Description.** Le code contient environ 1 900 couleurs écrites en dur, dont des teintes hors charte : `#231A10`, quasi noir, et `#304054`, bleu marine hors du logo. Toutes doivent passer par les tokens Tailwind de la charte. Le rose reste réservé au logo.

**Critères d'acceptation**
- [x] Une recherche des codes `#xxxxxx` dans `apps/storefront/src/components` et `src/app` ne trouve plus rien en dehors du logo.
- [x] Aucun noir ni bleu marine n'est affiché, et le rose n'apparaît que dans le logo.
- [x] Les tokens correspondent aux codes couleur validés par la cliente.

**Fait (branche `fk-12`).**
- 595 couleurs en dur et 54 couleurs Tailwind par défaut (`white`, `stone`) sont remplacées par les tokens `brand-*`. Les 35 teintes utilisées sont ramenées aux 7 de la charte, plus `brand-white` pour le texte sur les boutons.
- Le quasi-noir `#231A10` et les gris deviennent `brand-text`. Les erreurs passent en terracotta (fond `brand-terracotta/15`).
- Le logo est isolé dans `components/layout/Logo.tsx`, seul fichier autorisé à utiliser le rose et le bleu marine.
- Une règle ESLint (`no-restricted-syntax`) interdit désormais les `#xxxxxx` et les couleurs Tailwind par défaut dans `src/`.

**Taille** L · **Dépend de** — (palette confirmée par `DESIGN.md`) · **Origine** état des lieux, CLAUDE.md

### FK-13 · Pages introuvables : vrai statut 404
**Description.** Les étapes 3 et 4 renvoient désormais 404 pour les URL inconnues. Il faut vérifier et garantir le même comportement pour un produit, une catégorie ou une page Strapi inexistants (`notFound()`), avec un titre de page propre.

**Critères d'acceptation**
- [x] `/produit/inexistant`, `/categorie/inexistante` et une page Strapi supprimée affichent la page « introuvable » de la charte.
- [x] Un produit dépublié dans Medusa disparaît du site après revalidation, et son URL affiche la page « introuvable ».

**Fait (branche `fk-13-fk-02`).** Le statut HTTP dépend du type de page :
- pages éditoriales et URL inconnues : vrai statut 404 ;
- produits et catégories : la page « introuvable » de la charte, avec `noindex`, mais un statut 200. Avec Cache Components, Next 16 a déjà envoyé l'en-tête quand il découvre que le handle n'existe pas, et il refuse le build si la vérification est placée avant le `<Suspense>`. Les moteurs de recherche n'indexent pas ces pages.

**Reste possible (P2) :** un vrai 404 pour les produits et les catégories, avec une vérification du handle dans le proxy Next, avant le rendu. Décidé le 12 novembre 2026 : pas pour le lancement.

**Taille** S · **Dépend de** — · **Origine** état des lieux

### FK-14 · Vérifications restantes dans l'admin et WhatsApp
**Description.** Trois points du brief n'ont pas été testés à l'étape 4.

**Critères d'acceptation**
- [x] Dans l'admin Medusa, les prix et totaux d'une commande s'affichent en FCFA sans décimales (12 500).
- [x] La modification de l'adresse d'une commande dans l'admin fonctionne sans code postal. Si elle en exige un, la solution de contournement est documentée et validée.
- [ ] Le parcours complet a été fait sur un vrai téléphone : commande, puis lien WhatsApp, puis message reçu avec les bonnes informations (après FK-01).

**Avancement (branche `fk-14`).**
- **Montants :** l'admin affiche « 14 500 F CFA », sans décimales (vérifié à l'écran sur la commande n° 13).
- **Adresse :** le formulaire « Edit shipping address » n'exige que le quartier (`address_1`) et le pays. Le code postal et le nom de famille sont optionnels dans son schéma, même si le libellé « Last Name » n'affiche pas « (Optional) ». Le test `integration-tests/http/checkout.spec.ts` (FK-22) confirme par l'API que la modification passe sans code postal, et que le téléphone, la ville et le pays sont conservés.
- **WhatsApp :** le message de la commande n° 13 est complet et conforme à Medusa (articles, tailles, total, nom, téléphone, quartier, repères), avec des accents correctement encodés. Il a été ouvert depuis le Mac. **Reste à faire :** l'ouvrir depuis un vrai téléphone (http://IP-du-Mac:3100, avec `DEV_LAN_HOST` dans `.env.local`).
- **En passant :** l'encart « Statut Fini Kura » (FK-06) est déplacé en haut de la colonne de droite (`order.details.side.before`).

**Taille** S · **Dépend de** FK-01 · **Origine** cahier des charges, étapes 3-4

### FK-15 · Contenu réel
**Description.** Les images de la maquette (`lh3.googleusercontent.com`) sont temporaires, et les textes viennent de la maquette. Il faut saisir dans Strapi et Medusa les vraies photos et les mesures réelles du guide des tailles. Ces données de production arriveront plus tard et ne bloquent pas le développement. Les textes de Notre histoire sont déjà rédigés.

**Critères d'acceptation**
- [x] Plus aucune image n'est servie depuis `googleusercontent.com`. Les photos produit sont dans Medusa, les visuels éditoriaux dans la médiathèque Strapi.
- [ ] Les images sont optimisées : l'accueil mobile pèse moins de 1 Mo au premier chargement.
- [ ] Le guide des tailles affiche les mesures fournies par la cliente.

**Avancement (branche `fk-15-stockage`).** Les médias sont dans un stockage d'objets S3 : Garage, qui remplace MinIO, dont l'édition communautaire n'est plus maintenue. Il tourne dans `docker compose` en local, et dans le compose de production derrière `media.DOMAIN`. Les fichiers sont sauvegardés chaque nuit.
- Medusa (`@medusajs/file-s3`) et Strapi (`@strapi/provider-upload-aws-s3`) y écrivent.
- Les 14 images de la maquette sont rapatriées dans `apps/storefront/public/mock-media/`. Les fixtures et le mode mock les utilisent, et les seeds les envoient dans Garage.
- En local, les 21 images Medusa et les 8 médias Strapi sont déplacés : relancer le seed pour Medusa, `pnpm --filter strapi media:migrate` pour Strapi.
- **Reste à faire** : les vraies photos et les mesures de la cliente, puis la vérification du poids de l'accueil en production.

**Taille** M · **Dépend de** données de production (photos, mesures) · **Origine** état des lieux, cliente

---

## P1 : juste après le lancement

### FK-16 · Historique des commandes par téléphone dans l'admin
**Description.** Sans e-mail, Medusa ne crée pas de fiche client. Il faut une extension de l'admin, sous forme de page ou de widget, qui retrouve toutes les commandes d'un numéro à partir du téléphone de l'adresse de livraison. Ce téléphone est enregistré au format `+223XXXXXXXX` depuis l'étape 4.

**Critères d'acceptation**
- [x] Une saisie de « 76 12 34 56 », « +22376123456 » ou « 0022376123456 » trouve les mêmes commandes.
- [x] La liste affiche la date, le numéro, le total, le statut Fini Kura et un lien vers la commande.
- [x] Sur la fiche d'une commande, un lien « Autres commandes de ce numéro » est présent.

**Taille** M · **Dépend de** FK-06 (pour le statut) · **Origine** cahier des charges

### FK-17 · Page campagne
**Description.** Créer une page `/campagne/[slug]` qui affiche une campagne Strapi : titre, bannière, textes et dates. Elle montre les produits de la collection Medusa correspondante. La campagne Tabaski 2027 est déjà dans Strapi.

**Critères d'acceptation**
- [x] La page affiche les produits de la collection désignée par `collection_handle`.
- [x] Une collection absente dans Medusa ne fait pas planter la page : la section produits n'est pas affichée.
- [x] En dehors des dates de la campagne, la page renvoie 404 ou n'est pas liée.

**Taille** M · **Dépend de** — · **Origine** cahier des charges

### FK-18 · Ménage Medusa : canal et clé par défaut
**Description.** Medusa crée d'office un « Default Sales Channel » et une « Default Publishable API Key ». Le site utilise son propre canal et sa propre clé, « Site Fini Kura ». Il faut désactiver ou supprimer les éléments par défaut pour éviter les confusions dans l'admin.

**Critères d'acceptation**
- [x] L'admin ne montre plus que le canal et la clé du site.
- [x] Le seed reste idempotent et le site fonctionne toujours.

**Fait (branche `fk-18`).** Le seed révoque puis supprime la « Default Publishable API Key », et supprime le « Default Sales Channel » s'il n'est pas le canal par défaut de la boutique. Aucun produit ni aucune commande n'y était rattaché. Vérifié : le seed lancé deux fois réussit, l'admin ne liste plus que « Site Fini Kura », et le parcours de commande (`fk-status-checks.mjs`) passe.

**Taille** S · **Dépend de** — · **Origine** étapes 3-4

### FK-19 · Tranches d'âge des variantes
**Description.** Les fixtures utilisent « 3-4 ans », « 5-6 ans »… alors que le brief parlait de « 4 ans », « 6 ans ». Le questionnaire donne trois groupes d'âge : 3-5, 6-9 et 10-14 ans. Ces groupes peuvent servir de filtres, mais ils ne disent pas quelles tailles sont cousues dans les vêtements en stock. De plus, les tailles actuelles « 5-6 » et « 9-10 » chevauchent deux groupes. Il faut demander à la cliente les tailles exactes de son stock, puis aligner les variantes Medusa, les filtres et le guide des tailles.

**Critères d'acceptation**
- [ ] Les variantes, les filtres de catégorie et le guide des tailles utilisent les mêmes libellés.
- [ ] Les filtres viennent des données et non d'une liste en dur (`FilterChips`).

**Taille** S · **Dépend de** Cliente : tranches d'âge · **Origine** état des lieux, cliente

### FK-20 · Bouton WhatsApp flottant
**Description.** Un bouton flottant ouvre WhatsApp. Décision : oui. La cliente veut avant tout rassurer les parents et un service sérieux, et WhatsApp est le canal habituel au Mali. Règles : visible sur l'accueil, le catalogue, les fiches produit et les pages éditoriales ; masqué sur la commande et la confirmation, qui ont déjà leur propre bouton WhatsApp ; jamais par-dessus le bouton « Ajouter au panier ».

**Critères d'acceptation**
- [x] Le bouton n'est affiché que s'il est activé dans les réglages Strapi et qu'un numéro est saisi.
- [x] Il est masqué sur `/commande` et sur la page de confirmation.
- [x] Il ne masque ni le bouton « Ajouter au panier » ni le bouton de commande sur mobile.

**Taille** S · **Dépend de** FK-01 · **Origine** cliente (décidé)

### FK-21 · Qualité du code front
**Description.** Le lint signale 38 avertissements. Plusieurs composants client sont très gros : CheckoutForm, CartDrawer, ProductBuySection, LegalPageContent, SizeGuidePageContent. Il faut les découper pour garder l'interactivité dans de petits composants client.

**Critères d'acceptation**
- [x] `pnpm --filter storefront lint` affiche 0 avertissement.
- [x] Aucun composant client ne dépasse environ 200 lignes.
- [x] Le poids JS de la première page n'augmente pas. Exception acceptée le 12/11/2026 : +5 Ko de JS (next/image) contre des images 2 à 4 fois plus légères.

**Taille** M · **Dépend de** — · **Origine** état des lieux

### FK-22 · Tests automatisés
**Description.** Il faut transformer les scripts manuels `apps/medusa/integration-tests/manual` en tests Medusa, et ajouter un parcours e2e du front en mode mock (panier, commande, confirmation).

**Critères d'acceptation**
- [x] Deux finalisations simultanées sur la dernière pièce : une seule réussit. Ce test est automatisé.
- [x] Le refus à la porte remet la pièce en stock. Ce test est automatisé.
- [x] Le parcours e2e en mock passe en moins de 2 minutes, avec une commande documentée dans `CLAUDE.md`.

**Fait (branche `fk-22`).** Tests Medusa dans `apps/medusa/integration-tests/http` (8 tests, environ 50 s, base temporaire supprimée à la fin). Parcours e2e Playwright dans `apps/storefront/e2e`, environ 25 s build compris quand le cache de Next est chaud.

**Taille** M · **Dépend de** FK-06 · **Origine** étapes 3-4

### FK-23 · Accès à la page de confirmation
**Description.** La route Medusa `GET /store/orders/:id` est publique : toute personne qui a le lien de confirmation voit le nom, le téléphone et le quartier. L'identifiant est long et aléatoire, mais il faudrait limiter l'accès à l'appareil qui a passé la commande.

**Critères d'acceptation**
- [x] La page de confirmation complète n'est visible que depuis le navigateur qui a passé la commande, grâce à un cookie httpOnly posé à la commande.
- [x] Sur un autre appareil, la page affiche seulement le numéro de commande, sans données personnelles.

**Fait (branche `fk-23`).** Le cookie httpOnly `fk_orders` (les 10 dernières commandes, 30 jours) est posé par `placeOrderAction` et lu par `lib/order-access.ts`. Sans ce cookie, la page affiche `OrderConfirmationLimited`, qui ne reçoit que le numéro de commande. Vérifié : dans le navigateur qui a commandé, la page complète s'affiche ; avec `curl` sans cookie, on ne trouve ni nom, ni téléphone, ni quartier, ni repères, ni message WhatsApp. Les textes qui étaient en dur sur la page sont passés dans `fr.ts`.

**Taille** S · **Dépend de** — · **Origine** étapes 3-4

---

### FK-31 · Bouton « Demander à un proche »
**Description.** À Bamako, l'achat d'un vêtement d'enfant se décide souvent à plusieurs (maman, mari, sœur). Sur la fiche produit, un bouton ouvre WhatsApp avec un message prérempli : nom du produit, prix (`formatPrice`) et lien vers la fiche. La cliente choisit à qui l'envoyer. Chaque partage fait aussi connaître la boutique. Origine : analyse conversion du 13/11/2026.

**Critères d'acceptation**
- [x] Le bouton ouvre WhatsApp (lien `wa.me/?text=`, sans numéro), avec le produit, le prix et le lien de la fiche. Le texte vient de `fr.ts`.
- [ ] Le lien partagé affiche un aperçu propre dans WhatsApp (titre, image, prix) grâce aux métadonnées Open Graph de la fiche. Balises en place ; à vérifier dans WhatsApp une fois le site en ligne.
- [x] Zone tactile d'au moins 44 px, sans gêner le bouton « Ajouter au panier ».
- [x] Aucune promesse non validée (délai, échange) dans le message.

**Taille** S · **Dépend de** — · **Origine** analyse conversion (13/11/2026)

### FK-32 · Bouton « Une question sur la taille ? »
**Description.** Le doute sur la taille est le premier frein. À côté du choix de la taille, un lien ouvre WhatsApp vers le numéro de la boutique (réglage Strapi `whatsappUrl`), avec un message prérempli : produit, taille envisagée et une question sur l'âge de l'enfant. La gérante répond comme en boutique. C'est un vrai contact, puisque c'est la cliente qui écrit en premier, et aucun message commercial n'est envoyé sans son accord.

**Critères d'acceptation**
- [x] Le message contient le produit, la taille sélectionnée (ou « pas encore choisie ») et le lien de la fiche. Les textes viennent de `fr.ts`.
- [x] Le numéro vient de Strapi. Si `whatsappUrl` est vide, le lien ne s'affiche pas.
- [x] Le guide des tailles (FK-15) reste accessible au même endroit.

**Taille** S · **Dépend de** FK-01 · **Origine** analyse conversion (13/11/2026)

### FK-33 · Photos portées avec l'âge et la taille de l'enfant
**Description.** Répondre à « est-ce que ça va lui aller ? » par de vraies photos portées, avec une mention du type « Aïcha, 7 ans, porte le 7-8 ans ». Les photos sont dans Medusa (galerie du produit). La mention est un champ de Medusa (métadonnée de l'image ou du produit), à vérifier dans la doc de la version installée. Medusa 2.22 ne permet pas de modifier les métadonnées d'une image depuis l'admin : la mention est donc une métadonnée du produit, `photo_portee_<n>` (voir `docs/fiche-acces.md`).

**Critères d'acceptation**
- [x] Une fiche peut afficher, sous une photo, l'âge de l'enfant et la taille portée.
- [x] Sans mention, la fiche s'affiche comme aujourd'hui.
- [ ] Les photos d'enfants sont publiées avec l'accord écrit des parents (à la charge de la cliente) et sans nom de famille.

**Taille** S · **Dépend de** FK-15, photos de la cliente · **Origine** analyse conversion (13/11/2026)

## P2 : plus tard

### FK-24 · Diaspora : région Europe en euros, Wero
**Description.** Une région Medusa « Europe » en EUR, avec le paiement Wero. Il faut définir la livraison internationale avec la cliente.

**Critères d'acceptation**
- [ ] Les prix sont en euros pour la région Europe, et les prix XOF restent inchangés au Mali.
- [ ] Le paiement Wero fonctionne en mode test, puis en production.
- [ ] Le site Mali n'affiche toujours aucun tarif de livraison.

**Taille** L · **Dépend de** FK-25 · **Origine** cahier des charges

### FK-25 · Paiement en ligne
**Description.** Un fournisseur de paiement Medusa, en plus du paiement à la réception.

**Critères d'acceptation**
- [ ] Le paiement à la réception reste disponible.
- [ ] Un paiement refusé ne crée pas de commande et ne réserve pas de stock.

**Taille** L · **Dépend de** — · **Origine** cahier des charges

### FK-26 · Comptes clients
**Description.** Création de compte facultative pour retrouver ses commandes, en plus de la commande sans compte, qui reste le parcours principal.

**Critères d'acceptation**
- [ ] Commander sans compte reste possible, sans e-mail.
- [ ] Une cliente connectée voit l'historique de ses commandes.

**Taille** L · **Dépend de** — · **Origine** cahier des charges

### FK-27 · Coût et marge par article
**Description.** Suivi du coût de revient et de la marge par article dans l'admin, pour la gérante uniquement.

**Critères d'acceptation**
- [ ] Le coût est saisi par variante, et la marge s'affiche dans l'admin, jamais sur le site.

**Taille** M · **Dépend de** Cliente : coût et marge · **Origine** cliente

---

### FK-28 · CI sur Forgejo
**Description.** Héberger le dépôt sur une instance Forgejo, pour garder la main sur le code, et lancer les tests à chaque push avec Forgejo Actions : lint, typecheck, tests Medusa et parcours e2e.

**Critères d'acceptation**
- [ ] Un push lance le lint, le typecheck et les deux suites de tests.
- [ ] Un échec bloque la fusion dans `main`.

**Taille** M · **Dépend de** FK-22, FK-29 · **Origine** toi (13/11/2026)

### FK-29 · PostgreSQL en conteneur pour les tests Medusa
**Description.** En CI, les tests Medusa ont besoin d'un PostgreSQL. Il faut en démarrer un en conteneur pour le temps des tests (service du job, ou Testcontainers), au lieu de celui de `docker compose`. Fait : `pnpm --filter medusa test:integration:ci` (`apps/medusa/scripts/test-integration.sh`), 13 tests en 65 s en local ; le premier critère se valide avec la CI (FK-28).

**Critères d'acceptation**
- [ ] Les tests Medusa passent en CI sans PostgreSQL installé à l'avance.
- [x] Le conteneur est supprimé à la fin du job.

**Taille** S · **Dépend de** FK-22 · **Origine** toi (13/11/2026)

### FK-30 · Statistiques : ajouts au panier, commandes, clics WhatsApp
**Description.** FK-10 ne compte que les pages vues. Envoyer aussi à Umami trois événements, sans donnée personnelle : ajout au panier (avec le handle du produit), commande passée (sans montant ni coordonnées) et clic sur WhatsApp. La gérante verrait alors combien de visites aboutissent à une commande. Absent du cahier des charges.

**Critères d'acceptation**
- [ ] Les trois événements apparaissent dans Umami, et l'entonnoir visite → panier → commande se lit dans son tableau de bord. Événements envoyés et vérifiés en local ; l'entonnoir se crée dans Umami au déploiement (voir `docs/deploiement.md`).
- [x] Aucun nom, téléphone, quartier ni montant n'est envoyé.
- [x] Sans Umami configuré (mock, dev, e2e), rien ne part et rien ne casse.

**Taille** S · **Dépend de** FK-10 · **Origine** proposition (13/11/2026)

### FK-34 · Avis et photos des clientes
**Description.** Afficher des avis et, avec leur accord, des photos envoyées par les clientes (par WhatsApp à la gérante). Il faut d'abord des commandes livrées. La gérante choisit les avis à publier : ce contenu raconte la marque, il irait donc dans Strapi, en citant le handle du produit.

**Critères d'acceptation**
- [ ] Un avis n'est publié qu'avec l'accord de la cliente, et sans son nom de famille ni son téléphone.
- [ ] Un avis lié à un produit absent de Medusa ne s'affiche pas, sans faire planter la page.

**Taille** M · **Dépend de** commandes livrées, accord des clientes · **Origine** analyse conversion (13/11/2026)

### Écarté : essayage virtuel d'un vêtement sur la photo de l'enfant
Décidé le 13/11/2026, après analyse : on ne le fait pas. Les raisons :
- il faudrait des photos de mineurs (consentement, stockage, envoi par WhatsApp) ;
- le coût par essai est élevé face à un panier de 6 500 à 15 000 FCFA ;
- les rendus sont peu fiables pour des enfants, et un rendu trop flatteur provoquerait des refus à la livraison ;
- c'est lourd pour les forfaits mobiles.

FK-31 à FK-33 traitent le même frein. À reconsidérer seulement si un faux bouton, mesuré avec FK-30, montre une forte demande.

### FK-35 · Parcours e2e en mode live (front + Medusa + Strapi, seeds)
**Description.** Le e2e actuel tourne en mode mock. Ce ticket ajoute une commande, `pnpm test:e2e:live`, qui démarre une base jetable, lance Medusa et Strapi avec leurs seeds, construit le front en mode live et rejoue les parcours Playwright. Il vérifie ensuite dans Medusa la commande créée : nom, téléphone, quartier, prix XOF et stock. Pour rester rapide :
- Medusa et Strapi tournent sans build de leur admin ;
- la base seedée est mise en cache (dump SQL), et refaite seulement si les migrations ou les fixtures changent ;
- Medusa, Strapi et le build du front démarrent en parallèle.
En CI (FK-28), le cache pnpm et `.next/cache` s'ajoutent. Ce test tourne avant une fusion dans `main` ou chaque nuit, le e2e mock restant à chaque push. Origine : toi (13/11/2026).

**Critères d'acceptation**
- [ ] Une seule commande lance tout et nettoie tout à la fin (conteneurs et volumes), sans toucher aux données de dev.
- [ ] Le parcours commande passe en mode live, et la commande est vérifiée dans Medusa.
- [ ] Le temps total est mesuré et noté ; objectif 2 à 3 minutes en local, base en cache.

**Taille** M · **Dépend de** FK-29 · **Origine** toi (13/11/2026)

## En attente de la cliente

Mis à jour le 12 novembre 2026, avec les réponses reçues.

| Décision | Statut | Débloque |
|---|---|---|
| Règle d'échange (la mention « Échange possible » en dépend) | **En attente.** Les questions à poser sont dans FK-05 | FK-05, FK-04 |
| Domaine et e-mail | **En attente** : `fini-kura.fr` ou `finikura.fr` | FK-09, FK-07 |
| Coût et marge par article | **En attente**, facultatif. Ne sert qu'à FK-27 | FK-27 |
| Tranches d'âge des variantes | **À préciser.** Le questionnaire donne des groupes d'âge (3-5, 6-9, 10-14 ans), pas les tailles cousues dans les vêtements. Voir FK-19 | FK-19 |
| Codes couleur exacts | **Réglé** : `DESIGN.md` (Warm Heirloom Editorial) confirme la palette de CLAUDE.md | FK-12, FK-11 |
| Numéro WhatsApp | **Réglé pour le développement** : numéro de test dans Strapi et dans la fixture mock. Il sera remplacé par celui de la cliente dans l'admin Strapi avant la production | FK-01, FK-14, FK-20 |
| Textes de Notre histoire | **Réglé** : rédigés à partir du questionnaire, saisis dans Strapi et la fixture. Il reste à confirmer que « fini kura » veut bien dire « habits neufs » (la cliente a écrit « je crois ») | FK-03 |
| Mesures du guide des tailles | **Gardées telles quelles** pour le développement. Les vraies mesures arriveront avec les données de production | FK-15 |
| Vraies photos | **Données de production**, pas de blocage pour le développement | FK-15 |
| Bouton WhatsApp flottant | **Décidé : oui**, avec des règles d'affichage (voir FK-20) | FK-20 |

## Questions de design (à trancher avec toi)

| Question | Constat | Proposition |
|---|---|---|
| Police du texte courant | `DESIGN.md` prévoit Work Sans, le code charge Poppins | **Tranché : Poppins**. On garde le code tel quel ; `DESIGN.md` ne fait pas foi sur ce point |
| Couleur des erreurs | `#BA1A1A` (rouge) est utilisé, mais n'est pas dans la palette en 7 couleurs | Terracotta `#CA7154` pour les erreurs, avec une icône et un texte, en vérifiant le contraste (FK-11) |
| Positionnement | La cliente veut une image « très prestigieuse » et cite Du pareil au même pour ses couleurs vives, alors que la charte est en tons doux | Garder la charte. Les couleurs vives viendront des photos des vêtements |

## Déjà réglé (étapes 2 à 4)

Écarts de l'état des lieux corrigés :
- Front migré vers Next.js (App Router) : Server Components, Server Actions, panier côté serveur.
- Identifiant du panier dans un cookie httpOnly. La variable globale partagée entre visiteurs a disparu.
- Confirmation persistante : elle est lue dans Medusa et survit au rechargement.
- Panier fictif, formulaire pré-rempli et commande de démo supprimés.
- E-mail technique supprimé. Les commandes ont `email: null`, et le téléphone est dans l'adresse au format `+223XXXXXXXX`.
- Formats des données alignés sur Medusa 2.22.6 (`calculated_price`) et Strapi 5 (réponses à plat). Mock et live partagent les mêmes mappers.
- Formulaire envoyé en POST : plus de données personnelles dans l'URL avant l'hydratation.
- Dernière pièce, réservation du stock et annulation avec remise en stock : vérifiés par des tests réels.
- Revalidation par tags, déclenchée par Medusa et Strapi avec un secret partagé.
