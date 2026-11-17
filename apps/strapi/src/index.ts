import type { Core } from '@strapi/strapi';

/** Content the storefront reads: public, read-only. */
const PUBLIC_READ: Record<string, Array<'find' | 'findOne'>> = {
  'api::global-setting.global-setting': ['find'],
  'api::home-page.home-page': ['find'],
  'api::page.page': ['find', 'findOne'],
  'api::campaign.campaign': ['find', 'findOne'],
  'api::size-guide.size-guide': ['find', 'findOne'],
  'api::category-banner.category-banner': ['find', 'findOne'],
  // The single read of the storefront (src/api/storefront).
  'api::storefront.storefront': ['find'],
};

/** Content changes the storefront must see (all types use draft & publish). */
const REVALIDATE_EVENTS = new Set(['entry.publish', 'entry.unpublish', 'entry.delete']);

/**
 * Tells the storefront to revalidate its "content" cache tag.
 * Fire-and-forget: the event hub awaits subscribers, an admin save must not wait on the site.
 */
function notifyStorefront(strapi: Core.Strapi) {
  const url = process.env.STOREFRONT_REVALIDATE_URL;
  const secret = process.env.REVALIDATE_SECRET;
  if (!url || !secret) return;
  fetch(`${url}?source=strapi`, {
    method: 'POST',
    headers: { 'x-revalidate-secret': secret },
  })
    .then((res) => {
      if (!res.ok) strapi.log.warn(`Revalidation du site : HTTP ${res.status}`);
    })
    .catch((err: Error) => strapi.log.warn(`Revalidation du site impossible : ${err.message}`));
}

/**
 * The site has no customer accounts: /api/auth/local/register stays closed (audit S3).
 * Strapi opens it by default; the setting is put back at each start if it was changed in the admin.
 * The back office accounts (admin users) are not concerned.
 */
async function closePublicSignUp(strapi: Core.Strapi) {
  const pluginStore = strapi.store({ type: 'plugin', name: 'users-permissions' });
  const advanced = ((await pluginStore.get({ key: 'advanced' })) ?? {}) as Record<string, unknown>;
  if (advanced.allow_register !== false) {
    await pluginStore.set({ key: 'advanced', value: { ...advanced, allow_register: false } });
  }
}

export default {
  register() {},

  /**
   * Grants the public role read access to displayed content (idempotent), closes public sign-up
   * and wires revalidation.
   */
  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    strapi.eventHub.subscribe(async (event: string) => {
      if (REVALIDATE_EVENTS.has(event)) notifyStorefront(strapi);
    });

    await closePublicSignUp(strapi);

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
