# Intégration continue sur Forgejo (FK-28)

Le dépôt est sur https://git.kaliclean.fr/Paul/FiniKura. Forgejo Actions lance les vérifications sur le VPS de production, par un runner déployé dans Dokploy et plafonné pour ne pas ralentir le site.

## Ce qui tourne, et quand

| Job | Quand | Durée indicative |
|---|---|---|
| `CI / Lint, typecheck, tests unitaires` | À chaque push | 3 à 5 min |
| `CI / Tests Medusa et e2e mock` | Pull request vers `main`, ou push dans `main` | environ 10 min |
| `E2E live / Parcours e2e (mode live)` | Chaque nuit à 2 h, ou à la main (onglet Actions, « Run workflow ») avant une fusion dans `main` | plus long |

Les dépendances pnpm restent dans le volume Docker `fk-pnpm-store` d'une exécution à l'autre : seule la première installation est longue.

## Le runner dans Dokploy

Un service compose avec deux conteneurs :
- `dind` : le Docker dans lequel tournent les jobs et le PostgreSQL de test. Il est plafonné à 1 CPU et 3 Go, ce qui borne toute la CI.
- `runner` : `forgejo-runner`, qui écrit son `config.yml` à chaque démarrage.

```yaml
services:
  dind:
    image: docker:27-dind
    restart: unless-stopped
    privileged: true
    command: ["dockerd", "-H", "tcp://0.0.0.0:2375", "--tls=false"]
    volumes:
      - dind-data:/var/lib/docker
    cpus: 1
    mem_limit: 3g

  runner:
    image: data.forgejo.org/forgejo/runner:13
    restart: unless-stopped
    depends_on: [dind]
    user: "0:0"
    working_dir: /data
    environment:
      DOCKER_HOST: tcp://dind:2375
      INSTANCE: https://git.kaliclean.fr
      TOKEN: ${RUNNER_TOKEN}
    volumes:
      - runner-data:/data
    command:
      - sh
      - -c
      - |
        until wget -qO- http://dind:2375/_ping >/dev/null 2>&1; do echo "attente de dind..."; sleep 2; done
        cat > /data/config.yml <<'EOF'
        log:
          level: info
        runner:
          file: .runner
          capacity: 1
          envs:
            DOCKER_HOST: tcp://127.0.0.1:2375
        container:
          network: host
          docker_host: "-"
          valid_volumes:
            - fk-pnpm-store
        EOF
        if [ ! -f .runner ]; then forgejo-runner register --no-interactive --instance "$$INSTANCE" --token "$$TOKEN" --name dokploy-runner --labels "docker:docker://node:20-bookworm,ubuntu-latest:docker://node:20-bookworm"; fi
        exec forgejo-runner daemon --config /data/config.yml

volumes:
  dind-data:
  runner-data:
```

- `network: host` : les jobs partagent le réseau de `dind`. Ils y joignent son Docker (`127.0.0.1:2375`) et le PostgreSQL que publient les tests sur `127.0.0.1`.
- `valid_volumes` : autorise les workflows à monter le volume `fk-pnpm-store`.
- Le port 2375 de `dind` n'a pas de mot de passe : ne jamais le publier hors du compose.
- `RUNNER_TOKEN` ne sert qu'au premier enregistrement. Il va dans les variables d'environnement de Dokploy, jamais dans le dépôt.

## Bloquer la fusion si la CI échoue

Dans Forgejo : Paramètres du dépôt → Branches → Protection de `main` :
- interdire le push direct ;
- exiger que les vérifications de statut passent, en cochant `CI / Lint, typecheck, tests unitaires` et `CI / Tests Medusa et e2e mock`.

Ils n'apparaissent dans la liste qu'après une première exécution, donc après une première pull request vers `main`.
