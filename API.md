# Pluto Speaker API Documentation

## Base URL
```
https://pluto-speaker.aidai524.workers.dev
```

## Authentication
除了注册和登录接口外，所有API请求都需要在header中携带JWT token：
```
Authorization: Bearer <your_jwt_token>
```

## API Endpoints

### 1. 用户注册
注册新用户账号。

**Endpoint:** `POST /auth/register`

**Request Body:**
```json
{
  "username": "your_email@example.com",
  "password": "your_password"
}
```

**Response:** (201 Created)
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "user_id",
    "username": "your_email@example.com"
  }
}
```

**Error Response:** (400 Bad Request)
```json
{
  "error": "Error message"
}
```

### 2. 用户登录
登录已有账号。

**Endpoint:** `POST /auth/login`

**Request Body:**
```json
{
  "username": "your_email@example.com",
  "password": "your_password"
}
```

**Response:** (200 OK)
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "user_id",
    "username": "your_email@example.com"
  }
}
```

**Error Response:** (401 Unauthorized)
```json
{
  "error": "Invalid credentials"
}
```

### 3. 文本转语音
将文本转换为语音。

**Endpoint:** `POST /audio/text-to-speech`

**Request Body:**
```json
{
  "text": "要转换的文本内容",
  "voice": "alloy",  // 可选，默认为 "alloy"
  "responseType": "binary"  // 可选，默认为 "json"
}
```

**参数说明：**
- `text`: 要转换的文本内容
- `voice`: 语音类型，可选值：alloy, echo, fable, onyx, nova, shimmer
- `responseType`: 响应格式，可选值：
  - `"json"`: 返回包含 base64 编码音频数据的 JSON（默认）
  - `"binary"`: 直接返回二进制音频文件

**Response:** 

当 `responseType` 为 `"json"` 时 (200 OK):
```json
{
  "audioData": "base64编码的音频数据",
  "format": "wav"
}
```

当 `responseType` 为 `"binary"` 时:
- Content-Type: audio/wav
- Content-Disposition: attachment; filename="audio.wav"
- Response Body: 二进制音频数据

**Error Response:** (400 Bad Request)
```json
{
  "error": "Error message"
}
```

### 4. 语音转文本
将语音转换为文本。

**Endpoint:** `POST /audio/speech-to-text`

**Request Body:**
```json
{
  "audio": "base64编码的音频数据",
  "format": "wav"  // 支持的格式：wav, mp3, ogg
}
```

**Response:** (200 OK)
```json
{
  "text": "转换后的文本内容"
}
```

**Error Response:** (400 Bad Request)
```json
{
  "error": "Error message"
}
```

### 5. 语音对话
发送语音并获取AI的语音回复。

**Endpoint:** `POST /audio/chat`

**Request Body:**
```json
{
  "audio": "base64编码的音频数据",
  "format": "wav",  // 支持的格式：wav, mp3, ogg
  "responseType": "binary"  // 可选，默认为 "json"
}
```

**Response:**

当 `responseType` 为 `"json"` 时 (200 OK):
```json
{
  "audioData": "base64编码的音频回复",
  "text": "音频对应的文本内容",
  "format": "wav"
}
```

当 `responseType` 为 `"binary"` 时:
- Content-Type: audio/wav
- Content-Disposition: attachment; filename="response.wav"
- X-Response-Text: [URL编码的回复文本]
- Response Body: 二进制音频数据

## 调用示例

### JavaScript/TypeScript 示例

```typescript
// 文本转语音 - JSON 格式
async function textToSpeechJson(token: string, text: string) {
  const response = await fetch('https://pluto-speaker.aidai524.workers.dev/audio/text-to-speech', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ 
      text,
      voice: 'alloy',
      responseType: 'json'
    })
  });

  const data = await response.json();
  // 使用 base64 数据
  const audio = new Audio(`data:audio/wav;base64,${data.audioData}`);
  audio.play();
}

// 文本转语音 - 二进制格式
async function textToSpeechBinary(token: string, text: string) {
  const response = await fetch('https://pluto-speaker.aidai524.workers.dev/audio/text-to-speech', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ 
      text,
      voice: 'alloy',
      responseType: 'binary'
    })
  });

  const blob = await response.blob();
  const audioUrl = URL.createObjectURL(blob);
  
  // 播放音频
  const audio = new Audio(audioUrl);
  audio.play();
  
  // 或下载文件
  const link = document.createElement('a');
  link.href = audioUrl;
  link.download = 'audio.wav';
  link.click();
}

// 语音对话 - 二进制格式
async function chatWithAudioBinary(token: string, audioBase64: string) {
  const response = await fetch('https://pluto-speaker.aidai524.workers.dev/audio/chat', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ 
      audio: audioBase64,
      format: 'wav',
      responseType: 'binary'
    })
  });

  // 获取响应文本
  const responseText = decodeURIComponent(response.headers.get('X-Response-Text') || '');
  console.log('Response text:', responseText);

  // 获取并播放音频
  const blob = await response.blob();
  const audioUrl = URL.createObjectURL(blob);
  const audio = new Audio(audioUrl);
  audio.play();
}
```

### Python 示例

```python
import requests
import base64
import wave
import io

class PlutoSpeakerClient:
    def __init__(self, token):
        self.base_url = 'https://pluto-speaker.aidai524.workers.dev'
        self.headers = {
            'Authorization': f'Bearer {token}',
            'Content-Type': 'application/json'
        }

    def text_to_speech_json(self, text: str, voice: str = 'alloy') -> dict:
        """获取JSON格式的文本转语音结果"""
        response = requests.post(
            f'{self.base_url}/audio/text-to-speech',
            headers=self.headers,
            json={
                'text': text,
                'voice': voice,
                'responseType': 'json'
            }
        )
        response.raise_for_status()
        return response.json()

    def text_to_speech_binary(self, text: str, voice: str = 'alloy') -> bytes:
        """获取二进制格式的文本转语音结果"""
        response = requests.post(
            f'{self.base_url}/audio/text-to-speech',
            headers=self.headers,
            json={
                'text': text,
                'voice': voice,
                'responseType': 'binary'
            }
        )
        response.raise_for_status()
        return response.content

    def save_audio(self, audio_data: bytes, filename: str):
        """保存音频文件"""
        with open(filename, 'wb') as f:
            f.write(audio_data)

# 使用示例
def main():
    client = PlutoSpeakerClient('your-token-here')
    
    # JSON格式示例
    json_result = client.text_to_speech_json('Hello, World!')
    with open('audio_json.wav', 'wb') as f:
        f.write(base64.b64decode(json_result['audioData']))
    
    # 二进制格式示例
    binary_data = client.text_to_speech_binary('Hello, World!')
    client.save_audio(binary_data, 'audio_binary.wav')

if __name__ == '__main__':
    main()
```

### C++ 示例

```cpp
#include <iostream>
#include <string>
#include <cstdlib>
#include <curl/curl.h>
#include <nlohmann/json.hpp>
#include <fstream>

using json = nlohmann::json;

class PlutoSpeakerClient {
private:
    std::string base_url = "https://pluto-speaker.aidai524.workers.dev";
    std::string token;
    CURL* curl;

    static size_t WriteCallback(void* contents, size_t size, size_t nmemb, std::string* userp) {
        userp->append((char*)contents, size * nmemb);
        return size * nmemb;
    }

    json makeRequest(const std::string& endpoint, const json& data) {
        std::string url = base_url + endpoint;
        std::string response;
        
        struct curl_slist* headers = NULL;
        headers = curl_slist_append(headers, ("Authorization: Bearer " + token).c_str());
        headers = curl_slist_append(headers, "Content-Type: application/json");

        std::string post_data = data.dump();

        curl_easy_setopt(curl, CURLOPT_URL, url.c_str());
        curl_easy_setopt(curl, CURLOPT_POSTFIELDS, post_data.c_str());
        curl_easy_setopt(curl, CURLOPT_HTTPHEADER, headers);
        curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, WriteCallback);
        curl_easy_setopt(curl, CURLOPT_WRITEDATA, &response);

        CURLcode res = curl_easy_perform(curl);
        curl_slist_free_all(headers);

        if (res != CURLE_OK) {
            throw std::runtime_error(curl_easy_strerror(res));
        }

        return json::parse(response);
    }

public:
    PlutoSpeakerClient(const std::string& auth_token) : token(auth_token) {
        curl = curl_easy_init();
        if (!curl) {
            throw std::runtime_error("Failed to initialize CURL");
        }
    }

    ~PlutoSpeakerClient() {
        if (curl) {
            curl_easy_cleanup(curl);
        }
    }

    json textToSpeech(const std::string& text, const std::string& voice = "alloy") {
        json data = {
            {"text", text},
            {"voice", voice}
        };
        return makeRequest("/audio/text-to-speech", data);
    }

    json speechToText(const std::string& audio_file_path) {
        // 读取音频文件并转换为base64
        std::ifstream file(audio_file_path, std::ios::binary);
        if (!file) {
            throw std::runtime_error("Cannot open audio file");
        }

        std::vector<char> buffer(std::istreambuf_iterator<char>(file), {});
        std::string base64_audio = // base64 encode buffer

        json data = {
            {"audio", base64_audio},
            {"format", "wav"}
        };
        return makeRequest("/audio/speech-to-text", data);
    }

    json chatWithAudio(const std::string& audio_file_path) {
        // 类似 speechToText 的实现
        // ...
        return makeRequest("/audio/chat", data);
    }
};

int main() {
    try {
        // 初始化 libcurl
        curl_global_init(CURL_GLOBAL_ALL);

        // 创建客户端
        PlutoSpeakerClient client("your-token-here");

        // 文本转语音
        json tts_result = client.textToSpeech("Hello, how are you?");
        std::cout << "TTS Response: " << tts_result.dump(2) << std::endl;

        // 语音转文本
        json stt_result = client.speechToText("input.wav");
        std::cout << "STT Response: " << stt_result.dump(2) << std::endl;

        // 语音对话
        json chat_result = client.chatWithAudio("input.wav");
        std::cout << "Chat Response: " << chat_result.dump(2) << std::endl;

        // 清理
        curl_global_cleanup();
    }
    catch (const std::exception& e) {
        std::cerr << "Error: " << e.what() << std::endl;
        return 1;
    }

    return 0;
}
```

## 注意事项

1. 所有请求和响应的Content-Type都是application/json，除非指定 responseType='binary'
2. 当使用 binary 响应类型时，响应直接是二进制音频数据
3. 对于语音对话，文本响应会在 binary 模式下通过 X-Response-Text 头返回
4. 支持的音频格式：wav, mp3, ogg
5. 语音转换有一定的大小限制，建议控制在10MB以内
6. 所有音频相关的API都需要认证
7. token有效期为24小时
8. 在生产环境中使用时，建议使用HTTPS确保数据传输安全