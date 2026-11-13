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
    },
  },
});

export default config;
