import { auth } from '../lib/auth'
import { createMiddleware } from 'hono/factory'

export type AuthVariables = {
  Variables: {
    session: typeof auth.$Infer.Session.session
    user: typeof auth.$Infer.Session.user
  }
}

export const authMiddleware = createMiddleware<AuthVariables>(
  async (c, next) => {
    try {
      const session = await auth.api.getSession({ headers: c.req.raw.headers })
      if (!session) {
        return c.json({}, 401)
      }

      c.set('session', session.session)
      c.set('user', session.user)
      await next()
    } catch (e) {
      console.error('Auth middleware error:', e)
      return c.json({}, 500)
    }
  },
)
