# Déploiement de Fini Kura (VPS Hostinger, Dokploy)

## Vue d'ensemble

| Service | Conteneur | Adresse publique | Adresse interne |
|---|---|---|---|
| Front (Next.js) | `finikura-storefront` | `https://DOMAIN` | `http://storefront:3100` |
| Medusa (vente, admin `/app`) | `finikura-medusa` | `https://api.DOMAIN` | `http://medusa:9000` |
| Strapi (contenu, admin `/admin`) | `finikura-strapi` | `https://cms.DOMAIN` | `http://strapi:1337` |
| PostgreSQL 16 (bases `medusa` et `strapi`) | `finikura-postgres` | aucune | `postgres:5432` |
| Redis 7 | `finikura-redis` | aucune | `redis:6379` |

- Fichiers : [`Dockerfile`](../Dockerfile) (une cible par appli), [`infra/dokploy/docker-compose.prod.yml`](../infra/dokploy/docker-compose.prod.yml) et [`infra/dokploy/.env.example`](../infra/dokploy/.env.example).
- Aucun port n'est publié. Traefik, géré par Dokploy, sert les trois domaines par le réseau `dokploy-network`, et fournit le HTTPS avec Let's Encrypt et la redirection du HTTP vers le HTTPS.
- Tous les noms (conteneurs, volumes, réseau `finikura-internal`, routeurs Traefik) commencent par `finikura-`, ce qui évite les conflits avec les autres sites du VPS.
- Le front est construit **au démarrage de son conteneur**, une fois Medusa et Strapi joignables. Les pages pré-rendues contiennent ainsi les vraies données. Un redémarrage du front prend donc 1 à 3 minutes.

## Mémoire à prévoir
Comptez environ 2 Go : Medusa 500 à 700 Mo, Strapi 400 à 600 Mo, Next 300 à 500 Mo (et plus pendant son build), PostgreSQL 150 Mo, Redis 128 Mo au maximum. Vérifiez avec `free -h` sur le VPS avant la mise en ligne.

## Première mise en ligne
1. **DNS**, chez le registraire du domaine choisi : des enregistrements A pour `DOMAIN`, `api.DOMAIN` et `cms.DOMAIN`, qui pointent vers l'adresse IP du VPS.
2. **Dokploy** :
   - créez le projet « Fini Kura », puis un service **Compose** ;
   - source : GitHub, dépôt `PaulWayne/finikura`, branche `main` ;
   - chemin du compose : `infra/dokploy/docker-compose.prod.yml`.
3. **Environment** : collez le contenu de `infra/dokploy/.env.example`, puis renseignez les valeurs.
   - Chaque secret se génère avec `openssl rand -hex 32`. `STRAPI_APP_KEYS` attend quatre valeurs séparées par des virgules.
   - Gardez `POSTGRES_USER=finikura`, car le script `infra/postgres-init.sql` crée la base `strapi` pour cet utilisateur.
   - Laissez `MEDUSA_PUBLISHABLE_KEY` vide pour l'instant (voir l'étape 5).
4. **Deploy**. Medusa applique ses migrations au démarrage.
5. **Données de départ** (une seule fois), dans le terminal du conteneur, depuis Dokploy :
   - Medusa : `cd /app/apps/medusa && pnpm seed`. Le seed affiche la clé publique du canal « Site Fini Kura » : copiez-la dans `MEDUSA_PUBLISHABLE_KEY`, puis redéployez.
   - Strapi : `cd /app/apps/strapi && pnpm seed`.
   - Comptes de l'admin Medusa (FK-08) : `cd /app/apps/medusa/.medusa/server && ../../node_modules/.bin/medusa user -e <email> -p <mot de passe>`.
6. **Vérifications** :
   - `https://DOMAIN` s'affiche, et `http://DOMAIN` redirige vers le HTTPS ;
   - les journaux de Medusa affichent « Connection to Redis … established », et jamais « fake redis » ni « in-memory » ;
   - une modification publiée dans Strapi apparaît sur le site (revalidation) ;
   - une commande test passe, avec le bouton WhatsApp.

## Revalidation du cache
Medusa (via un subscriber) et Strapi (via l'eventHub) appellent `http://storefront:3100/api/revalidate` par le réseau interne, avec `REVALIDATE_SECRET`. Ce secret doit être le même pour les trois services, ce que garantit la variable unique dans Dokploy.

## Sauvegardes
- Le script [`infra/backup/backup.sh`](../infra/backup/backup.sh) fait un `pg_dump` des bases `medusa` et `strapi`, plus une archive des médias Strapi.
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
2. Créez les trois enregistrements DNS.
3. Redéployez.

Les CORS, les URL publiques et les certificats découlent tous de `DOMAIN`.
