import type { Core } from '@strapi/strapi';

const config = ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Server => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  // Behind Traefik in production: public URL (admin, media) and trusted proxy headers.
  url: env('PUBLIC_URL', ''),
  proxy: { koa: env.bool('IS_PROXIED', env('NODE_ENV') === 'production') },
  // Live e2e (FK-35): media uploaded to a temporary folder, never to the dev public/uploads.
  dirs: { public: env('STRAPI_PUBLIC_DIR', './public') },
  app: {
    keys: env.array('APP_KEYS')!,
  },
  webhooks: {
    populateRelations: env.bool('WEBHOOKS_POPULATE_RELATIONS', false),
  },
});

export default config;
