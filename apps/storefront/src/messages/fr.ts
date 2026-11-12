/**
 * Interface microcopy dictionary (French).
 * All button labels, form labels, error messages, and empty states live here.
 */
export const messages = {
  common: {
    loading: "Chargement…",
  },
  meta: {
    defaultTitle: "Fini Kura — Habits pour enfants à Bamako",
    defaultDescription:
      "Vêtements pour filles et garçons de 3 à 14 ans à Bamako. Commande en ligne, paiement à la réception.",
    notFoundTitle: "Page introuvable | Fini Kura",
  },
  header: {
    brandSubtitle: "HABITS POUR ENFANTS",
    announcement: "PAIEMENT À LA RÉCEPTION À BAMAKO",
    openMenuAria: "Ouvrir le menu",
    closeMenuAria: "Fermer le menu",
    cartAria: "Panier d'achats",
    navHome: "Accueil",
    navGirls: "Filles 3-14 ans",
    navBoys: "Garçons 3-14 ans",
    navNew: "Nouveautés",
    navSizeGuide: "Guide des tailles",
    navHistory: "Notre histoire",
    navContact: "Contact",
    navDelivery: "Livraison et échanges",
  },
  home: {
    discoverCollection: "DÉCOUVRIR LA COLLECTION",
    discover: "DÉCOUVRIR",
    newCollectionBadge: "NOUVELLE COLLECTION",
    recentCreationsBadge: "CRÉATIONS RÉCENTES",
    universesTitle: "NOS UNIVERS",
    universesSubtitle: "POUR LES ENFANTS DE 3 À 14 ANS",
    newArrivalsTitle: "NOUVEAUTÉS",
    readOurStory: "NOTRE HISTOIRE",
    brandStatementEyebrow: "MAISON MALIENNE",
    brandStatementTitle: "À PROPOS DE FINI KURA",
  },
  catalog: {
    homeBreadcrumb: "Accueil",
    filterAllAges: "Tous les âges",
    filterAllOccasions: "Toutes occasions",
    agePrefix: "Âge:",
    stylePrefix: "Style:",
    sortLabel: "Trier",
    creationsCount: (count: number) => `${count} CRÉATIONS CONFECTIONNÉES À BAMAKO`,
    piecesAvailable: (count: number) => `${count} pièces disponibles`,
    addToCartAria: "Ajouter au panier",
    favoriteAria: "Ajouter aux favoris",
    consultAdviceTitle: "UN DOUTE SUR LA TAILLE DE VOTRE ENFANT ?",
    consultAdviceText: "Nos conseillers vous répondent instantanément pour vérifier les mensurations et préparer votre livraison à Bamako.",
    consultTeamBtn: "CONSULTER L'ÉQUIPE",
    needSizeAdviceMobileTitle: "Besoin d'un conseil taille ?",
    needSizeAdviceMobileText: "Nos modèles taillent droit et confortablement. Échangez avec nous directement sur WhatsApp pour confirmer les mensurations avant l'expédition à Bamako.",
    contactAtelier: "Contacter notre atelier",
    noProductsFound: "Aucune création trouvée pour ces critères.",
  },
  product: {
    collectionEphemere: "Collection Éphémère · Bamako",
    taxIncluded: "TVA incluse",
    childSize: "Taille de l'enfant",
    chooseSizePrompt: "Veuillez choisir",
    sizeGuideBtn: "Guide des tailles",
    soldOut: "ÉPUISÉ",
    lowStockFeedback: (count: number, size: string) =>
      `Plus que ${count} exemplaires confectionnés en ${size} pour Bamako`,
    availableBamako: "Disponible immédiatement en boutique Bamako",
    sizeAdviceNote:
      "Coupe fidèle à la taille standard. En cas d'entre-deux, préférez la taille supérieure.",
    addToCartWithPrice: (price: string) => `AJOUTER AU PANIER · ${price}`,
    chooseSizeCta: "CHOISIR UNE TAILLE",
    addedFeedback: (title: string, size: string) =>
      `✓ ${title} (${size}) ajouté au panier.`,
    spiritTitle: "L'ESPRIT DE LA PIÈCE",
    materialAccordion: "Matière & Confection",
    careAccordion: "Conseils d'entretien",
    atelierAccordion: "Atelier Fini Kura",
    reassurancePayments: "Paiement à la réception à Bamako",
    reassurancePaymentsDesc:
      "Réglez en espèces ou par Orange Money dès essayage",
    reassuranceDelivery: "Livraison à Bamako par coursier dédié",
    reassuranceDeliveryDesc: "Remise en main propre à domicile ou au bureau",
    reassuranceExchange: "Échange possible sous 7 jours",
    reassuranceExchangeDesc:
      "Si la taille ne convient pas, nous passons l'échanger",
    recommendationsEyebrow: "COLLECTION LIN & DOUCEUR",
    recommendationsTitle: "VOUS AIMEREZ AUSSI",
    discoverWardrobe: "DÉCOUVRIR TOUT LE VESTIAIRE",
    confectionBamako: "CONFECTION BAMAKO",
    pureLinen: "100% LIN PUR",
    handEmbroidered: "BRODÉ MAIN",
    mainStudioView: "Vue studio principale",
    sizeGuideModalTitle: "Guide des Tailles Enfants",
    sizeGuideModalIntro:
      "Les mesures ci-dessous correspondent aux mensurations de l'enfant en centimètres. Nos créations en lin présentent une aisance naturelle confortable.",
    sizeGuideNeedHelp:
      "Besoin d'aide pour choisir ? Contactez notre conseillère clientèle à Bamako par WhatsApp pour une confirmation personnalisée avant l'expédition.",
    understood: "Compris",
  },
  sizeGuidePage: {
    breadcrumbHome: "Accueil",
    breadcrumbTitle: "Guide des tailles",
    eyebrow: "VESTIAIRE ARTISANAL • CONFORT D'ENFANCE",
    title: "GUIDE DES TAILLES",
    intro:
      "Nos tailles correspondent à l'âge de l'enfant. Pour être sûr, mesurez sa taille.",
    tabGirls: "FILLES (3-14 ANS)",
    tabGirlsShort: "FILLES",
    tabBoys: "GARÇONS (3-14 ANS)",
    tabBoysShort: "GARÇONS",
    standardScaleGirls: "Barème standard • Collection Filles",
    standardScaleBoys: "Barème standard • Collection Garçons",
    unitNote: "Toutes les dimensions sont exprimées en centimètres (cm)",
    colAge: "Âge",
    colHeight: "Taille de l'enfant",
    colStature: "Stature",
    colChest: "Tour de poitrine",
    colWaist: "Tour de taille",
    microFooterCut:
      "Coupes légèrement amples adaptées au climat sahélien de Bamako.",
    microFooterFabrics: "Étoffes respirantes 100% coton & lin lavé",
    galleryCaption1: "Toiles naturelles • Coton peigné",
    galleryCaption2: "Aisance de mouvement & liberté",
    galleryCaption3: "Finitions couture à la main",
    howToMeasureEyebrow: "Conseils de mesure",
    howToMeasureTitle: "COMMENT BIEN MESURER VOTRE ENFANT ?",
    howToMeasureTitleShort: "COMMENT MESURER",
    howToMeasureStepsBadge: "3 ÉTAPES SIMPLES",
    howToMeasureIntro:
      "Utilisez un mètre ruban souple et assurez-vous que l'enfant se tient détendu.",
    step1Title: "Taille : debout, sans chaussures, dos au mur",
    step1TitleShort: "Stature",
    step1Desc:
      "Placez l'enfant bien droit contre un mur sans plinthe gênante, talons joints et regard droit à l'horizontale. Déposez une équerre ou un livre fin sur le sommet de sa tête et marquez délicatement le point avec un crayon.",
    step1DescShort: "Debout, sans chaussures, dos bien droit contre le mur.",
    step2Title: "Poitrine : à l'endroit le plus large",
    step2TitleShort: "Tour de poitrine",
    step2Desc:
      "Faites passer le mètre ruban sous les aisselles et sur la pointe des omoplates. Maintenez le ruban parfaitement horizontal sans serrer la cage thoracique pour laisser l'aisance de respiration naturelle.",
    step2DescShort: "Passez le mètre ruban à l'endroit le plus large du torse.",
    step3Title: "Taille : au niveau du nombril",
    step3TitleShort: "Tour de taille",
    step3Desc:
      "Mesurez le tour de taille naturel, légèrement au-dessus des hanches et au niveau du nombril. L'enfant doit respirer normalement sans retenir son ventre. Glissez un doigt sous le ruban pour garantir l'aisance.",
    step3DescShort: "Prenez la mesure naturellement au niveau du nombril.",
    betweenSizesEyebrow: "Recommandation de l'atelier",
    betweenSizesTipTitle: "Astuce de notre atelier",
    betweenSizesTitle: "ENTRE DEUX TAILLES ? PRENEZ LA PLUS GRANDE.",
    betweenSizesDesc:
      "Les enfants grandissent vite et le climat bamakois invite à la légèreté. Les confections Fini Kura intègrent une marge de confort pensée pour accompagner la croissance de votre enfant tout en préservant une allure impeccable.",
    fabricEaseTag: "Aisance tissu",
    fabricEaseMetric: "+3 à 5 cm",
    reassuranceExchangeTitle: "Échanges faciles",
    reassuranceExchangeDesc: "Échange de taille sans frais à Bamako sous 48h.",
    reassuranceCodTitle: "Paiement à la livraison",
    reassuranceCodDesc: "Réglez après essayage directement au livreur.",
    reassuranceWaistTitle: "Ceintures ajustables",
    reassuranceWaistDesc: "Élastiques intérieurs boutonnés sur tous les bas.",
    assistanceTitle:
      "UN DOUTE SUR LA TAILLE DE VOTRE ENFANT OU SES MENSURATIONS ?",
    assistanceTitleShort: "UN DOUTE SUR LA TAILLE ?",
    assistanceDesc:
      "Notre atelier de confection vous conseille personnellement en direct de Bamako.",
    whatsAppButton: "ÉCRIVEZ-NOUS SUR WHATSAPP",
    ampleCutTitle: "COUPES AMPLES & GRAND CONFORT",
    ampleCutDesc:
      "Tous nos modèles intègrent une marge d'aisance naturelle pensée pour le climat bamakois et les mouvements libres.",
    modalSubtitle: "Maison Fini Kura",
    modalTitle: "Guide des tailles",
    modalSubtitleMobile: "Adapté à la morphologie des enfants",
    modalIntro:
      "Nos tailles correspondent fidèlement à l'âge de l'enfant. Pour un tombé parfait et durable, référez-vous d'abord à sa stature.",
    modalIntroMobile:
      "Nos tailles correspondent à l'âge de l'enfant. Pour être sûr de faire le bon choix, mesurez sa hauteur pieds nus.",
    modalTabGirls: "Filles & Bébés",
    modalTabBoys: "Garçons",
    modalTipTitle: "Entre deux tailles ?",
    modalTipDesc:
      "Privilégiez la plus grande. Nos confections en lin naturel et cotons brodés offrent de délicats ourlets évolutifs pour accompagner la croissance de l'enfant.",
    modalChooseSizeBtn: "Choisir ma taille",
    modalWhatsAppQuestion: "Un doute sur la coupe ou la mesure ?",
    modalWhatsAppBtn: "Écrivez-nous sur WhatsApp",
    modalReassuranceExchange:
      "Échanges de taille faciles et gratuits sous 14 jours à Bamako.",
  },
  cart: {
    title: "Mon Panier",
    articlesCount: (count: number) =>
      `${count} ${count > 1 ? "articles" : "article"}`,
    addedNotification: "Article ajouté avec succès à votre vestiaire.",
    addedNotificationMobile:
      "Article ajouté avec succès · Paiement à la livraison à Bamako",
    emptyTitle: "Votre panier est vide",
    emptyDescription:
      "Découvrez nos créations en lin et coton noble créées à Bamako.",
    startShopping: "Découvrir la collection",
    subtotal: "Sous-total articles",
    deliveryLabel: "Frais de livraison (Bamako)",
    deliveryStatus: "Validés avec l'adresse",
    totalEstimated: "Total estimé",
    deliveryNotice: "Livraison à votre charge, montant confirmé sur WhatsApp",
    paymentNotice: "Paiement à la réception à Bamako",
    deliveryAssurance: "Livraison à Bamako sous 24 à 48h",
    deliveryAssuranceSub:
      "Par coursier dédié à domicile ou sur votre lieu de travail.",
    paymentAssurance: "Paiement en espèces ou Orange Money dès essayage",
    checkoutButton: "Commander",
    continueShopping: "Continuer mes achats",
    removeAria: "Retirer l'article",
    quantityAria: "Quantité",
    sizeSelected: "Taille sélectionnée :",
  },
  checkout: {
    breadcrumbPanier: "Panier",
    breadcrumbFinalisation: "Finalisation de commande",
    breadcrumbConfirmation: "Confirmation",
    topDeliveryBadge: "Bamako • Remise en mains propres",
    stepEyebrowDesktop: "Étape Unique • Atelier Bamako",
    stepEyebrowMobile: "Étape finale",
    titleDesktop: "FINALISER VOTRE COMMANDE",
    titleMobile: "FINALISER MA COMMANDE",
    subtitleDesktop:
      "Aucun compte requis. Réglez simplement en espèces ou par Orange Money directement auprès du coursier à la réception.",
    subtitleMobile: "Simple, rapide et sans création de compte requise.",
    reassuranceTitle: "Commande directe et artisanale",
    reassuranceDesc:
      "Nos pièces sont confectionnées avec soin dans nos ateliers. Vous ne payez qu'une fois votre paquet vérifié en main propre.",
    nameLabel: "Nom complet",
    nameRequiredBadge: "Obligatoire",
    namePlaceholder: "Votre prénom et nom",
    phoneLabel: "Téléphone de contact",
    phoneHelp: "Pour la livraison & WhatsApp",
    phonePlaceholder: "+223 .. .. .. ..",
    phonePlaceholderMobile: "76 XX XX XX",
    neighborhoodLabel: "Quartier à Bamako",
    neighborhoodHelp: "Zone de livraison",
    neighborhoodPlaceholder: "Ex : Badalabougou, ACI 2000, Hippodrome",
    landmarksLabel: "Repères de livraison précis",
    landmarksRequiredBadge: "Requis pour le coursier",
    landmarksPlaceholder:
      "Ex : Près de la pharmacie du fleuve, villa beige portail vert",
    landmarksPlaceholderMobile: "Ex : Près de la pharmacie, rue 14, porte 12...",
    landmarksErrorMsg:
      "Veuillez préciser un repère (ex: près de la pharmacie, rue 14, porte 12)",
    atelierCoordinationNote:
      "Dès validation, notre coordinatrice d'atelier vous envoie une photo de votre colis ficelé et confirme le départ du coursier via WhatsApp.",
    summaryTitle: "RÉCAPITULATIF DE VOTRE COMMANDE",
    itemsBadge: (count: number) =>
      `${count} ${count > 1 ? "articles" : "article"}`,
    seeItemsAccordion: (count: number, total: string) =>
      `Voir les ${count} articles (${total})`,
    subtotalArticles: "Sous-total articles",
    subtotalArticlesMobile: "Sous-total des articles",
    totalArticles: "Total des articles",
    withoutCourierFee: "Hors frais de coursier",
    courierNoticeDelivery: "Livraison organisée avec votre coursier",
    courierNoticeDeliveryDesc:
      "Les détails et la remise du colis sont directement coordonnés avec vous par WhatsApp avant l'acheminement.",
    courierNoticeMobile: "Livraison à votre charge, montant confirmé sur WhatsApp",
    courierNoticeMobileDesc:
      "Notre coursier vous contactera pour convenir de l'horaire de passage exact.",
    paymentOnDeliveryTitle: "Paiement à la réception",
    paymentOnDeliveryDesc:
      "Réglez directement en espèces ou par Orange Money lors de la remise en main propre.",
    paymentMethodsShort: "Espèces • Orange Money",
    submitCta: "VALIDER MA COMMANDE",
    submittingCta: "VALIDATION EN COURS...",
    submitFootnoteDesktop:
      "En validant, votre commande est réservée à l'atelier sans débit immédiat.",
    submitFootnoteMobile: "Paiement uniquement à la livraison à Bamako",
    trustVegetalDyes: "Teintures Végétales",
    trustHandFinishing: "Finitions Main Bamako",
    emptyCartTitle: "Votre panier est vide",
    emptyCartDesc:
      "Votre panier d'atelier ne contient pas encore d'article. Choisissez des pièces confectionnées à Bamako.",
    emptyCartCta: "DÉCOUVRIR NOS CRÉATIONS",
  },
  confirmation: {
    badgeStatus: "En cours de confection",
    atelierConfirmationEyebrow: "Confirmation d'Atelier",
    orderRefLabel: "NUMÉRO DE RÉFÉRENCE",
    orderNumberPrefix: "Commande n°",
    thankYouName: (name: string) => `Merci ${name} !`,
    thankYouDefault: "Merci !",
    messageDesktop:
      "Votre commande a bien été enregistrée par notre atelier de Bamako. Nos artisans préparent vos créations avec le plus grand soin et la patience des gestes ancestraux.",
    messageMobile:
      "Votre commande a bien été enregistrée par notre atelier de Bamako. Nous préparons vos pièces avec le plus grand soin et toute la délicatesse de nos artisans.",
    summaryLabel: "Récapitulatif",
    piecesCount: (count: number) =>
      `${count} ${count > 1 ? "créations faites main" : "création faite main"}`,
    totalLabel: "Total :",
    destinationLabel: "Destination :",
    deliveryTiming: "Livraison prévue sous 24h • Bamako",
    paymentLabel: "Règlement :",
    paymentMethodText: "Paiement à la réception",
    paymentMethodSubtext: "En espèces ou via Mobile Money",
    atelierHighlightTitle: "FINI KURA • ATELIER",
    atelierHighlightDesc:
      "Chaque point cousu main célèbre la noblesse du tissage local.",
    whatsAppCta: "Confirmer sur WhatsApp",
    whatsAppNotice:
      "Cliquez ici pour valider votre adresse exacte et l'horaire de passage de notre coursier.",
    backToStore: "Retourner à la boutique",
    backToHome: "Retourner à la boutique",
    discoverOtherCreations: "Découvrir d'autres créations",
    trackOrder: "Suivre ma commande",
    ethicalTag: "Étiquette éthique • Confectionné à Bamako",
  },
  drawer: {
    needAdviceTitle: "Besoin d'un conseil ?",
    needAdviceText:
      "Échangez directement avec nous sur WhatsApp pour vos commandes à Bamako.",
    whatsAppContactBtn: "Contacter sur WhatsApp",
  },
  errors: {
    addToCart: "Impossible d'ajouter cet article au panier.",
    updateCart: "Impossible de modifier le panier.",
    cartNotFound: "Votre panier a expiré. Ajoutez à nouveau vos articles.",
    emptyCart: "Votre panier est vide.",
    notEnoughStock: "Il ne reste plus assez de pièces dans cette taille.",
    invalidOrder: "Vérifiez vos coordonnées.",
    placeOrder: "Impossible d'enregistrer la commande. Veuillez réessayer.",
    outOfStock: (title: string) =>
      `Désolé, « ${title} » vient d'être vendu dans cette taille. Retirez-le du panier pour continuer.`,
  },
  validation: {
    nameRequired: "Veuillez indiquer votre nom",
    phoneRequired: "Veuillez renseigner un numéro de téléphone",
    phoneInvalid: "Le numéro doit comporter exactement 8 chiffres maliens",
    neighborhoodRequired: "Veuillez indiquer votre quartier à Bamako",
    landmarksRequired: "Veuillez préciser un repère (ex: près de la pharmacie, rue 14, porte 12)",
  },
  footer: {
    copyright: "© 2025 Fini Kura Bamako. Tous droits réservés.",
    deliveryLink: "LIVRAISON ET ÉCHANGES",
    contactLink: "CONTACT",
    sizeGuideLink: "GUIDE DES TAILLES",
    historyLink: "NOTRE HISTOIRE",
  },
  contactPage: {
    breadcrumbHome: "Accueil",
    breadcrumbTitle: "Contact & FAQ",
    eyebrow: "À VOTRE ÉCOUTE • ATELIER BAMAKO",
    title: "NOUS CONTACTER & QUESTIONS FRÉQUENTES",
    titleMobile: "À VOTRE ÉCOUTE",
    subtitle:
      "Une interrogation sur une coupe, les mensurations de votre enfant ou les délais de remise par nos coursiers ? Notre atelier de Bamako vous répond avec bienveillance.",
    subtitleMobile:
      "L’atelier Fini Kura de Bamako vous accompagne pour vos commandes, essayages et conseils de taille.",
    whatsappCard: {
      tag: "Canal Privilégié",
      tagMobile: "Canal prioritaire",
      liveBadge: "En direct",
      title: "ÉCHANGE DIRECT PAR WHATSAPP",
      titleMobile: "ASSISTANCE DIRECTE & COMMANDES",
      desc: "Réponse instantanée du lundi au samedi, de 8h à 19h. Idéal pour confirmer une commande, envoyer une photo ou convenir d'un lieu de livraison précis avec nos coursiers.",
      descMobile:
        "Réponse rapide 6j/7 (8h-19h). Précision des tailles, suivi coursier ou confection sur-mesure.",
      cta: "DISCUTER SUR WHATSAPP",
      ctaMobile: "Écrivez-nous sur WhatsApp",
    },
    atelierCard: {
      title: "ATELIER BAMAKO",
      subtitle: "Rencontrez notre équipe de tailleurs et modélistes",
      locationTitle: "Quartier du Fleuve / ACI 2000",
      locationCountry: "Bamako, République du Mali",
      landmark: "En face de la pharmacie du fleuve",
      phoneTitle: "Téléphone & Commandes",
      phone1: "+223 76 45 89 12",
      phone2: "+223 20 22 00 00",
      callCta: "Appeler",
      hoursTitle: "Horaires de retrait & Essayages",
      hoursDesc: "Du lundi au samedi : 09h00 – 19h00",
      hoursClosed: "Fermé le dimanche",
      courierTitle: "Service Coursier Dédié",
      courierDesc: "Livraison dans toutes les communes du District de Bamako.",
      paymentReassurance:
        "Paiement en espèces ou Orange Money à la livraison en main propre.",
    },
    form: {
      eyebrow: "Écrivez-nous",
      title: "ENVOYER UN MESSAGE À L'ATELIER",
      titleMobile: "ENVOYER UN MOT À L’ATELIER",
      desc: "Remplissez ce formulaire et notre responsable des commandes vous recontactera directement sous quelques heures.",
      descMobile: "Une question spécifique ? Laissez-nous un message détaillé.",
      nameLabel: "Nom complet",
      namePlaceholder: "Ex: Aminata Traoré",
      phoneLabel: "Numéro de téléphone (WhatsApp)",
      phonePlaceholder: "76 00 00 00",
      phoneHint: "Notre coursier ou atelier vous joindra sur ce numéro.",
      subjectLabel: "Sujet de votre démarche",
      subjectOptions: {
        sizes: "Question sur les tailles & coupes",
        delivery: "Suivi de livraison coursier Bamako",
        special: "Commande spéciale & Célébration (Tabaski, baptême...)",
        other: "Autre demande à l'atelier",
      },
      messageLabel: "Votre message",
      messagePlaceholder:
        "Précisez la taille souhaitée, le quartier de livraison ou toute question sur les matières...",
      submitCta: "ENVOYER LE MESSAGE",
      submitting: "Envoi en cours...",
      successMessage:
        "Votre message a été transmis à l'atelier Fini Kura. Nous vous contacterons sur WhatsApp très prochainement.",
      successMessageMobile:
        "Merci ! Votre message a bien été transmis à notre équipe de Bamako.",
    },
    faq: {
      eyebrow: "AIDE & RÉPONSES RAPIDES",
      title: "QUESTIONS FRÉQUEMMENT POSÉES",
      desc: "Tout ce qu'il faut savoir sur nos créations pour enfants, nos modalités de livraison et notre règlement à la réception.",
      filters: {
        all: "TOUTES LES QUESTIONS",
        delivery: "LIVRAISON À BAMAKO",
        sizing: "TAILLES & CONFECTION",
        payment: "PAIEMENT À LA RÉCEPTION",
      },
      items: [
        {
          id: "delivery-1",
          category: "delivery",
          question: "Comment se passe la livraison à Bamako ?",
          questionMobile: "Comment fonctionne la livraison à Bamako ?",
          answer:
            "Nos coursiers dédiés livrent dans toutes les communes de Bamako (Communes I à VI, Kalaban, Yirimadio, Sébénikoro...). Le montant de la course est confirmé directement avec vous sur WhatsApp avant le départ du colis, selon votre quartier précis. Le livreur vous appelle dès qu'il prend la route.",
          answerMobile:
            "Nos coursiers livrent partout à Bamako. Le tarif exact vous est communiqué avant départ sur WhatsApp selon votre quartier.",
        },
        {
          id: "payment-1",
          category: "payment",
          question: "Comment régler ma commande ?",
          questionMobile: "Quand et comment s’effectue le paiement ?",
          answer:
            "Aucun paiement en ligne n'est exigé sur le site. Vous réglez directement en espèces ou par Orange Money / Moov Money auprès du livreur après avoir ouvert et vérifié vos habits en main propre. Vous ne payez que si la tenue vous convient.",
          answerMobile:
            "Uniquement à la réception ! Vous payez en espèces ou Orange Money une fois le colis entre vos mains et vérifié.",
        },
        {
          id: "sizing-1",
          category: "sizing",
          question: "Que faire si la taille ne convient pas à mon enfant ?",
          questionMobile: "Comment faire si la taille ne convient pas ?",
          answer:
            "Nous facilitons les échanges sous 48h à Bamako. Si la chemise ou la robe est trop petite ou trop grande, prévenez-nous simplement sur WhatsApp : notre coursier vous apporte la taille supérieure ou inférieure sans complication à votre domicile ou lieu de travail.",
          answerMobile:
            "Échange facile sous 48h à Bamako par coursier sans frais supplémentaires. Il vous suffit de nous envoyer un message sur WhatsApp.",
        },
        {
          id: "sizing-2",
          category: "sizing",
          question: "Quelles matières utilisez-vous pour les vêtements ?",
          questionMobile: "Les tissus sont-ils adaptés à la chaleur ?",
          answer:
            "Nous sélectionnons exclusivement des cotons doux et des lins légers respirants de première qualité, thermorégulateurs et parfaitement adaptés au climat chaud et à la saison des pluies de Bamako. Nos teintures et tissages respectent la peau fragile des tout-petits.",
          answerMobile:
            "Oui, nos toiles 100% lin et pur coton peigné sont douces, légères et thermorégulatrices pour le climat de Bamako.",
        },
        {
          id: "delivery-2",
          category: "delivery",
          question: "Puis-je venir essayer les créations directement à l'atelier ?",
          questionMobile: "Puis-je venir essayer les créations directement à l'atelier ?",
          answer:
            "Oui, notre atelier au Quartier du Fleuve vous accueille avec grand plaisir sur rendez-vous ou aux horaires d'ouverture (09h00 à 19h00) pour découvrir nos rouleaux d'étoffes, faire essayer les modèles à vos enfants ou commander une tenue sur-mesure.",
          answerMobile:
            "Oui, notre atelier au Quartier du Fleuve vous accueille avec grand plaisir sur rendez-vous ou aux horaires d'ouverture (09h00 à 19h00) pour découvrir nos rouleaux d'étoffes, faire essayer les modèles à vos enfants ou commander une tenue sur-mesure.",
        },
      ],
      reassuranceBadgeTitle: "Sérénité Fini Kura Bamako",
      reassuranceBadgeDesc:
        "Paiement à l'arrivée • Matières naturelles • Confection locale soignée",
    },
    closure: {
      eyebrow: "Conseils sur-mesure",
      title: "UN DOUTE SUR LA CORPULENCE DE VOTRE ENFANT ?",
      desc: "Consultez notre tableau des mensurations selon l'âge ou demandez l'avis direct de nos couturières par messagerie instantanée.",
      sizeGuideBtn: "GUIDE DES TAILLES",
      whatsAppBtn: "WHATSAPP DIRECT",
    },
  },
  aboutPage: {
    breadcrumbHome: "Accueil",
    breadcrumbTitle: "Notre histoire",
    hero: {
      tag: "Toiles naturelles • Coton & Lin",
      eyebrow: "NOTRE HISTOIRE",
      title: "DES HABITS NEUFS,\nPENSÉS POUR GRANDIR.",
      titleMobile: "DES HABITS NEUFS, PENSÉS POUR GRANDIR",
      p1: "Au commencement résonne la mémoire des jours de réjouissance, où chaque pli de tissu porte l'amour et l'attention d'une mère. Nous avons imaginé Fini Kura comme une ode à la tendresse de l'enfance : des créations confectionnées à Bamako dans des matières nobles, vivantes et pures.",
      p2: "Ni clinquants, ni figés, nos modèles sont pensés pour accompagner l'insouciance des jeux au soleil, la solennité des fêtes de famille et la beauté simple des dimanches passés ensemble.",
      pMobile:
        "Né sous le soleil doux de Bamako, notre vestiaire d’enfance réconcilie la noblesse du geste artisanal avec le souffle et la liberté indispensables aux petits explorateurs.",
      stat1Value: "100%",
      stat1Label: "Confectionné à Bamako",
      stat2Value: "3 à 14 ans",
      stat2Label: "Coupes évolutives",
    },
    origins: {
      eyebrow: "ORIGINES • BAMBARA",
      eyebrowMobile: "SIGNIFICATION & ORIGINE",
      title: "FINI KURA, C'EST QUOI ?",
      p1: "En bambara, « Fini Kura » se traduit par les « habits neufs ». C'est l'expression consacrée lorsqu'un enfant revêt sa plus belle tenue immaculée pour la Tabaski, un baptême ou une visite aux aînés. C’est la fierté dans son regard, la caresse d’une cotonnade propre et légère, et cette émotion universelle de voir son enfant rayonnant.",
      p2: "Nous avons préservé cette magie pour en faire un rituel quotidien : le goût des beaux habits qui durent, se transmettent entre frères et sœurs, et résistent avec grâce au fil des années.",
      pMobile1:
        "En bambara, « Fini » évoque l’étoffe, le vêtement tissé avec soin, tandis que « Kura » chante la nouveauté et le renouveau radieux.",
      pMobile2:
        "Fini Kura rend hommage à cette émotion si singulière des habits neufs des jours de fête : le bruissement d’un lin immaculé, les sourires partagés et la joie pure de grandir dans des pièces pensées avec bienveillance et dignité.",
    },
    founder: {
      eyebrow: "LA VOIX DE L'ATELIER",
      eyebrowMobile: "LA CRÉATRICE",
      title: "DE L'ENVIE MATERNELLE À LA CRÉATION D'UN ATELIER D'EXCEPTION",
      titleMobile: "L’ATELIER D’AMINATA",
      quote:
        "« Chaque enfant mérite des vêtements respirants, taillés dans le respect de ses mouvements et de son bien-être. »",
      author: "— Aïssata, Fondatrice & Styliste",
      p1: "Maman de trois enfants grandissant sous la chaleur bamakaoise, je me heurtais sans cesse au même dilemme : trouver des vêtements d'enfants à la fois doux pour les peaux délicates, élégants sans être rigides, et assez solides pour résister à la terre battue et aux escapades. Les matières synthétiques importées ne convenaient ni au climat de notre fleuve Niger, ni à mon attachement aux belles textures. J'ai donc commencé à couper les premières pièces moi-même sur ma table de salon, dans un mélange de lin frais et de cotonnades douces tissées localement.",
      p2: "Aujourd'hui, l'atelier Fini Kura réunit des maîtres tailleurs et couturières passionnés à Bamako. Ensemble, nous prenons le temps d'étudier chaque détail : des empiècements souples, des ourlets généreux qui se décousent pour allonger la manche au fil des centimètres gagnés par l'enfant, des coutures rabattues invisibles qui ne grattent pas. C’est cette minutie artisanale qui offre à chaque pièce son âme incomparable.",
      pMobile1:
        "Mère de trois enfants et passionnée de couture depuis son plus jeune âge, Aminata a fondé Fini Kura avec une promesse simple : offrir aux enfants de Bamako des vêtements nobles, respirants et confortables, capables de résister aux jeux sans perdre leur grâce.",
      pMobile2:
        "Chaque coupe est testée pour laisser une liberté totale de mouvement. Nos couturiers et brodeurs façonnent des pièces aux finitions durables, conçues dans des lins lavés et des cotons doux qui s’adoucissent à chaque lavage.",
      certifiedBadge: "Atelier Bamakois Certifié",
      certifiedSub: "Confection locale, juste et éthique",
    },
    values: {
      eyebrow: "NOS ENGAGEMENTS",
      eyebrowMobile: "NOTRE PHILOSOPHIE",
      title: "CE QUI GUIDE CHACUN DE NOS POINTS",
      v1Title: "ÉLÉGANCE SOBRE",
      v1Desc:
        "Des lignes épurées et des broderies subtiles faites à la main. Nous célébrons une grâce naturelle, loin des modes jetables et des imprimés bruyants.",
      v1Tag: "Détails faits main",
      v2Title: "CONFORT POUR BOUGER",
      v2Desc:
        "Des vêtements amples et souples pensés pour l’énergie débordante des 3 à 14 ans. Grimper, courir, s’assoir par terre : le vêtement suit l’enfant sans jamais le contraindre.",
      v2Tag: "Liberté absolue",
      v3Title: "FAIT POUR BAMAKO",
      v3Desc:
        "Des toiles nobles thermorégulatrices parfaitement adaptées au climat malien. Fraîcheur à la saison chaude, douceur respirante pendant l'hivernage.",
      v3Tag: "Adapté au climat",
    },
    cta: {
      eyebrow: "SAISON EN COURS",
      title: "DONNEZ À VOS ENFANTS LE PLAISIR DES HABITS BIEN FAITS",
      titleMobile: "HABILLER LEUR ENFANCE",
      desc: "Découvrez notre sélection de chemisettes, robes virevoltantes, culottes en lin et ensembles de fête, disponibles pour livraison immédiate à Bamako.",
      descMobile:
        "Explorez les créations d’Aminata façonnées à Bamako, conçues pour être transmises et chéries.",
      discoverBtn: "DÉCOUVRIR LA COLLECTION",
      sizeGuideBtn: "CONSULTER LE GUIDE DES TAILLES",
      codNote: "Paiement à la réception à Bamako",
    },
  },
} as const;
