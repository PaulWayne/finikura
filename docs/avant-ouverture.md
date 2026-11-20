# Avant l'ouverture au public

Le site est en ligne en aperçu sur https://fini-kura.fr, avec les données de démonstration, pour le montrer à la cliente. Il n'a pas de mot de passe, mais il reste caché des moteurs de recherche et des IA. Cette liste suit ce qu'il faut changer avant de l'ouvrir : on coche au fur et à mesure, et on n'ouvre que lorsque la partie « À corriger avant d'ouvrir » est entièrement cochée.

Dernière mise à jour : 20 novembre 2026.

À partir de maintenant, le contenu du site en ligne se modifie dans les admins (Medusa et Strapi), pas dans les fixtures du dépôt. Relancer un seed avec `--refresh` sur le serveur écraserait ce qui a été saisi dans Strapi.

## Pendant l'aperçu : le site reste caché des moteurs

- [x] Le site sait se cacher : avec `NOINDEX=1`, `robots.txt` interdit tout aux moteurs de recherche et aux robots des IA, chaque page porte `noindex`, `sitemap.xml` et `llms.txt` répondent 404 et IndexNow reste éteint.
- [x] `NOINDEX=1` est en place sur le serveur.
- [x] Vérifié en ligne : `https://fini-kura.fr/robots.txt` répond « Disallow: / ».
- [ ] Ne partager l'adresse qu'avec la cliente : un lien publié ailleurs peut faire apparaître l'adresse dans Google, sans son contenu.
- [ ] Ne pas créer la fiche Google Business Profile ni la propriété Search Console avant l'ouverture.

## À corriger avant d'ouvrir

### À décider avec la cliente

- [ ] Le catalogue : les 19 tenues en ligne sont-elles les vraies, ou seront-elles remplacées ? Tout le reste de cette partie en dépend.
- [ ] « Paris » dans le sous-titre du héros : ses clientes achetaient-elles bien à Paris ?
- [ ] Un compte Instagram est-il prévu ? Si oui, l'ajouter au pied de page.
- [ ] Photo de Mariam sur la page Notre histoire, si elle l'accepte.

### Données de démonstration, à remplacer dans les admins

- [ ] Avis de l'accueil : ce sont trois textes d'exemple. L'un porte désormais un vrai nom (« Assitan B, Kalaban ») sur un texte d'exemple. Les remplacer par de vrais avis, avec l'accord écrit des clientes, ou retirer le bloc.
- [ ] Retirer la « Vidéo d'exemple » et la vidéo « en préparation » de la fiche Robe Terracotta Brodée (admin Medusa), ou les remplacer par une vraie vidéo.
- [ ] Retirer ou réécrire la campagne de démonstration Tabaski 2027 et sa collection.
- [ ] Mettre le vrai numéro WhatsApp de la boutique à la place du numéro de test (Strapi, réglages globaux).
- [ ] Saisir les vrais prix et le vrai stock de chaque taille.
- [ ] Adresses des fiches : dix adresses ne correspondent pas au produit. Deux portent un autre nom (`robe-bicolore-terracotta-et-rose` pour la Robe Rouge à Rayures, `ensemble-rose-et-lin` pour la Robe Marine Col Claudine), une troisième aussi (`robe-poudree-en-lin` pour la Robe Fleurie Bleu Gris), et les autres contiennent « lin » alors que les vêtements sont en coton. À corriger une fois le catalogue décidé : une adresse ne se change plus proprement après l'ouverture.

### Photos

- [ ] Photo du héros de l'accueil : c'est une tunique sur un cintre, alors que son texte alternatif décrit deux enfants. Mettre une photo d'enfants habillés et accorder le texte alternatif.
- [ ] Relire toutes les photos de l'accueil, des catégories et des fiches : elles doivent montrer des enfants qui ressemblent à la clientèle, et aucune photo d'atelier de couture.
- [ ] Remplacer peu à peu les photos générées par des photos prises à Bamako, avec l'accord des parents.

### Textes à relire

- [ ] Conseils d'entretien : le texte actuel est un conseil général pour le coton (30 °C, sur l'envers, séchage à l'air, fer doux). Le comparer aux étiquettes des vêtements.
- [ ] Descriptions des 19 tenues : relire la coupe et les détails de chaque fiche face au vêtement réel.
- [ ] Relire dans l'admin Strapi les textes de l'accueil, des catégories et des pages.

### Technique

- [ ] Planifier les sauvegardes de nuit dès que les vraies données arrivent (script installé et testé, non planifié), puis la copie vers l'autre VPS. Détail dans `docs/deploiement.md` et FK-09.
- [ ] Après le prochain déploiement, remplir dans l'admin Strapi (Réglages globaux) les quatre nouveaux champs : `founder_name`, `founder_role`, `exchange_days` (3), `delivery_max_days` (2). Ils servent aux données structurées lues par Google et les IA. Vides, ces données sont simplement absentes.
- [ ] Tester « Mot de passe oublié » dans l'admin Medusa et dans l'admin Strapi : un e-mail doit arriver.
- [ ] Inviter Mariam dans Medusa (`pnpm invite:admin`), dans Strapi (rôle Editor) et dans Umami (lecture seule).
- [ ] Vérifier que les comptes Facebook et TikTok du pied de page existent et appartiennent à la boutique, et y publier quelques vidéos.
- [ ] Le fichier `.env` que Dokploy écrit sur le VPS est lisible par tous les comptes du serveur. Sans gravité tant que `root` est le seul compte.

## Le jour de l'ouverture

- [ ] Vider `NOINDEX` et redéployer : l'indexation reprend, `sitemap.xml` et `llms.txt` reviennent.
- [ ] Créer la propriété Search Console et y déposer `sitemap.xml`.
- [ ] Créer la fiche Google Business Profile en zone desservie (Bamako), sans adresse.
- [ ] Renseigner `INDEXNOW_KEY`.
- [ ] Passer une vraie commande de bout en bout, jusqu'au message WhatsApp.

## Après l'ouverture

- [ ] Suivre l'indexation dans Search Console la première semaine.
- [ ] Recueillir 3 à 5 vrais avis, avec accord écrit.
- [ ] Rappeler par WhatsApp les commandes non confirmées sous 24 heures.
- [ ] Suivre chaque semaine : visites, fiches vues, commandes passées, commandes livrées.
- [ ] Mettre des liens UTM sur toutes les publications TikTok, Facebook et statuts WhatsApp.
- [ ] Enrichir les statistiques : entonnoir par fiche (vue produit, panier, commande), clics WhatsApp, origine des visites.
- [ ] Ajouter un tri dans les catégories au-delà de 30 tenues.

## Déjà fait

- [x] Site en ligne en HTTPS sur `fini-kura.fr`, `www` redirigé, serveur piloté par le Dokploy existant.
- [x] Contenu chargé : 19 tenues, photos dans Garage, accueil, pages, guides des tailles.
- [x] Comptes admin créés : Medusa, Strapi, Umami (mot de passe par défaut changé).
- [x] Boîte d'envoi branchée : `contact@fini-kura.fr` chez Hostinger, expéditeur « Fini Kura ». E-mails aux couleurs du site.
- [x] Commande de test FK-1 : enregistrée, stock réservé, alerte e-mail reçue en une seconde, puis annulée dans l'admin et stock libéré.
- [x] Une modification publiée dans Strapi apparaît sur le site sans redéploiement.
- [x] Statistiques Umami branchées, entonnoir « Visite, panier, commande » créé.
- [x] Règles de sécurité Traefik indépendantes du front : vérifié en ligne.
- [x] Nettoyage Docker chaque nuit, journaux limités, pare-feu, SSH par clé seule.
- [x] Héros de l'accueil : « Cette année, tantie voyage léger. », surtitre en badge, boutons Fille et Garçon.
- [x] Règle d'échange (72 heures) et délai de livraison (48 heures) affichés.
- [x] Descriptions en trois temps et conseils d'entretien sur les 19 tenues.
- [x] Notre histoire signée « Mariam, fondatrice de Fini Kura ».
- [x] Référencement : adresses canoniques, titres, données structurées, questions fréquentes, `llms.txt`.
- [x] Menu : « Mentions légales », sans CGV.
