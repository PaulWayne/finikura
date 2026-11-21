# Déploiement de Fini Kura (VPS Hostinger, Dokploy)

## Vue d'ensemble

| Service | Conteneur | Adresse publique | Adresse interne |
|---|---|---|---|
| Front (Next.js) | `finikura-storefront` | `https://DOMAIN` | `http://storefront:3100` |
| Medusa (vente, admin `/app`) | `finikura-medusa` | `https://api.DOMAIN` | `http://medusa:9000` |
| Strapi (contenu, admin `/admin`) | `finikura-strapi` | `https://cms.DOMAIN` | `http://strapi:1337` |
| Garage (photos et médias, compatible S3) | `finikura-garage` | `https://media.DOMAIN` (lecture seule) | `http://garage:3900` (API S3) |
| Umami (statistiques de visites) | `finikura-umami` | `https://stats.DOMAIN` | `http://umami:3000` |
| PostgreSQL 16 (bases `medusa`, `strapi` et `umami`) | `finikura-postgres` | aucune | `postgres:5432` |
| Redis 7 | `finikura-redis` | aucune | `redis:6379` |

- Fichiers : [`Dockerfile`](../Dockerfile) (une cible par appli), [`infra/dokploy/docker-compose.prod.yml`](../infra/dokploy/docker-compose.prod.yml) et [`infra/dokploy/.env.example`](../infra/dokploy/.env.example).
- Aucun port n'est publié. Traefik, géré par Dokploy, sert les cinq domaines par le réseau `dokploy-network`, et fournit le HTTPS avec Let's Encrypt et la redirection du HTTP vers le HTTPS.
- Tous les noms (conteneurs, volumes, réseau `finikura-internal`, routeurs Traefik) commencent par `finikura-`, ce qui évite les conflits avec les autres sites du VPS.
- Le front est construit **au démarrage de son conteneur**, une fois Medusa et Strapi joignables. Les pages pré-rendues contiennent ainsi les vraies données. Un redémarrage du front prend donc 1 à 3 minutes.

## Mémoire à prévoir
Comptez environ 2 Go : Medusa 500 à 700 Mo, Strapi 400 à 600 Mo, Next 300 à 500 Mo (et plus pendant son build), PostgreSQL 150 Mo, Redis 128 Mo au maximum, Umami 150 à 250 Mo, Garage environ 50 Mo. Vérifiez avec `free -h` sur le VPS avant la mise en ligne.

## Première mise en ligne
1. **DNS**, chez le registraire du domaine choisi : des enregistrements A pour `DOMAIN`, `api.DOMAIN`, `cms.DOMAIN`, `stats.DOMAIN` et `media.DOMAIN`, qui pointent vers l'adresse IP du VPS.
2. **Dokploy** :
   - créez le projet « Fini Kura », puis un service **Compose** ;
   - source : GitHub, dépôt `PaulWayne/finikura`, branche `main` ;
   - chemin du compose : `infra/dokploy/docker-compose.prod.yml`.
3. **Environment** : collez le contenu de `infra/dokploy/.env.example`, puis renseignez les valeurs.
   - Chaque secret se génère avec `openssl rand -hex 32`. `STRAPI_APP_KEYS` attend quatre valeurs séparées par des virgules.
   - Gardez `POSTGRES_USER=finikura`, car le script `infra/postgres-init.sql` crée la base `strapi` pour cet utilisateur.
   - Laissez `MEDUSA_PUBLISHABLE_KEY`, `UMAMI_WEBSITE_ID`, `S3_ACCESS_KEY_ID` et `S3_SECRET_ACCESS_KEY` vides pour l'instant (voir l'étape 5).
4. **Deploy**. Medusa applique ses migrations au démarrage.
5. **Données de départ** (une seule fois), dans le terminal du conteneur, depuis Dokploy :
   - **Stockage des médias, en premier** (sinon les photos du seed resteraient dans les conteneurs) : sur le VPS, `sh infra/garage/init.sh finikura-garage media.DOMAIN`. Le script crée le bucket `media`, le sert sur `https://media.DOMAIN` et affiche une clé : copiez son **Key ID** et son **Secret key** dans `S3_ACCESS_KEY_ID` et `S3_SECRET_ACCESS_KEY`, puis redéployez. Le secret n'est affiché qu'à ce moment-là.
   - Medusa : `cd /app/apps/medusa && pnpm seed structure-only`. Ce mode crée la région, le canal, le lieu de stock, la livraison, les catégories et les étiquettes d'occasion, sans aucun produit ni photo de démonstration : le vrai catalogue se saisit ensuite dans l'admin. Le seed affiche la clé publique du canal « Site Fini Kura » : copiez-la dans `MEDUSA_PUBLISHABLE_KEY`, puis redéployez. (Sans `structure-only`, le seed charge le catalogue de démonstration : à réserver à la répétition générale.)
   - Strapi : `cd /app/apps/strapi && SEED_WHATSAPP_NUMBER=223XXXXXXXX pnpm seed --sans-demo`, avec le numéro WhatsApp de la boutique. Ce mode écrit ce numéro à la place du numéro de test et laisse de côté les témoignages et les campagnes de démonstration. Les textes et les photos de l'accueil et des pages restent à relire dans l'admin.
   - Comptes de l'admin (FK-08). Personne ne choisit le mot de passe à la place de la gérante ou de sa sœur :
     1. Medusa, premier accès : `cd /app/apps/medusa && pnpm invite:admin <email de la gérante>`. Elle reçoit par e-mail un lien valable 24 heures et y choisit son mot de passe. Relancer la même commande envoie un nouveau lien. (Ne pas utiliser `medusa user --invite` : il crée l'invitation mais son e-mail ne part pas.)
     2. Medusa, sa sœur : la gérante l'invite depuis **Paramètres › Utilisateurs › Inviter**. L'e-mail d'invitation part par la boîte Hostinger.
     3. Strapi : ouvrez `https://cms.DOMAIN/admin` et créez le compte Super Admin technique, qui est le vôtre. Puis, dans **Paramètres › Utilisateurs › Inviter un utilisateur**, créez les deux comptes avec le rôle **Editor**. Strapi affiche un lien d'inscription à copier : transmettez-le à chacune, par exemple par WhatsApp.
     4. Vérifiez qu'aucun compte `@finikura.test` n'existe, ni dans Medusa ni dans Strapi. Tous les comptes Medusa reçoivent les alertes de commande.
   - Statistiques (FK-10) :
     1. Ouvrez `https://stats.DOMAIN` et connectez-vous avec le compte par défaut d'Umami (`admin` / `umami`). **Changez ce mot de passe tout de suite** : tant qu'il ne l'est pas, n'importe qui peut entrer.
     2. **Settings › Websites › Add website** : nom « Fini Kura », domaine `DOMAIN`. Copiez son identifiant (Website ID) dans `UMAMI_WEBSITE_ID`, puis redéployez le front.
     3. **Settings › Users** : créez le compte de la gérante avec le rôle **View only**. Dans son profil, elle choisit la langue Français.
     4. Entonnoir (FK-30) : dans le site « Fini Kura », ouvrez **Funnels** et créez « Visite → panier → commande », avec trois étapes : une page `/` (ou un visiteur), l'événement `ajout-panier`, puis l'événement `commande`. Les clics WhatsApp se lisent dans **Events**, sous `clic-whatsapp` : la propriété `type` vaut `contact` ou `partage`, et `page` indique le type de page (`produit`, `commande`…). Les coups de cœur (FK-37) se lisent sous `coup-de-coeur`, avec la propriété `action` : `ajout` ou `retrait`. Les blocages du parcours se lisent sous `erreur-formulaire` (propriété `champs` : les champs refusés, jamais leur contenu), `commande-refusee` (`motif` : `limite`, `reseau` ou `autre`), `erreur-page` (`page`) et `guide-tailles` (`produit` : les tenues dont la taille fait hésiter).
6. **Vérifications** :
   - `https://DOMAIN` s'affiche, et `http://DOMAIN` redirige vers le HTTPS ;
   - `docker ps` montre `finikura-medusa`, `finikura-strapi` et `finikura-storefront` en `(healthy)` ;
   - les réponses des cinq domaines portent `Strict-Transport-Security`, et celles du site `Content-Security-Policy` (`curl -sI https://DOMAIN`) ; aucune ne porte `X-Powered-By` ;
   - `https://api.DOMAIN/store/products` et `https://api.DOMAIN/auth/customer/emailpass/register` répondent 404 (l'API boutique ne passe que par le réseau interne), et `https://api.DOMAIN/app` affiche l'admin ;
   - `https://cms.DOMAIN/api/auth/local/register` répond « Register action is currently disabled » ;
   - `https://DOMAIN/robots.txt`, `https://DOMAIN/sitemap.xml` et `https://DOMAIN/llms.txt` répondent, et le sitemap comme `llms.txt` listent les fiches produit ;
   - les journaux de Medusa affichent « Connection to Redis … established », et jamais « fake redis » ni « in-memory » ;
   - une modification publiée dans Strapi apparaît sur le site (revalidation) ;
   - une commande test passe, avec le bouton WhatsApp, et chaque compte de l'admin Medusa reçoit l'e-mail de commande ;
   - « Mot de passe oublié » envoie bien un e-mail, dans l'admin Medusa et dans l'admin Strapi ;
   - les photos des produits et de l'accueil viennent de `https://media.DOMAIN`, et une photo ajoutée dans l'admin Medusa ou Strapi y apparaît aussi ;
   - une visite du site apparaît dans Umami en moins d'une minute, et le site ne crée aucun cookie de statistiques.

## Limite de commandes
Un même numéro de téléphone peut passer 3 commandes en 15 minutes et 10 en 24 heures, une même adresse IP 60 et 400. La limite par adresse est large exprès : au Mali, des centaines de téléphones d'un même réseau mobile partagent une adresse, et un live TikTok en amène beaucoup en même temps. Au-delà, la cliente voit un message qui l'invite à réessayer plus tard ou à écrire sur WhatsApp. Les valeurs se changent dans l'onglet Environment, sans toucher au code : `ORDER_LIMIT_PHONE_15MIN`, `ORDER_LIMIT_PHONE_DAY`, `ORDER_LIMIT_IP_15MIN`, `ORDER_LIMIT_IP_DAY`. Les compteurs sont gardés dans Redis (`ORDER_LIMIT_REDIS_URL`) : ils survivent à un redémarrage ou à un redéploiement du site. Si Redis ne répond pas, le site compte en mémoire et aucune commande n'est refusée pour cette raison.

## Redémarrage du site
Un redémarrage du conteneur du site (panne, `docker restart`) reprend la construction existante : le site revient en quelques secondes. Un redéploiement crée un nouveau conteneur et reconstruit le site (1 à 3 minutes). Pour forcer une reconstruction sans redéployer, mettez `FORCE_REBUILD=1` dans l'onglet Environment.

## Limites de requêtes (audit S6)

Traefik limite ce qu'une même adresse peut envoyer au site. Les valeurs sont très larges, parce qu'au Mali des centaines de téléphones d'un même réseau mobile partagent une adresse, et qu'un live TikTok amène une foule en quelques secondes derrière peu d'adresses. Ce sont des soupapes contre un script emballé, pas un filtre : elles ne doivent jamais gêner une vente en live.

| Ce qui est limité | Valeur par défaut | Variable |
|---|---|---|
| Requêtes sur le site | 400 par seconde, 3 000 en rafale | `FRONT_LIMIT_PER_SECOND`, `FRONT_LIMIT_BURST` |
| Ce qui modifie quelque chose (panier, commande) | 600 par minute, 300 en rafale | `FRONT_LIMIT_POST_PER_MINUTE`, `FRONT_LIMIT_POST_BURST` |
| Connexion à l'admin Medusa et à l'admin Strapi | 10 par minute, 5 en rafale | fixe |

Au-delà, Traefik répond 429 et la limite se lève toute seule. Avant un gros live, ces valeurs se relèvent dans l'onglet Environment, sans toucher au code. Ces limites n'arrêtent pas une attaque massive venue de milliers d'adresses : c'est le rôle de Cloudflare, ci-dessous.

### Capacité mesurée (20 novembre 2026)

Mesures prises depuis le VPS lui-même (2 processeurs, 8 Go), site en production :

| Ce qui est servi | Débit | Remarque |
|---|---|---|
| Pages (accueil, rayon, fiche) | 30 à 38 par seconde | le processeur du site est alors à fond |
| Fichiers statiques (CSS, JS) | environ 180 par seconde | servis et compressés par le site lui-même |

Une nouvelle visiteuse charge une page et une vingtaine de fichiers statiques : le serveur en accueille donc 6 à 8 par seconde, soit environ 400 par minute. Au-delà, les pages ralentissent (file d'attente) au lieu d'échouer : aucune erreur jusqu'à 200 connexions simultanées. Les commandes n'ont pas été testées en charge sur le site en ligne (15 commandes simultanées passées en local).

Même test refait le soir même, une fois Cloudflare actif avec la règle de cache sur `/_next/image` :

| Ce qui est servi | Avant | Derrière Cloudflare | Processeur du site |
|---|---|---|---|
| Fichiers statiques | environ 180 par seconde | 1 660 par seconde | 0 % |
| Images redimensionnées | servies par le site | 1 760 par seconde | proche de 0 % |
| Pages | 30 à 38 par seconde | 37 à 42 par seconde | à fond (un seul cœur) |

Les fichiers et les images ne touchent plus le serveur : il ne lui reste que les pages. Une nouvelle visiteuse lui coûte donc une page et quelques préchargements, au lieu d'une page et d'une trentaine de fichiers. Les pages tiennent leur débit même quand fichiers et images sont demandés en même temps.

Deux remarques pour la suite :
- Cloudflare refuse d'office l'outil de test ApacheBench (403) : ces mesures sont faites avec curl, qui s'annonce comme tel.
- Le site est un seul processus Node : il n'utilise qu'un des deux processeurs. Pour monter plus haut sur les pages, faire tourner deux instances du site derrière Traefik rapporterait plus qu'un VPS plus gros.

## Cloudflare devant le site (actif depuis le 20 novembre 2026)

État : domaine actif sur Cloudflare, six noms en proxy, messagerie en direct. Fait sur le VPS : plages de Cloudflare déclarées dans Traefik (sauvegarde `traefik.yml.avant-cloudflare`). Reste à faire : déployer `CLOUDFLARE_HOPS` à 1, ajouter la règle de cache pour `/_next/image`, puis fermer l'accès direct (ufw). La procédure d'origine est gardée ci-dessous.

Le DNS du domaine est chez Hostinger. Passer par Cloudflare (offre gratuite) met son réseau entre les visiteurs et le VPS : il absorbe les attaques par saturation et cache l'adresse du serveur.

1. Créer un compte Cloudflare, ajouter `fini-kura.fr`. Cloudflare recopie les enregistrements DNS : vérifier qu'il a bien `@`, `www`, `api`, `cms`, `stats`, `media`, et les enregistrements de la messagerie Hostinger (MX, SPF, DKIM), qui restent en « DNS only ».
2. Passer en proxy (nuage orange) : `@`, `www`, `media`, `stats`. Pour `api` et `cms` (les admins), deux choix :
   - proxy aussi : le serveur est entièrement caché, mais un envoi de fichier est limité à 100 Mo (vidéos produit) ;
   - « DNS only » : pas de limite d'envoi, mais l'adresse du VPS reste visible par ces deux noms.
3. SSL/TLS : mode **Full (strict)**. Les certificats Let's Encrypt de Traefik continuent de se renouveler (défi HTTP, que Cloudflare laisse passer).
4. Chez Hostinger, remplacer les serveurs de noms par les deux que Cloudflare indique. La bascule prend de quelques minutes à 24 heures, sans coupure.
5. Sur le VPS, une fois la bascule faite :
   - dans `/etc/dokploy/traefik/traefik.yml`, déclarer les plages d'adresses de Cloudflare (https://www.cloudflare.com/ips/) dans `entryPoints.web.forwardedHeaders.trustedIPs` et `entryPoints.websecure.forwardedHeaders.trustedIPs`, puis redémarrer Traefik. Traefik garde alors l'adresse du visiteur que Cloudflare lui transmet ;
   - `CLOUDFLARE_HOPS` vaut 1 par défaut dans le fichier de production (0 seulement si Cloudflare est retiré). Les limites de requêtes et la limite de commandes lisent alors l'adresse du visiteur, une position avant celle de Cloudflare. Sans ces deux réglages, tous les visiteurs seraient comptés ensemble, comme une seule adresse. Vérifié en local le 20 novembre 2026 : le compte se fait bien par visiteur, même s'il falsifie ses en-têtes ;
   - si tout est en proxy, n'autoriser les ports 80 et 443 que depuis les plages de Cloudflare (`ufw`), pour que personne ne contourne Cloudflare en visant le VPS directement. Un accès direct serait de toute façon compté dans un seul lot par les limites.
6. Dans Cloudflare : activer « Bot Fight Mode ». En cas d'attaque, « Under Attack Mode » ajoute une vérification avant chaque visite.
7. Vérifier : le site, les deux admins, l'envoi d'une photo, une commande de test, l'e-mail d'alerte.

## Revalidation du cache
Medusa (via un subscriber) et Strapi (via l'eventHub) appellent `http://storefront:3100/api/revalidate` par le réseau interne, avec `REVALIDATE_SECRET`. Ce secret doit être le même pour les trois services, ce que garantit la variable unique dans Dokploy.

## Moteurs de recherche et assistants IA
Le site se décrit lui-même : données structurées sur chaque page (boutique, tenues, prix et stock par taille, fil d'Ariane, questions fréquentes), `sitemap.xml`, et `/llms.txt`, un résumé en texte pour les assistants IA, généré depuis Medusa et Strapi. Trois réglages restent à faire au lancement :
1. **IndexNow** : générez une clé (`openssl rand -hex 16`), collez-la dans `INDEXNOW_KEY` puis redéployez. Chaque publication dans Strapi et chaque modification dans Medusa signale alors les pages du site à Bing, et à travers lui à ChatGPT et Copilot, en une à dix minutes. Vérification : `https://DOMAIN/indexnow-key.txt` affiche la clé, et les journaux du site affichent « [indexnow] … pages signalées » après une publication.
2. **Google Search Console** : ajoutez la propriété `DOMAIN` (vérification par enregistrement DNS), puis déclarez `https://DOMAIN/sitemap.xml` dans **Sitemaps**.
3. **Bing Webmaster Tools** : connectez-vous avec un compte Microsoft et choisissez **Importer depuis Google Search Console** : le site et son sitemap sont repris.

Pour contrôler les données structurées d'une page : https://search.google.com/test/rich-results.

## Sauvegardes
- Le script [`infra/backup/backup.sh`](../infra/backup/backup.sh) fait un `pg_dump` des bases `medusa`, `strapi` et `umami` et une archive du stockage Garage (photos et médias). Il n'archive les médias locaux de Strapi que s'il en reste.
- Il retrouve les volumes à partir des conteneurs : Dokploy les nomme d'après son propre projet (`fini-kura-apps-xxxx_finikura-garage`). Si le volume de Garage est introuvable, il s'arrête en erreur au lieu de sauter les photos.
- Il garde les 7 dernières copies (`KEEP`) et supprime les plus anciennes. Une copie pèse environ 2,5 Mo avec le catalogue de démonstration ; seules les photos feront grossir ce chiffre, car chaque nuit les recopie toutes.
- Il copie hors du serveur avec rclone si `RCLONE_REMOTE` est défini. Destination prévue : l'autre VPS (voir FK-09 dans `BACKLOG.md`).
- **État au 19 novembre 2026 :** le script est installé sur le VPS dans `/usr/local/bin/finikura-backup.sh` et testé (sauvegarde, restauration de Medusa dans une base jetable, conservation sur 7), mais **il n'est pas planifié** : le site ne contient que des données de démonstration. Une mise à jour du script dans le dépôt doit être recopiée à cet endroit.
- Pour le planifier, chaque nuit à 3 h :
  ```
  echo '0 3 * * * root /usr/local/bin/finikura-backup.sh >> /var/log/finikura-backup.log 2>&1' > /etc/cron.d/finikura-backup
  ```

### Restauration
```
docker stop finikura-medusa finikura-strapi finikura-storefront
infra/backup/restore.sh /var/backups/finikura/<date> all
docker start finikura-medusa finikura-strapi finikura-storefront
```
Le procédé a été testé en local le 12 novembre 2026 : après restauration sur un PostgreSQL vide, on retrouve 147 tables Medusa, 73 tables Strapi, 18 produits et 14 commandes, comme dans la source.

## Le jour où le domaine est choisi
1. Mettez à jour la variable `DOMAIN` dans Dokploy.
2. Créez les cinq enregistrements DNS.
3. Redéployez.

Les CORS, les URL publiques et les certificats découlent tous de `DOMAIN`.

## Stockage des médias (Garage)
- Les photos des produits (Medusa) et les médias de Strapi sont dans le bucket `media` de Garage, un stockage d'objets compatible S3 qui tourne sur le VPS. Medusa et Strapi y écrivent par l'API S3 interne (`http://garage:3900`). Le public les lit sur `https://media.DOMAIN`.
- Garage a remplacé MinIO, dont l'édition communautaire n'est plus maintenue depuis 2025.
- **Médias Strapi déjà en ligne avant Garage** : `cd /app/apps/strapi && pnpm media:migrate`. Chaque fichier garde son identifiant, donc l'accueil, les campagnes et les pages ne changent pas. Une fois les images vérifiées sur le site, le volume `finikura-strapi-uploads` peut être vidé.
- **Restauration** : arrêtez Garage, videz son volume, décompressez `garage.tar.gz` dedans, puis copiez `meta/snapshots/<date la plus récente>/db.sqlite` en `meta/db.sqlite`, avant de redémarrer.

## Aperçu caché des moteurs avant l'ouverture

Pour montrer le site à la cliente sans qu'il soit référencé, mettez `NOINDEX=1` dans les variables de Dokploy, puis redéployez.

- Le site reste visible, sans mot de passe, pour qui a son adresse.
- `robots.txt` répond « Disallow: / » pour tous les robots, moteurs de recherche et IA.
- Chaque page porte l'en-tête `X-Robots-Tag: noindex, nofollow, noarchive, nosnippet`.
- `/sitemap.xml` et `/llms.txt` répondent 404, et IndexNow reste éteint même si `INDEXNOW_KEY` est renseigné.
- Les aperçus de lien sur WhatsApp continuent de s'afficher.

Ces réglages s'adressent aux robots qui respectent les règles, ce qui est le cas de Google, de Bing et des principaux robots d'IA. Ils ne protègent pas le site d'une personne qui a l'adresse.

Le jour de l'ouverture, videz `NOINDEX` et redéployez. La liste de ce qui reste à faire avant ce jour est dans [`avant-ouverture.md`](avant-ouverture.md).
