export interface TextToSpeechRequest {
  text: string
  voice?: 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer'
  responseType?: 'json' | 'binary'
}

export interface SpeechToTextRequest {
  audio: string // base64 encoded audio data
  format: 'wav' | 'mp3' | 'ogg'
  responseType?: 'json' | 'binary'
}

export interface AudioResponse {
  audioBuffer?: ArrayBuffer  // 二进制格式
  audioData?: string        // base64格式
  text?: string
  format?: string
}

// OpenAI specific types
export interface AudioMessage {
  type: 'text' | 'input_audio'
  text?: string
  input_audio?: {
    data: string
    format: string
  }
}

export interface AudioConfig {
  voice: string
  format: string
} 