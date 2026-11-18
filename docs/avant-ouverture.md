# Avant l'ouverture au public

Le site est d'abord déployé sur le VPS avec les données du local, pour le montrer à la cliente. Il n'a pas de mot de passe, mais il reste caché des moteurs de recherche et des IA. Cette liste suit ce qu'il faut changer avant de l'ouvrir : on coche au fur et à mesure, et on n'ouvre que lorsque la première partie est entièrement cochée.

Dernière mise à jour : 18 novembre 2026.

## Pendant l'aperçu : le site reste caché des moteurs

- [x] Le site sait se cacher : avec `NOINDEX=1`, `robots.txt` interdit tout aux moteurs de recherche et aux robots des IA, chaque page porte `noindex`, `sitemap.xml` et `llms.txt` répondent 404 et IndexNow reste éteint. Les personnes qui ont l'adresse voient le site normalement, sans mot de passe.
- [ ] Au déploiement : mettre `NOINDEX=1` dans les variables du VPS.
- [ ] Après le déploiement : ouvrir `https://DOMAINE/robots.txt` et vérifier qu'il répond « Disallow: / ».
- [ ] Ne partager l'adresse qu'avec la cliente : un lien publié ailleurs peut faire apparaître l'adresse dans Google, sans son contenu.
- [ ] Ne pas créer la fiche Google Business Profile ni la propriété Search Console avant l'ouverture.

## À corriger avant d'ouvrir

### Données de démonstration

- [ ] Remplacer les trois avis d'exemple de l'accueil par de vrais avis, avec l'accord écrit des clientes, ou retirer le bloc.
- [ ] Retirer la « Vidéo d'exemple » et la vidéo « en préparation » de la fiche Robe Terracotta Brodée, ou les remplacer par une vraie vidéo.
- [ ] Retirer ou réécrire la campagne de démonstration Tabaski 2027 et sa collection.
- [ ] Mettre le vrai numéro WhatsApp de la boutique à la place du numéro de test.
- [ ] Annuler les commandes de test et remettre le stock à ses vraies valeurs.
- [ ] Saisir les vrais prix et le vrai stock de chaque taille.
- [ ] Corriger l'adresse des deux fiches qui ne correspond pas au nom : `robe-bicolore-terracotta-et-rose` (Robe Rouge à Rayures) et `ensemble-rose-et-lin` (Robe Marine Col Claudine). Plusieurs adresses contiennent aussi « lin » alors que les vêtements sont en coton. Une adresse ne se change plus proprement après l'ouverture.

### Photos

- [ ] Photo du héros de l'accueil : c'est une tunique sur un cintre, alors que son texte alternatif décrit deux enfants. Mettre une photo d'enfants habillés et accorder le texte alternatif.
- [ ] Photo de Mariam sur la page Notre histoire, si elle l'accepte.
- [ ] Relire toutes les photos de l'accueil, des catégories et des fiches : elles doivent montrer des enfants qui ressemblent à la clientèle, et aucune photo d'atelier de couture.
- [ ] Remplacer peu à peu les photos générées par des photos prises à Bamako, avec l'accord des parents.

### Textes à confirmer avec la cliente

- [ ] « Paris » dans le sous-titre du héros : ses clientes achetaient-elles bien à Paris ?
- [ ] Conseils d'entretien : le texte actuel est un conseil général pour le coton (30 °C, sur l'envers, séchage à l'air, fer doux). Le comparer aux étiquettes des vêtements.
- [ ] Descriptions des 19 tenues : relire la coupe et les détails de chaque fiche face au vêtement réel.
- [ ] Relire dans l'admin Strapi les textes de l'accueil, des catégories et des pages.

### Comptes et mesure

- [ ] Vérifier que les comptes Facebook et TikTok du pied de page existent et appartiennent à la boutique, et y publier quelques vidéos.
- [ ] Dire si un compte Instagram est prévu, et l'ajouter au pied de page.
- [ ] Brancher Umami (`UMAMI_SCRIPT_URL`, `UMAMI_WEBSITE_ID`) et créer l'entonnoir décrit dans `docs/deploiement.md`.

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
- [ ] Ajouter un tri dans les catégories au-delà de 30 tenues.

## Déjà fait

- [x] Héros de l'accueil : « Cette année, tantie voyage léger. », surtitre en badge, boutons Fille et Garçon.
- [x] Règle d'échange (72 heures) et délai de livraison (48 heures) affichés.
- [x] Descriptions en trois temps et conseils d'entretien sur les 19 tenues.
- [x] Notre histoire signée « Mariam, fondatrice de Fini Kura ».
- [x] Référencement : adresses canoniques, titres, données structurées, questions fréquentes, `llms.txt`.
- [x] Événement Umami `vue-produit`.
- [x] Menu : « Mentions légales », sans CGV.
