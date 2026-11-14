import type { Schema, Struct } from '@strapi/strapi';

export interface BlocksAboutExcerpt extends Struct.ComponentSchema {
  collectionName: 'components_blocks_about_excerpt';
  info: {
    displayName: 'Extrait \u00C0 propos';
    icon: 'feather';
  };
  attributes: {
    content: Schema.Attribute.Text & Schema.Attribute.Required;
    cta_link: Schema.Attribute.String;
    cta_text: Schema.Attribute.String;
    eyebrow: Schema.Attribute.String;
    image: Schema.Attribute.Media<'images'>;
    image_alt: Schema.Attribute.String;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface BlocksCategoryCards extends Struct.ComponentSchema {
  collectionName: 'components_blocks_category_cards';
  info: {
    displayName: 'Cartes univers';
    icon: 'apps';
  };
  attributes: {
    cards: Schema.Attribute.Component<'shared.category-card', true>;
    eyebrow: Schema.Attribute.String;
    subtitle: Schema.Attribute.String;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface BlocksCta extends Struct.ComponentSchema {
  collectionName: 'components_blocks_cta';
  info: {
    displayName: "Appel \u00E0 l'action";
    icon: 'cursor';
  };
  attributes: {
    cta_link: Schema.Attribute.String & Schema.Attribute.Required;
    cta_text: Schema.Attribute.String & Schema.Attribute.Required;
    subtitle: Schema.Attribute.String;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface BlocksFaq extends Struct.ComponentSchema {
  collectionName: 'components_blocks_faq';
  info: {
    displayName: 'Questions fr\u00E9quentes';
    icon: 'question';
  };
  attributes: {
    items: Schema.Attribute.Component<'shared.faq-item', true>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface BlocksHero extends Struct.ComponentSchema {
  collectionName: 'components_blocks_hero';
  info: {
    displayName: 'Grande image';
    icon: 'picture';
  };
  attributes: {
    cta_link: Schema.Attribute.String;
    cta_text: Schema.Attribute.String;
    eyebrow: Schema.Attribute.String;
    image: Schema.Attribute.Media<'images'>;
    image_alt: Schema.Attribute.String;
    subtitle: Schema.Attribute.Text;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface BlocksImageText extends Struct.ComponentSchema {
  collectionName: 'components_blocks_image_text';
  info: {
    displayName: 'Image et texte';
    icon: 'picture';
  };
  attributes: {
    eyebrow: Schema.Attribute.String;
    image: Schema.Attribute.Media<'images'>;
    image_alt: Schema.Attribute.String;
    text: Schema.Attribute.Text & Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface BlocksProductSection extends Struct.ComponentSchema {
  collectionName: 'components_blocks_product_section';
  info: {
    displayName: 'Section produits';
    icon: 'shopping-cart';
  };
  attributes: {
    collection_handle: Schema.Attribute.String & Schema.Attribute.Required;
    eyebrow: Schema.Attribute.String;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface BlocksReassurance extends Struct.ComponentSchema {
  collectionName: 'components_blocks_reassurance';
  info: {
    displayName: 'Engagements';
    icon: 'check';
  };
  attributes: {
    title: Schema.Attribute.String;
  };
}

export interface BlocksRichText extends Struct.ComponentSchema {
  collectionName: 'components_blocks_rich_text';
  info: {
    displayName: 'Texte';
    icon: 'align-left';
  };
  attributes: {
    body: Schema.Attribute.RichText & Schema.Attribute.Required;
    title: Schema.Attribute.String;
  };
}

export interface BlocksValues extends Struct.ComponentSchema {
  collectionName: 'components_blocks_values';
  info: {
    displayName: 'Valeurs';
    icon: 'star';
  };
  attributes: {
    items: Schema.Attribute.Component<'shared.value-item', true>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedCategoryCard extends Struct.ComponentSchema {
  collectionName: 'components_shared_category_card';
  info: {
    displayName: 'Carte univers';
    icon: 'apps';
  };
  attributes: {
    age_range: Schema.Attribute.String;
    category_handle: Schema.Attribute.String & Schema.Attribute.Required;
    cta_text: Schema.Attribute.String & Schema.Attribute.Required;
    image: Schema.Attribute.Media<'images'>;
    image_alt: Schema.Attribute.String;
    tagline: Schema.Attribute.String;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedFaqItem extends Struct.ComponentSchema {
  collectionName: 'components_shared_faq_item';
  info: {
    displayName: 'Question';
    icon: 'question';
  };
  attributes: {
    answer: Schema.Attribute.Text & Schema.Attribute.Required;
    question: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedLink extends Struct.ComponentSchema {
  collectionName: 'components_shared_link';
  info: {
    displayName: 'Lien';
    icon: 'link';
  };
  attributes: {
    label: Schema.Attribute.String & Schema.Attribute.Required;
    url: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedReassuranceItem extends Struct.ComponentSchema {
  collectionName: 'components_shared_reassurance_item';
  info: {
    displayName: 'Engagement';
    icon: 'check';
  };
  attributes: {
    description: Schema.Attribute.Text & Schema.Attribute.Required;
    icon: Schema.Attribute.String & Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedSeo extends Struct.ComponentSchema {
  collectionName: 'components_shared_seo';
  info: {
    displayName: 'R\u00E9f\u00E9rencement';
    icon: 'search';
  };
  attributes: {
    description: Schema.Attribute.Text & Schema.Attribute.Required;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 70;
      }>;
  };
}

export interface SharedSizeRow extends Struct.ComponentSchema {
  collectionName: 'components_shared_size_row';
  info: {
    displayName: 'Ligne de mesures';
    icon: 'layout';
  };
  attributes: {
    age: Schema.Attribute.String & Schema.Attribute.Required;
    chest_cm: Schema.Attribute.String;
    height_cm: Schema.Attribute.String;
    hips_cm: Schema.Attribute.String;
    waist_cm: Schema.Attribute.String;
  };
}

export interface SharedSocialLink extends Struct.ComponentSchema {
  collectionName: 'components_shared_social_link';
  info: {
    displayName: 'R\u00E9seau social';
    icon: 'earth';
  };
  attributes: {
    label: Schema.Attribute.String & Schema.Attribute.Required;
    platform: Schema.Attribute.Enumeration<
      ['whatsapp', 'facebook', 'tiktok', 'instagram']
    > &
      Schema.Attribute.Required;
    url: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedTip extends Struct.ComponentSchema {
  collectionName: 'components_shared_tip';
  info: {
    displayName: 'Conseil';
    icon: 'lightbulb';
  };
  attributes: {
    text: Schema.Attribute.Text & Schema.Attribute.Required;
  };
}

export interface SharedValueItem extends Struct.ComponentSchema {
  collectionName: 'components_shared_value_item';
  info: {
    displayName: 'Valeur';
    icon: 'star';
  };
  attributes: {
    description: Schema.Attribute.Text & Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export namespace Public {
    export interface ComponentSchemas {
      'blocks.about-excerpt': BlocksAboutExcerpt;
      'blocks.category-cards': BlocksCategoryCards;
      'blocks.cta': BlocksCta;
      'blocks.faq': BlocksFaq;
      'blocks.hero': BlocksHero;
      'blocks.image-text': BlocksImageText;
      'blocks.product-section': BlocksProductSection;
      'blocks.reassurance': BlocksReassurance;
      'blocks.rich-text': BlocksRichText;
      'blocks.values': BlocksValues;
      'shared.category-card': SharedCategoryCard;
      'shared.faq-item': SharedFaqItem;
      'shared.link': SharedLink;
      'shared.reassurance-item': SharedReassuranceItem;
      'shared.seo': SharedSeo;
      'shared.size-row': SharedSizeRow;
      'shared.social-link': SharedSocialLink;
      'shared.tip': SharedTip;
      'shared.value-item': SharedValueItem;
    }
  }
}
