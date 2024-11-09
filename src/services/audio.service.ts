import { getOpenAIClient } from '../config/openai'
import { TextToSpeechRequest, SpeechToTextRequest, AudioResponse } from '../types/audio.types'
import { Env } from '../types/env.types'

export class AudioService {
  constructor(private env: Env) {}

  // 辅助方法：base64 转 ArrayBuffer
  private base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  }

  async textToSpeech(data: TextToSpeechRequest): Promise<AudioResponse> {
    const openai = getOpenAIClient(this.env)
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o-audio-preview",
      modalities: ["text", "audio"],
      audio: { 
        voice: data.voice || "alloy", 
        format: "wav" 
      },
      messages: [
        {
          role: "user",
          content: data.text
        }
      ]
    })

    const audioData = response.choices[0]?.message?.audio?.data
    if (!audioData) {
      throw new Error('No audio data in response')
    }

    return {
      audioBuffer: data.responseType === 'binary' ? this.base64ToArrayBuffer(audioData) : undefined,
      audioData: data.responseType === 'binary' ? undefined : audioData,
      format: 'wav'
    }
  }

  async speechToText(data: SpeechToTextRequest): Promise<AudioResponse> {
    const openai = getOpenAIClient(this.env)
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o-audio-preview",
      modalities: ["text", "audio"],
      audio: { 
        voice: "alloy", 
        format: "wav" 
      },
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: "What is in this recording?" },
            { 
              type: "input_audio", 
              input_audio: { 
                data: data.audio, 
                format: data.format 
              }
            }
          ]
        }
      ]
    })

    const text = response.choices[0]?.message?.content
    if (typeof text !== 'string') {
      throw new Error('Invalid response format')
    }

    return {
      text
    }
  }

  async chatWithAudio(data: SpeechToTextRequest): Promise<AudioResponse> {
    const openai = getOpenAIClient(this.env)
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o-audio-preview",
      modalities: ["text", "audio"],
      audio: { 
        voice: "alloy", 
        format: "wav" 
      },
      messages: [
        {
          role: "user",
          content: [
            { 
              type: "input_audio", 
              input_audio: { 
                data: data.audio, 
                format: data.format 
              }
            }
          ]
        }
      ]
    })

    const audioData = response.choices[0]?.message?.audio?.data
    const text = response.choices[0]?.message?.content

    if (!audioData || typeof text !== 'string') {
      throw new Error('Invalid response format')
    }

    return {
      audioBuffer: data.responseType === 'binary' ? this.base64ToArrayBuffer(audioData) : undefined,
      audioData: data.responseType === 'binary' ? undefined : audioData,
      text,
      format: 'wav'
    }
  }
} 