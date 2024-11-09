import { Hono } from 'hono'
import { cors } from 'hono/cors'
import auth from './routes/auth'
import audio from './routes/audio'
import { Env } from './types/env.types'

const app = new Hono<{ Bindings: Env }>()

// 全局中间件
app.use('*', cors())

// 路由
app.route('/auth', auth)
app.route('/audio', audio)

// 健康检查
app.get('/', (c) => c.json({ status: 'ok' }))

export default app
