import type { Core } from '@strapi/strapi';

// The admin shows media served by the object storage (MEDIA_PUBLIC_URL): allow its origin in the CSP.
const config = ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Middlewares => {
  const mediaUrl = env('MEDIA_PUBLIC_URL');
  const mediaOrigin = mediaUrl ? new URL(mediaUrl).origin : null;
  const sources = ["'self'", 'data:', 'blob:', 'market-assets.strapi.io', ...(mediaOrigin ? [mediaOrigin] : [])];
  return [
    'strapi::logger',
    'strapi::errors',
    {
      name: 'strapi::security',
      config: {
        contentSecurityPolicy: {
          useDefaults: true,
          directives: {
            'connect-src': ["'self'", 'https:'],
            'img-src': sources,
            'media-src': sources,
            upgradeInsecureRequests: null,
          },
        },
      },
    },
    'strapi::cors',
    'strapi::poweredBy',
    'strapi::query',
    'strapi::body',
    'strapi::session',
    'strapi::favicon',
    'strapi::public',
  ];
};

export default config;
