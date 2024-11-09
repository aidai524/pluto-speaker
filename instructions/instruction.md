# PRD Document: API System with Audio Interaction

## Project Overview

The goal of this project is to develop an API system using the Hono framework. This system will leverage OpenAI's audio generation capabilities to provide voice interaction features. The final code will be deployed on Cloudflare Workers.

## Core Functionalities

1. **User Management with Supabase**
   - **User Registration**: Implement user registration using a username and password.
   - **User Login**: Allow users to log in using a username and password.
   - **Authentication**: Utilize JWT for user authentication post-login to ensure secure access to the API.

2. **API Architecture**
   - **RESTful API**: Design all interfaces following RESTful architecture principles to ensure consistency and scalability.
   - **Cross-Platform Compatibility**: Ensure APIs can be accessed and utilized by mobile apps and embedded applications.

3. **Audio Interaction using OpenAI**
   - **Audio Input and Output**: Integrate OpenAI's audio generation capabilities to process voice inputs and return AI-generated voice responses.
   - **Interaction Logging**: Record all interactions for future reference and analysis.

## Technical Implementation

### 1. User Management with Supabase
- **Database Setup**: Use Supabase to manage user data and authentication.
- **Endpoints**:
  - `POST /register`: Register a new user with a username and password.
  - `POST /login`: Authenticate a user and return a JWT token for session management.

### 2. Audio Processing with OpenAI

#### Audio Output from Model
```javascript
import { writeFileSync } from "node:fs";
import OpenAI from "openai";

const openai = new OpenAI();

// Generate an audio response to the given prompt
const response = await openai.chat.completions.create({
  model: "gpt-4o-audio-preview",
  modalities: ["text", "audio"],
  audio: { voice: "alloy", format: "wav" },
  messages: [
    {
      role: "user",
      content: "Is a golden retriever a good family dog?"
    }
  ]
});

// Inspect returned data
console.log(response.choices[0]);

// Write audio data to a file
writeFileSync(
  "dog.wav",
  Buffer.from(response.choices[0].message.audio.data, 'base64'),
  { encoding: "utf-8" }
);
```

#### Audio Input to Model
```javascript
import OpenAI from "openai";
const openai = new OpenAI();

// Fetch an audio file and convert it to a base64 string
const url = "https://openaiassets.blob.core.windows.net/$web/API/docs/audio/alloy.wav";
const audioResponse = await fetch(url);
const buffer = await audioResponse.arrayBuffer();
const base64str = Buffer.from(buffer).toString("base64");

const response = await openai.chat.completions.create({
  model: "gpt-4o-audio-preview",
  modalities: ["text", "audio"],
  audio: { voice: "alloy", format: "wav" },
  messages: [
    {
      role: "user",
      content: [
        { type: "text", text: "What is in this recording?" },
        { type: "input_audio", input_audio: { data: base64str, format: "wav" }}
      ]
    }
  ]
});

console.log(response.choices[0]);
```

### 3. Deployment on Cloudflare Workers
- **Configuration**: Use `wrangler.toml` for Cloudflare Workers configuration.
- **Deployment**: Ensure the final application is optimized for deployment on Cloudflare Workers for scalability and performance.

## Current File Structure
```
pluto-speaker
├── README.md
├── package.json
├── src
│   └── index.ts
├── tsconfig.json
├── wrangler.toml
└── yarn.lock
```

## Additional Considerations
- **Security**: Ensure all data, especially user credentials and audio data, are securely handled and encrypted.
- **Scalability**: Design the system to handle a large number of requests efficiently.
- **Documentation**: Provide comprehensive documentation for API usage, including example requests and responses, to assist developers in integrating the API into various applications.