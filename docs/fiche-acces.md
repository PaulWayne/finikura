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

## Préparer un hero pour un temps fort (rentrée, Tabaski, fêtes)

Dans Strapi, ouvrez **Accueil**. Vous pouvez y ajouter plusieurs blocs **Grande image** : un seul s'affiche à la fois.

1. Ajoutez un bloc **Grande image**, donnez-lui un **nom** (par exemple « Tabaski 2027 »), une image, un titre et un bouton.
2. Remplissez **starts_at** (début) et **ends_at** (fin). Le site affiche ce hero pendant cette période, au plus tard une heure après la date de début.
3. Gardez toujours un bloc **sans dates** : c'est le hero par défaut, affiché quand aucun temps fort n'est en cours.
4. Publiez.

Si le bouton d'un hero mène à une campagne dépubliée, ce hero ne s'affiche pas et le hero par défaut prend sa place. Dans Umami, les clics se lisent sous l'événement `clic-hero`, avec le nom du hero.

## Changer le bandeau des pages Filles et Garçons

Dans Strapi, ouvrez **Bandeaux des catégories**, puis le bandeau `filles` ou `garcons`. Une phrase courte (120 caractères au plus) et une petite photo carrée, légère (moins de 40 Ko). Publiez. Sans bandeau publié, la page affiche le titre et la description de la catégorie, comme avant.

## Donner un accès à une nouvelle personne

**Boutique** : **Paramètres › Utilisateurs › Inviter**, puis entrez son adresse e-mail. Elle reçoit un e-mail, valable 24 heures, pour choisir son mot de passe. Attention : chaque personne qui a accès à la boutique reçoit aussi l'e-mail de chaque nouvelle commande.

**Contenu** : **Paramètres › Utilisateurs › Inviter un utilisateur**, avec le rôle **Editor**. Le site affiche un lien : copiez-le et envoyez-le à la personne, par exemple par WhatsApp.

## Retirer un accès

Dans les deux espaces : **Paramètres › Utilisateurs**, choisissez la personne, puis supprimez-la. Elle ne peut plus se connecter, et elle ne reçoit plus les e-mails de commande.
