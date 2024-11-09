import { getSupabaseClient } from '../config/supabase'
import { RegisterRequest, LoginRequest, AuthResponse } from '../types/auth.types'
import * as jose from 'jose'
import { Env } from '../types/env.types'

export class AuthService {
  private static JWT_EXPIRES_IN = '24h'

  constructor(private env: Env) {}

  async register(data: RegisterRequest): Promise<AuthResponse> {
    const supabase = getSupabaseClient(this.env)
    const { data: user, error } = await supabase.auth.signUp({
      email: data.username,
      password: data.password,
    })

    if (error) throw new Error(error.message)
    if (!user.user) throw new Error('User creation failed')
    
    const token = await this.generateToken({
      sub: user.user.id,
      username: data.username,
      exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60 // 24 hours
    })

    return {
      token,
      user: {
        id: user.user.id,
        username: data.username,
      }
    }
  }

  async login(data: LoginRequest): Promise<AuthResponse> {
    const supabase = getSupabaseClient(this.env)
    const { data: user, error } = await supabase.auth.signInWithPassword({
      email: data.username,
      password: data.password,
    })

    if (error) throw new Error(error.message)
    if (!user.user) throw new Error('Login failed')

    const token = await this.generateToken({
      sub: user.user.id,
      username: data.username,
      exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60 // 24 hours
    })

    return {
      token,
      user: {
        id: user.user.id,
        username: data.username,
      }
    }
  }

  private async generateToken(payload: { sub: string; username: string; exp: number }): Promise<string> {
    const secret = new TextEncoder().encode(this.env.JWT_SECRET)
    return await new jose.SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256' })
      .sign(secret)
  }
} 