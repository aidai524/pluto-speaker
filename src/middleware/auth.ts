import { Context } from 'hono'
import * as jose from 'jose'
import { JWTPayload } from '../types/auth.types'
import { Env } from '../types/env.types'

export async function authMiddleware(c: Context<{ Bindings: Env }>, next: Function) {
  try {
    const token = c.req.header('Authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return c.json({ error: 'No token provided' }, 401)
    }

    const secret = new TextEncoder().encode(c.env.JWT_SECRET)
    const { payload } = await jose.jwtVerify(token, secret)
    
    c.set('user', {
      sub: payload.sub,
      username: payload.username as string,
      exp: payload.exp
    })
    await next()
  } catch (error: any) {
    return c.json({ error: 'Invalid token' }, 401)
  }
} 