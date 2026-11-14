import { loadEnv, defineConfig } from '@medusajs/framework/utils'

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

const REDIS_URL = process.env.REDIS_URL

// Redis infrastructure modules (events, locking, workflows, cache), loaded only when REDIS_URL is set.
// Without it Medusa falls back to in-memory modules, which is fine locally but not in production.
const redisModules = REDIS_URL
  ? [
      {
        resolve: '@medusajs/medusa/event-bus-redis',
        options: { redisUrl: REDIS_URL },
      },
      {
        resolve: '@medusajs/medusa/locking',
        options: {
          providers: [
            {
              resolve: '@medusajs/medusa/locking-redis',
              id: 'locking-redis',
              is_default: true,
              options: { redisUrl: REDIS_URL },
            },
          ],
        },
      },
      {
        resolve: '@medusajs/medusa/workflow-engine-redis',
        options: { redis: { redisUrl: REDIS_URL } },
      },
      {
        resolve: '@medusajs/medusa/caching',
        options: {
          providers: [
            {
              resolve: '@medusajs/medusa/caching-redis',
              id: 'caching-redis',
              is_default: true,
              options: { redisUrl: REDIS_URL },
            },
          ],
        },
      },
    ]
  : []

// New-order e-mails: SMTP (Hostinger) when SMTP_HOST is set, otherwise the local provider,
// which only prints e-mails in the console (dev and tests never send real mail).
const notificationModule = {
  resolve: '@medusajs/medusa/notification',
  options: {
    providers: [
      process.env.SMTP_HOST
        ? {
            resolve: './src/modules/smtp-notification',
            id: 'smtp',
            options: {
              channels: ['email'],
              host: process.env.SMTP_HOST,
              port: Number(process.env.SMTP_PORT || 465),
              user: process.env.SMTP_USER,
              pass: process.env.SMTP_PASS,
              from: process.env.SMTP_FROM,
            },
          }
        : {
            resolve: '@medusajs/medusa/notification-local',
            id: 'local',
            options: { channels: ['email'] },
          },
    ],
  },
}

// Product photos: S3-compatible object storage (Garage) when S3_ENDPOINT is set, served publicly
// from MEDIA_PUBLIC_URL. Without it Medusa keeps its local file provider (integration tests).
const fileModules = process.env.S3_ENDPOINT
  ? [
      {
        resolve: '@medusajs/medusa/file',
        options: {
          providers: [
            {
              resolve: '@medusajs/medusa/file-s3',
              id: 's3',
              options: {
                file_url: process.env.MEDIA_PUBLIC_URL,
                endpoint: process.env.S3_ENDPOINT,
                region: process.env.S3_REGION || 'garage',
                bucket: process.env.S3_BUCKET || 'media',
                access_key_id: process.env.S3_ACCESS_KEY_ID,
                secret_access_key: process.env.S3_SECRET_ACCESS_KEY,
                prefix: 'medusa/',
                additional_client_config: { forcePathStyle: true },
              },
            },
          ],
        },
      },
    ]
  : process.env.MEDUSA_UPLOAD_DIR
    ? [
        // Live e2e (FK-35): local files in a temporary folder, never in the dev static/ folder.
        {
          resolve: '@medusajs/medusa/file',
          options: {
            providers: [
              {
                resolve: '@medusajs/medusa/file-local',
                id: 'local',
                options: { upload_dir: process.env.MEDUSA_UPLOAD_DIR },
              },
            ],
          },
        },
      ]
    : []

module.exports = defineConfig({
  // The live e2e (FK-35) runs without the admin build, to start faster.
  admin: { disable: process.env.MEDUSA_ADMIN_DISABLED === 'true' },
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    redisUrl: REDIS_URL,
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET,
      cookieSecret: process.env.COOKIE_SECRET,
    }
  },
  // FK-42: stock history of each size, readable by the manager.
  modules: [...redisModules, notificationModule, ...fileModules, { resolve: './src/modules/stock-history' }],
})
