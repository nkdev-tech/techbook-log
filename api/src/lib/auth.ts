import { env } from 'cloudflare:workers'
import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { hashPassword, verifyPassword } from '@better-auth/utils/password'
import { db } from '../db'
import { Resend } from 'resend'

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'sqlite',
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    password: {
      hash: hashPassword,
      verify: ({ hash, password }) => verifyPassword(hash, password),
    },
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      const resend = new Resend(env.RESEND_API_KEY as string)
      await resend.emails.send({
        from: env.RESEND_FROM_EMAIL as string,
        to: user.email,
        subject: 'メールアドレスの確認',
        html: `
        <p>memetec へのご登録ありがとうございます。</p>
        <p>以下のリンクをクリックして、メールアドレスの確認を完了してください。</p>
        <p><a href="${url}">メールアドレスを確認する</a></p>
        <p>このリンクの有効期限は1時間です。</p>
        <p>このメールに心当たりがない場合は、このメールを無視してください。アカウントが作成されることはありません。</p>
      `,
      })
    },
    autoSignInAfterVerification: true,
  },
  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID as string,
      clientSecret: env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  secret: env.BETTER_AUTH_SECRET as string,
  trustedOrigins: [env.ORIGIN_URL as string],
  baseURL: env.BETTER_AUTH_URL as string,
  session: {
    expiresIn: 60 * 60 * 24 * 30,
    updateAge: 60 * 60 * 24,
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5,
    },
  },
  rateLimit: {
    enabled: true,
    window: 60,
    max: 10,
  },
  advanced: {
    crossSubDomainCookies: {
      enabled: env.ENV === 'production',
      domain: 'memetec.dev',
    },
  },
})
