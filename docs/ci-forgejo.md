# Intégration continue sur Forgejo (FK-28)

Le dépôt est sur https://git.kaliclean.fr/Paul/FiniKura. Forgejo Actions lance les vérifications sur le VPS de production, par un runner limité pour ne pas ralentir le site.

## Ce qui tourne, et quand

| Workflow | Quand | Contenu |
|---|---|---|
| `.forgejo/workflows/ci.yml` | À chaque push et chaque pull request | Lint et typecheck des trois applis, tests unitaires Medusa, puis tests Medusa sur un PostgreSQL jetable et parcours e2e du front en mode mock |
| `.forgejo/workflows/e2e-live.yml` | Chaque nuit à 2 h, ou à la main (onglet Actions, « Run workflow ») avant une fusion dans `main` | Parcours e2e en mode live : front, Medusa et Strapi sur un PostgreSQL jetable, avec les seeds |

Les tests démarrent leurs propres conteneurs (PostgreSQL). Il faut donc que le runner donne accès à Docker.

## Installer le runner sur le VPS

1. Dans Forgejo, activer Actions pour le dépôt (Paramètres → Unités → Actions), puis créer un jeton d'enregistrement (Paramètres → Actions → Runners → Créer un runner).
2. Installer le runner Forgejo (`forgejo-runner`) dans sa dernière version stable, en suivant la doc officielle : https://forgejo.org/docs/latest/admin/actions/runner-installation/
3. L'enregistrer avec le label `docker:docker://node:22-bookworm`. Le jeton se saisit à ce moment-là : il ne va ni dans le dépôt ni dans un fichier commité.
4. Dans le `config.yml` du runner, régler :

```yaml
runner:
  capacity: 1            # un seul job à la fois
container:
  network: host          # les tests joignent leur PostgreSQL sur 127.0.0.1
  docker_host: automount # le socket Docker est monté dans les jobs
  options: --cpus 1 --memory 3g
```

Vérifier ces clés dans la doc de la version installée du runner : elles ont changé entre versions.

**Limite à connaître :** `--cpus 1 --memory 3g` limite le conteneur du job, pas le PostgreSQL de test qu'il démarre à côté. Ce dernier reste petit (base en mémoire, quelques Mo). On surveille la charge du VPS les premières semaines. Si les tests gênent le site, le runner passe sur une autre machine sans rien changer aux workflows.

## Bloquer la fusion si la CI échoue

Dans Forgejo : Paramètres du dépôt → Branches → Protection de `main` :
- interdire le push direct ;
- exiger que les vérifications de statut passent, en cochant les jobs `CI / Lint, typecheck, tests unitaires`, `CI / Tests Medusa (PostgreSQL jetable)` et `CI / Parcours e2e (mode mock)`.

Ils n'apparaissent dans la liste qu'après une première exécution.
