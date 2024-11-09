import { Hono } from 'hono'
import { AuthService } from '../services/auth.service'
import { RegisterRequest, LoginRequest } from '../types/auth.types'
import { Env } from '../types/env.types'

const auth = new Hono<{ Bindings: Env }>()

auth.post('/register', async (c) => {
  try {
    const authService = new AuthService(c.env)
    const body = await c.req.json() as RegisterRequest
    const result = await authService.register(body)
    return c.json(result, 201)
  } catch (error: any) {
    console.error('Registration error:', error)
    return c.json({ error: error.message }, 400)
  }
})

auth.post('/login', async (c) => {
  try {
    const authService = new AuthService(c.env)
    const body = await c.req.json() as LoginRequest
    const result = await authService.login(body)
    return c.json(result)
  } catch (error: any) {
    console.error('Login error:', error)
    return c.json({ error: error.message }, 401)
  }
})

export default auth 