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

module.exports = defineConfig({
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
  modules: [...redisModules, notificationModule],
})
