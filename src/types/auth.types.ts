export interface RegisterRequest {
  username: string
  password: string
}

export interface LoginRequest {
  username: string
  password: string
}

export interface AuthResponse {
  token: string
  user: {
    id: string
    username: string
  }
}

export interface JWTPayload {
  sub: string
  username: string
  exp: number
} 