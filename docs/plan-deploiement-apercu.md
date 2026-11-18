# Plan du déploiement en aperçu

But : mettre le site en ligne sur le VPS avec le contenu du local, pour le montrer à la cliente. Le site reste caché des moteurs de recherche et des IA (`NOINDEX=1`). Ce qui reste à corriger avant l'ouverture est suivi dans [`avant-ouverture.md`](avant-ouverture.md). Le détail technique de chaque service est dans [`deploiement.md`](deploiement.md).

Règles pendant tout le déploiement :

- Aucun mot de passe, jeton ou clé n'est tapé ni affiché par Claude. Les secrets sont générés sur le VPS et restent dans un fichier du VPS.
- Chaque étape se termine par une vérification. On ne passe pas à la suivante tant qu'elle échoue.
- Une étape qui peut casser autre chose sur le VPS (pare-feu, ports 80 et 443, Docker déjà présent) est annoncée avant d'être lancée.

## Qui fait quoi

| Action | Qui |
|---|---|
| Ouvrir la connexion SSH au VPS | Vous |
| Créer les enregistrements DNS chez le registraire | Vous |
| Créer le compte administrateur de Dokploy et autoriser GitHub | Vous |
| Coller le fichier des variables dans Dokploy | Vous |
| Saisir les identifiants de la boîte e-mail (SMTP) | Vous |
| Créer les comptes d'admin Medusa, Strapi et Umami | Vous |
| Tout le reste : audit, installation, commandes, seeds, vérifications | Claude |

## Étape 0 : ce qu'il me faut avant de commencer

- [x] Le nom de domaine.
- [x] Une connexion SSH au VPS ouverte par vous.
- [x] Savoir si le VPS héberge déjà autre chose (d'autres sites, un Docker, un Traefik ou un Nginx).

## Étape 1 : état des lieux du VPS (lecture seule)

- [x] Système, mémoire et disque : `free -h`, `df -h`. Il faut environ 2 Go de mémoire libre, et de la marge pour la construction du front.
- [x] Docker présent ou non, conteneurs en cours, réseaux et volumes existants.
- [x] Ports 80, 443 et 3000 : libres ou déjà pris. Dokploy installe son propre Traefik sur 80 et 443.
- [x] Pare-feu (ufw ou celui de l'hébergeur) et ports ouverts.
- [x] Restes de l'ancienne installation (Forgejo, CI) à ne pas réveiller.

**On s'arrête ici si** les ports 80 ou 443 sont pris par un autre site : il faut décider avec vous avant d'installer.

Constaté le 18 novembre 2026 : domaine `fini-kura.fr`, serveur `2.25.12.161`, Ubuntu 26.04, 2 cœurs, 7,7 Go de mémoire, 96 Go de disque. Serveur neuf, sans Docker ni autre site.

### Images Docker (fait)

- [x] Chaque application ne copie que son dossier : un changement du front ne reconstruit plus Medusa ni Strapi. Mesuré en local : 3 secondes au lieu de 7 minutes pour Medusa.
- [x] Les trois images partagent leurs premières couches (système et dépendances, 1,8 Go), stockées une seule fois sur le serveur.
- [x] Tests, notes et captures exclus de la construction (`.dockerignore`).

### Préparation du serveur (faite)

- [x] Système mis à jour et redémarré.
- [x] 2 Go de swap, utilisé seulement en dernier recours (`vm.swappiness=10`).
- [x] Pare-feu `ufw` : ports 22, 80, 443 ouverts, et 3000 le temps de configurer Dokploy.
- [x] SSH par clé uniquement : la connexion par mot de passe est refusée.
- [x] Journaux Docker limités à 3 fichiers de 10 Mo par conteneur, journaux système à 200 Mo.
- [x] Cache de construction Docker plafonné à 4 Go.
- [x] Nettoyage chaque nuit à 3 h 30 (`/usr/local/bin/finikura-docker-clean.sh`) : conteneurs arrêtés, images inutilisées depuis 24 heures, cache de construction de plus de 3 jours, réseaux vides. Les volumes de données ne sont jamais touchés.

## Étape 2 : Dokploy

- [x] Lire le script d'installation officiel avant de le lancer.
- [x] Installer Dokploy. Version 0.31.4, avec Docker 29.10.
- [ ] Vous créez le compte administrateur sur l'écran d'accueil de Dokploy.
- [ ] Donner un domaine au panneau (par exemple `dokploy.DOMAINE`) avec HTTPS, puis fermer le port 3000 au public.
- [ ] Vérification : le panneau répond en HTTPS, et `docker ps` montre Dokploy et Traefik en marche.

## Étape 3 : DNS

- [ ] Cinq enregistrements A vers l'adresse du VPS : `DOMAINE`, `api.`, `cms.`, `media.`, `stats.` (et celui du panneau).
- [ ] Vérification : chaque nom répond avec l'adresse du VPS (`dig`), avant de demander les certificats.

## Étape 4 : projet et variables

- [ ] Dans Dokploy : projet « Fini Kura », service Compose, dépôt GitHub `PaulWayne/finikura`, branche `main`, fichier `infra/dokploy/docker-compose.prod.yml`. Vous autorisez l'accès au dépôt.
- [ ] Sur le VPS, un script génère tous les secrets (`openssl rand -hex 32`) dans un fichier de variables lisible par vous seul. Rien n'est affiché à l'écran.
- [ ] Valeurs fixées : `DOMAIN`, `POSTGRES_USER=finikura`, `NOINDEX=1`, `INDEXNOW_KEY` vide.
- [ ] Vous collez ce fichier dans l'onglet Environment, et vous y ajoutez les identifiants SMTP.
- [ ] Restent vides pour l'instant : `MEDUSA_PUBLISHABLE_KEY`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`, `UMAMI_WEBSITE_ID`.

## Étape 5 : premier déploiement, les bases d'abord

Le compose démarre les services dans l'ordre : PostgreSQL et Redis, puis Garage, Medusa, Strapi et Umami, et enfin le front.

- [ ] Lancer le déploiement.
- [ ] Vérification : `finikura-postgres` et `finikura-redis` sont sains, les trois bases `medusa`, `strapi` et `umami` existent.
- [ ] Vérification : Medusa a appliqué ses migrations et parle au vrai Redis, Strapi répond sur `/_health`.
- [ ] À ce stade le front n'est pas encore utilisable : il lui manque la clé de Medusa. C'est attendu.

## Étape 6 : stockage des photos (Garage)

À faire avant les seeds, sinon les photos resteraient dans les conteneurs.

- [ ] `sh infra/garage/init.sh finikura-garage media.DOMAINE` : crée le bucket `media` et sa clé.
- [ ] La clé et son secret vont dans `S3_ACCESS_KEY_ID` et `S3_SECRET_ACCESS_KEY`, puis redéploiement.
- [ ] Vérification : `https://media.DOMAINE` répond en HTTPS.

## Étape 7 : le contenu du local

Les seeds lisent les fixtures du dépôt, qui sont à jour avec le local : les 19 tenues, leurs descriptions, l'accueil, les pages, les catégories.

- [ ] Medusa : `pnpm seed` complet, avec le catalogue. Il affiche la clé publique du canal : elle va dans `MEDUSA_PUBLISHABLE_KEY`.
- [ ] Strapi : `pnpm seed` complet, avec les avis d'exemple et la campagne de démonstration, puisqu'on veut montrer le site tel qu'il est en local.
- [ ] Redéployer : le front se construit avec les vraies données (1 à 3 minutes).
- [ ] Vérification : l'accueil, une catégorie, une fiche et Notre histoire s'affichent, et leurs photos viennent de `media.DOMAINE`.

Ce qui ne vient pas du local : les commandes de test et les vidéos ajoutées à la main dans l'admin local. Si un texte n'a été changé que dans l'admin Strapi local, sans passer par les fixtures, il faudra le ressaisir.

## Étape 8 : comptes et statistiques

- [ ] Medusa : invitation envoyée à votre adresse, vous choisissez le mot de passe.
- [ ] Strapi : vous créez le compte Super Admin sur `https://cms.DOMAINE/admin`.
- [ ] Umami : vous changez tout de suite le mot de passe par défaut, puis on crée le site « Fini Kura » et son identifiant va dans `UMAMI_WEBSITE_ID`.

## Étape 9 : vérifications finales

- [ ] Les trois conteneurs `finikura-medusa`, `finikura-strapi` et `finikura-storefront` sont sains.
- [ ] `http://DOMAINE` redirige vers le HTTPS, et les cinq domaines ont leur certificat.
- [ ] `https://DOMAINE/robots.txt` répond « Disallow: / », les pages portent `X-Robots-Tag: noindex`, `sitemap.xml` et `llms.txt` répondent 404.
- [ ] `https://api.DOMAINE/store/products` répond 404, et `https://api.DOMAINE/app` affiche l'admin.
- [ ] Une modification publiée dans Strapi apparaît sur le site.
- [ ] Une commande de test passe jusqu'au message WhatsApp, puis elle est annulée.
- [ ] Mémoire restante sur le VPS après la mise en route.

## Étape 10 : sauvegardes

- [ ] Installer `infra/backup/backup.sh` en tâche de nuit.
- [ ] Destination hors du serveur : à décider avec vous. Sans elle, les sauvegardes restent sur le VPS.

## Étape 11 : clôture

- [ ] Mettre à jour `avant-ouverture.md` et `deploiement.md` avec ce qui a changé pendant le déploiement.
- [ ] Vous envoyez l'adresse à la cliente, et à elle seule.
