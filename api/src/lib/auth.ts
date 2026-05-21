import { env } from 'cloudflare:workers'
import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
// TODO: @better-auth/utils/password の workerd 対応が入ったら下記実装を削除して
//       import { hashPassword, verifyPassword } from '@better-auth/utils/password' に戻す
//       https://github.com/better-auth/utils/pull/17
import { scrypt, randomBytes, timingSafeEqual } from 'node:crypto'
import { db } from '../db'
import { Resend } from 'resend'

const SCRYPT_PARAMS = { N: 16384, r: 8, p: 1 }
const KEY_LEN = 64

function scryptAsync(
  password: string,
  salt: string,
  keylen: number,
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scrypt(password, salt, keylen, SCRYPT_PARAMS, (err, key) => {
      if (err) reject(err)
      else resolve(key)
    })
  })
}

async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString('hex')
  const key = await scryptAsync(password, salt, KEY_LEN)
  return `${salt}:${key.toString('hex')}`
}

async function verifyPassword({
  hash,
  password,
}: {
  hash: string
  password: string
}): Promise<boolean> {
  const [salt, keyHex] = hash.split(':')
  if (!salt || !keyHex) return false
  const key = await scryptAsync(password, salt, KEY_LEN)
  const stored = Buffer.from(keyHex, 'hex')
  if (key.length !== stored.length) return false
  return timingSafeEqual(key, stored)
}

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'sqlite',
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    password: {
      hash: hashPassword,
      verify: verifyPassword,
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
  user: {
    deleteUser: {
      enabled: true,
    },
  },
})
