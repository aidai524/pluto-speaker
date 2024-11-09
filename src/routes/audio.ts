import { Hono } from 'hono'
import { AudioService } from '../services/audio.service'
import { TextToSpeechRequest, SpeechToTextRequest } from '../types/audio.types'
import { authMiddleware } from '../middleware/auth'
import { Env } from '../types/env.types'

const audio = new Hono<{ Bindings: Env }>()

// 应用认证中间件
audio.use('*', authMiddleware)

// 文本转语音
audio.post('/text-to-speech', async (c) => {
  try {
    const audioService = new AudioService(c.env)
    const body = await c.req.json() as TextToSpeechRequest
    const result = await audioService.textToSpeech(body)
    
    // 根据 responseType 返回不同格式
    if (body.responseType === 'binary') {
      if (!result.audioBuffer) {
        throw new Error('No audio data')
      }
      // 设置响应头，让浏览器知道这是一个音频文件
      c.header('Content-Type', 'audio/wav')
      c.header('Content-Disposition', 'attachment; filename="audio.wav"')
      return c.body(result.audioBuffer)
    } else {
      // 默认返回 JSON 格式
      return c.json({
        audioData: result.audioData,
        format: result.format
      })
    }
  } catch (error: any) {
    console.error('Text to speech error:', error)
    return c.json({ error: error.message }, 400)
  }
})

// 语音对话
audio.post('/chat', async (c) => {
  try {
    const audioService = new AudioService(c.env)
    const body = await c.req.json() as SpeechToTextRequest
    const result = await audioService.chatWithAudio(body)
    
    // 根据 responseType 返回不同格式
    if (body.responseType === 'binary') {
      if (!result.audioBuffer) {
        throw new Error('No audio data')
      }
      // 设置响应头
      c.header('Content-Type', 'audio/wav')
      c.header('Content-Disposition', 'attachment; filename="response.wav"')
      c.header('X-Response-Text', encodeURIComponent(result.text || ''))
      return c.body(result.audioBuffer)
    } else {
      // 默认返回 JSON 格式
      return c.json({
        audioData: result.audioData,
        text: result.text,
        format: result.format
      })
    }
  } catch (error: any) {
    console.error('Audio chat error:', error)
    return c.json({ error: error.message }, 400)
  }
})

// 语音转文本保持不变
audio.post('/speech-to-text', async (c) => {
  try {
    const audioService = new AudioService(c.env)
    const body = await c.req.json() as SpeechToTextRequest
    const result = await audioService.speechToText(body)
    return c.json(result)
  } catch (error: any) {
    console.error('Speech to text error:', error)
    return c.json({ error: error.message }, 400)
  }
})

export default audio 