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
| Ajouter le serveur dans le Dokploy existant et autoriser GitHub | Vous |
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

Décidé le 18 novembre 2026 : un seul Dokploy. Celui qui tourne déjà sur l'autre VPS pilote ce serveur comme « serveur distant ». Le Dokploy installé ici pour essai a été retiré entièrement (services, Traefik, volumes, réseau, `/etc/dokploy`) ; Docker et les réglages du serveur sont conservés.

- [x] Retirer le Dokploy de ce VPS.
- [ ] Dans le Dokploy existant : ajouter ce serveur (adresse `2.25.12.161`, port 22, utilisateur `root`) avec une clé SSH créée dans le panneau.
- [ ] Poser la clé publique de ce panneau sur le VPS.
- [ ] Lancer « Setup Server » depuis le panneau : il installe Traefik et le réseau `dokploy-network` sur ce VPS.
- [ ] Vérification : sur le VPS, `dokploy-traefik` tourne sur les ports 80 et 443, et le réseau `dokploy-network` existe.
- [ ] Vérification : l'adresse e-mail Let's Encrypt du Traefik de ce VPS n'est pas l'adresse factice `test@localhost.com`.

## Étape 3 : DNS

- [x] Six enregistrements A vers l'adresse du VPS : `DOMAINE`, `www.`, `api.`, `cms.`, `media.`, `stats.`.
- [x] Vérification : chaque nom répond avec l'adresse du VPS (`dig`), avant de demander les certificats.

## Étape 4 : projet et variables

- [ ] Dans Dokploy : projet « Fini Kura », service Compose, dépôt GitHub `PaulWayne/finikura`, branche `main`, fichier `infra/dokploy/docker-compose.prod.yml`. Vous autorisez l'accès au dépôt.
- [x] Sur le VPS, un script génère tous les secrets (`openssl rand -hex 32`) dans un fichier de variables lisible par vous seul. Rien n'est affiché à l'écran.
- [x] Valeurs fixées : `DOMAIN`, `POSTGRES_USER=finikura`, `NOINDEX=1`, `INDEXNOW_KEY` vide.
- [ ] Vous collez ce fichier dans l'onglet Environment, et vous y ajoutez les identifiants SMTP.
- [ ] Restent vides pour l'instant : `MEDUSA_PUBLISHABLE_KEY`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`, `UMAMI_WEBSITE_ID`.

## Étapes 5 à 7 : déploiement, stockage et contenu (faites le 19 novembre 2026)

- [x] Projet Compose créé dans le Dokploy existant, sur le serveur « Fini Kura », branche `main`.
- [x] PostgreSQL, Redis, Garage, Strapi et Umami démarrés et sains au premier déploiement.
- [x] Garage initialisé : bucket `media`, clé « finikura », rangée dans `/root/finikura.env` sans être affichée.
- [x] Medusa démarré après trois corrections (voir ci-dessous), 149 tables.
- [x] Seed Medusa complet : 19 tenues, 114 tailles, 25 photos dans Garage. Clé publique du canal reportée dans Dokploy.
- [x] Seed Strapi complet : réglages, accueil, pages, guides des tailles, bandeaux, campagne de démonstration.
- [x] Front construit avec les vraies données, tous les conteneurs sains.

Ce qui a bloqué Medusa, dans l'ordre, et ce qu'il faut retenir pour un prochain déploiement à neuf :

1. **SSL vers la base.** En production, Medusa exige le SSL et sa connexion partagée ne lit pas `ssl_mode=disable` dans l'adresse. Corrigé dans `apps/medusa/medusa-config.ts` (`databaseDriverOptions`).
2. **E-mail.** Avec `SMTP_HOST` rempli mais sans identifiants, Medusa refuse de démarrer. Pour un aperçu sans boîte d'envoi, laisser `SMTP_HOST` vide.
3. **Clé du stockage.** Medusa a besoin de `S3_ACCESS_KEY_ID` et `S3_SECRET_ACCESS_KEY` dès son démarrage : Garage s'initialise donc avant que Medusa puisse tourner, pas après.

L'ordre réel est donc : déployer (Medusa échoue), initialiser Garage, reporter sa clé, redéployer, lancer les seeds, reporter la clé publique de Medusa, redéployer.

## Étape 8 : comptes et statistiques

- [ ] Medusa : invitation envoyée à votre adresse, vous choisissez le mot de passe.
- [ ] Strapi : vous créez le compte Super Admin sur `https://cms.DOMAINE/admin`.
- [ ] Umami : vous changez tout de suite le mot de passe par défaut, puis on crée le site « Fini Kura » et son identifiant va dans `UMAMI_WEBSITE_ID`.

## Étape 9 : vérifications finales

- [x] Tous les conteneurs `finikura-*` sont sains.
- [x] `http://fini-kura.fr`, `http://www.` et `https://www.` redirigent vers `https://fini-kura.fr`, et les domaines ont leur certificat Let's Encrypt.
- [x] `robots.txt` répond « Disallow: / », les pages portent `X-Robots-Tag: noindex`, `sitemap.xml` et `llms.txt` répondent 404.
- [x] `https://api.fini-kura.fr/store/products` et l'inscription client répondent 404 ; `https://api.fini-kura.fr/app` affiche l'admin.
- [x] `https://cms.fini-kura.fr/api/auth/local/register` répond « Register action is currently disabled ».
- [x] L'accueil, les catégories, une fiche et Notre histoire s'affichent ; leurs photos viennent de `media.fini-kura.fr`, aucune image cassée.
- [x] Les réponses portent `Strict-Transport-Security` et `Content-Security-Policy`, sans `X-Powered-By`.
- [x] Medusa parle au vrai Redis.
- [ ] Une modification publiée dans Strapi apparaît sur le site.
- [ ] Une commande de test passe jusqu'au message WhatsApp, puis elle est annulée.

Mesuré après la mise en route : 1,6 Go de mémoire utilisés sur 7,7 ; 16 Go de disque sur 96.

## Étape 10 : sauvegardes

- [ ] Installer `infra/backup/backup.sh` en tâche de nuit.
- [ ] Destination hors du serveur : à décider avec vous. Sans elle, les sauvegardes restent sur le VPS.

## Étape 11 : clôture

- [ ] Mettre à jour `avant-ouverture.md` et `deploiement.md` avec ce qui a changé pendant le déploiement.
- [ ] Vous envoyez l'adresse à la cliente, et à elle seule.
