import type { Core } from '@strapi/strapi';

const allowedMediaTypes = [
  'image/*',
  'video/*',
  'audio/*',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.*',
  'text/plain',
  'text/csv',
];

const deniedTypes = [
  'image/svg+xml',
  'application/vnd.microsoft.portable-executable',
  'application/x-msdownload',
  'application/x-msdos-program',
  'application/x-executable',
  'application/x-dosexec',
  'application/x-sh',
  'text/x-shellscript',
  'application/x-mach-binary',
];

// Admin "forgot password" e-mails through the same Hostinger mailbox as Medusa.
// Without SMTP_HOST, Strapi keeps its default provider and nothing is sent in development.
const emailPlugin = (env: Core.Config.Shared.ConfigParams["env"]): Core.Config.Plugin =>
  env('SMTP_HOST')
    ? {
        email: {
          config: {
            provider: 'nodemailer',
            providerOptions: {
              host: env('SMTP_HOST'),
              port: env.int('SMTP_PORT', 465),
              secure: env.int('SMTP_PORT', 465) === 465,
              auth: { user: env('SMTP_USER'), pass: env('SMTP_PASS') },
            },
            settings: {
              defaultFrom: env('SMTP_FROM'),
              defaultReplyTo: env('SMTP_FROM'),
            },
          },
        },
      }
    : {};

// Media library: S3-compatible object storage (Garage) when S3_ENDPOINT is set, served publicly
// from MEDIA_PUBLIC_URL. Without it, files stay in public/uploads (local provider).
const mediaStorage = (env: Core.Config.Shared.ConfigParams['env']) =>
  env('S3_ENDPOINT')
    ? {
        provider: 'aws-s3',
        providerOptions: {
          baseUrl: env('MEDIA_PUBLIC_URL'),
          rootPath: 'strapi',
          s3Options: {
            credentials: {
              accessKeyId: env('S3_ACCESS_KEY_ID'),
              secretAccessKey: env('S3_SECRET_ACCESS_KEY'),
            },
            region: env('S3_REGION', 'garage'),
            endpoint: env('S3_ENDPOINT'),
            forcePathStyle: true,
            params: {
              // Garage has no ACLs: public read goes through its website endpoint.
              ACL: undefined,
              Bucket: env('S3_BUCKET', 'media'),
            },
          },
        },
      }
    : {};

const config = ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Plugin => ({
  ...emailPlugin(env),
  'users-permissions': {
    config: {
      jwtManagement: 'refresh',
      sessions: {
        httpOnly: true,
      },
    },
  },
  upload: {
    config: {
      security: {
        allowedTypes: allowedMediaTypes,
        deniedTypes,
      },
      ...mediaStorage(env),
    },
  },
});

export default config;
