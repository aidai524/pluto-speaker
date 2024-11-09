import OpenAI from 'openai'
import { Env } from '../types/env.types'

export function getOpenAIClient(env: Env) {
  if (!env.OPENAI_API_KEY) {
    throw new Error('Missing OpenAI API key')
  }

  return new OpenAI({
    apiKey: env.OPENAI_API_KEY,
  })
} 