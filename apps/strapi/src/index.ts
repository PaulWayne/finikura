import type { Core } from '@strapi/strapi';

/** Content the storefront reads: public, read-only. */
const PUBLIC_READ: Record<string, Array<'find' | 'findOne'>> = {
  'api::global-setting.global-setting': ['find'],
  'api::home-page.home-page': ['find'],
  'api::page.page': ['find', 'findOne'],
  'api::campaign.campaign': ['find', 'findOne'],
  'api::size-guide.size-guide': ['find', 'findOne'],
};

export default {
  register() {},

  /** Grants the public role read access to displayed content (idempotent). */
  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    const publicRole = await strapi.db
      .query('plugin::users-permissions.role')
      .findOne({ where: { type: 'public' } });
    if (!publicRole) return;

    for (const [uid, actions] of Object.entries(PUBLIC_READ)) {
      for (const action of actions) {
        const name = `${uid}.${action}`;
        const exists = await strapi.db
          .query('plugin::users-permissions.permission')
          .findOne({ where: { action: name, role: publicRole.id } });
        if (!exists) {
          await strapi.db
            .query('plugin::users-permissions.permission')
            .create({ data: { action: name, role: publicRole.id } });
        }
      }
    }
  },
};
