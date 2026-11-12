import type { StrapiApp } from '@strapi/strapi/admin';

export default {
  config: {
    // French admin for the client; English stays available as fallback.
    locales: ['fr'],
  },
  bootstrap(_app: StrapiApp) {},
};
