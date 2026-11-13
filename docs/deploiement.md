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
   - Medusa : `cd /app/apps/medusa && pnpm seed`. Le seed affiche la clé publique du canal « Site Fini Kura » : copiez-la dans `MEDUSA_PUBLISHABLE_KEY`, puis redéployez.
   - Strapi : `cd /app/apps/strapi && pnpm seed`.
   - Comptes de l'admin (FK-08). Personne ne choisit le mot de passe à la place de la gérante ou de sa sœur :
     1. Medusa, premier accès : `cd /app/apps/medusa/.medusa/server && ../../node_modules/.bin/medusa user -e <email de la gérante> --invite`. La commande affiche un jeton : envoyez-lui le lien `https://api.DOMAIN/app/invite?token=<jeton>`, valable 24 heures. Elle y choisit son mot de passe.
     2. Medusa, sa sœur : la gérante l'invite depuis **Paramètres › Utilisateurs › Inviter**. L'e-mail d'invitation part par la boîte Hostinger.
     3. Strapi : ouvrez `https://cms.DOMAIN/admin` et créez le compte Super Admin technique, qui est le vôtre. Puis, dans **Paramètres › Utilisateurs › Inviter un utilisateur**, créez les deux comptes avec le rôle **Editor**. Strapi affiche un lien d'inscription à copier : transmettez-le à chacune, par exemple par WhatsApp.
     4. Vérifiez qu'aucun compte `@finikura.test` n'existe, ni dans Medusa ni dans Strapi. Tous les comptes Medusa reçoivent les alertes de commande.
   - Statistiques (FK-10) :
     1. Ouvrez `https://stats.DOMAIN` et connectez-vous avec le compte par défaut d'Umami (`admin` / `umami`). **Changez ce mot de passe tout de suite** : tant qu'il ne l'est pas, n'importe qui peut entrer.
     2. **Settings › Websites › Add website** : nom « Fini Kura », domaine `DOMAIN`. Copiez son identifiant (Website ID) dans `UMAMI_WEBSITE_ID`, puis redéployez le front.
     3. **Settings › Users** : créez le compte de la gérante avec le rôle **View only**. Dans son profil, elle choisit la langue Français.
6. **Vérifications** :
   - `https://DOMAIN` s'affiche, et `http://DOMAIN` redirige vers le HTTPS ;
   - les journaux de Medusa affichent « Connection to Redis … established », et jamais « fake redis » ni « in-memory » ;
   - une modification publiée dans Strapi apparaît sur le site (revalidation) ;
   - une commande test passe, avec le bouton WhatsApp, et chaque compte de l'admin Medusa reçoit l'e-mail de commande ;
   - « Mot de passe oublié » envoie bien un e-mail, dans l'admin Medusa et dans l'admin Strapi ;
   - les photos des produits et de l'accueil viennent de `https://media.DOMAIN`, et une photo ajoutée dans l'admin Medusa ou Strapi y apparaît aussi ;
   - une visite du site apparaît dans Umami en moins d'une minute, et le site ne crée aucun cookie de statistiques.

## Revalidation du cache
Medusa (via un subscriber) et Strapi (via l'eventHub) appellent `http://storefront:3100/api/revalidate` par le réseau interne, avec `REVALIDATE_SECRET`. Ce secret doit être le même pour les trois services, ce que garantit la variable unique dans Dokploy.

## Sauvegardes
- Le script [`infra/backup/backup.sh`](../infra/backup/backup.sh) fait un `pg_dump` des bases `medusa`, `strapi` et `umami`, une archive du stockage Garage (photos et médias), plus une archive des médias Strapi.
- Il garde 14 jours de sauvegardes en local, et copie hors du serveur avec rclone si `RCLONE_REMOTE` est défini.
- **À décider :** la destination hors du serveur (par exemple Backblaze B2 ou Cloudflare R2). Sans elle, le critère de FK-09 n'est pas rempli.
- Pour l'installer sur le VPS, chaque nuit à 3 h :
  ```
  0 3 * * * RCLONE_REMOTE=<remote:dossier> /chemin/vers/finikura/infra/backup/backup.sh >> /var/log/finikura-backup.log 2>&1
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
