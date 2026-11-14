# Vos accès à l'administration Fini Kura

Vous avez trois espaces, chacun avec votre adresse e-mail et votre propre mot de passe.

| Espace | Adresse | Pour quoi faire |
|---|---|---|
| **Boutique** | `https://api.<domaine>/app` | Commandes, produits, tailles, stock |
| **Contenu** | `https://cms.<domaine>/admin` | Page d'accueil, pages, campagnes, guides des tailles |
| **Statistiques** | `https://stats.<domaine>` | Nombre de visites, pages et produits les plus vus, d'où viennent les visiteuses |

Ne donnez jamais votre mot de passe, même à une personne de l'équipe : chacune a le sien.

## J'ai oublié mon mot de passe

**Boutique**
1. Ouvrez l'adresse de la boutique.
2. Sous le bouton de connexion, touchez **Réinitialiser**, puis entrez votre adresse e-mail.
3. Ouvrez l'e-mail « Choisir un nouveau mot de passe · Fini Kura ». Regardez aussi dans les spams.
4. Touchez le bouton, puis choisissez un nouveau mot de passe. **Le lien ne marche que 15 minutes** : s'il a expiré, recommencez.

**Contenu**
1. Ouvrez l'adresse du contenu.
2. Touchez **Mot de passe oublié ?**, puis entrez votre adresse e-mail.
3. Ouvrez l'e-mail reçu, puis suivez le lien pour choisir un nouveau mot de passe.

Si aucun e-mail n'arrive après quelques minutes, prévenez la personne qui s'occupe du site.

## Lire les statistiques

- **Visiteurs** : le nombre de personnes différentes sur la période choisie, en haut à droite (aujourd'hui, 7 jours, 30 jours…).
- **Pages** : les pages les plus vues. Une adresse en `/produits/…` est une fiche produit.
- **Sources** : d'où arrivent les visiteuses (WhatsApp, Facebook, Instagram, Google…). « Direct » veut dire un lien tapé ou partagé sans source connue.
- **Pays** et **Appareils** : par exemple Mali ou France, téléphone ou ordinateur.

Les statistiques ne contiennent ni nom ni numéro de téléphone : elles comptent les visites, sans savoir qui les fait.

Si vous oubliez ce mot de passe, il n'y a pas de lien « Mot de passe oublié » : demandez à la personne qui s'occupe du site de le réinitialiser.

## Ajouter une légende sous une photo portée
Sous une photo où un enfant porte le vêtement, vous pouvez écrire par exemple « Aïcha, 7 ans, 1,22 m, porte le 7-8 ans ». Donnez sa taille en mètres : les mamans comparent avec leur enfant. La première légende du produit est aussi rappelée dans le guide des tailles de la fiche, comme enfant témoin. Uniquement le prénom, et avec l'accord écrit des parents.
1. Dans l'admin Medusa, ouvrez le produit.
2. Dans le bloc **Métadonnées**, cliquez sur **Modifier**.
3. Ajoutez une ligne :
   - clé : `photo_portee_` suivi du numéro de la photo dans la galerie, par exemple `photo_portee_2` pour la deuxième photo ;
   - valeur : la légende.
4. Enregistrez. Pour retirer la légende, supprimez la ligne.

Indiquez seulement le prénom et l'âge, jamais le nom de famille. Gardez l'accord écrit des parents pour chaque photo d'enfant.

## Mettre un temps fort en avant sur l'accueil (rentrée, Tabaski, fêtes)

Un temps fort, c'est une **campagne**. Dans Strapi, ouvrez **Campagnes** et créez-la (ou ouvrez-la) :

1. Remplissez le titre, l'accroche (headline), la description, la bannière et la collection Medusa, comme pour toute campagne.
2. Choisissez **start_date** (début) et **end_date** (fin).
3. Cochez **feature_on_home** (« mettre en avant sur l'accueil »). Si vous le souhaitez, écrivez le texte du bouton dans **hero_cta_text** ; sinon le bouton dit « Découvrir la collection ».
4. Publiez.

Pendant ses dates, la grande image de l'accueil devient celle de la campagne, et son bouton mène à la page de la campagne. Elle apparaît dans l'heure qui suit minuit le premier jour, et disparaît à 23 h (heure de Bamako) le dernier jour, juste avant la fermeture de la page. Le reste de l'année, l'accueil affiche sa **Grande image** habituelle : il n'y en a qu'une, dans **Accueil**.

Une campagne dont la collection n'a aucun produit en vente n'est pas mise en avant. Si deux campagnes mises en avant se chevauchent, c'est celle qui a commencé le plus récemment qui s'affiche. La liste des **Campagnes** sert de calendrier : début, fin, mise en avant.

Dans Umami, les clics sur le bouton se lisent sous l'événement `clic-hero`, avec le titre de la campagne (ou de la grande image).

## Changer le bandeau des pages Filles et Garçons

Dans Strapi, ouvrez **Bandeaux des catégories**, puis le bandeau `filles` ou `garcons`. Une phrase courte (120 caractères au plus) et une petite photo carrée, légère (moins de 40 Ko). Publiez. Sans bandeau publié, la page affiche le titre et la description de la catégorie, comme avant.

## Donner un accès à une nouvelle personne

**Boutique** : **Paramètres › Utilisateurs › Inviter**, puis entrez son adresse e-mail. Elle reçoit un e-mail, valable 24 heures, pour choisir son mot de passe. Attention : chaque personne qui a accès à la boutique reçoit aussi l'e-mail de chaque nouvelle commande.

**Contenu** : **Paramètres › Utilisateurs › Inviter un utilisateur**, avec le rôle **Editor**. Le site affiche un lien : copiez-le et envoyez-le à la personne, par exemple par WhatsApp.

## Retirer un accès

Dans les deux espaces : **Paramètres › Utilisateurs**, choisissez la personne, puis supprimez-la. Elle ne peut plus se connecter, et elle ne reçoit plus les e-mails de commande.
