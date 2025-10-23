# MediTranslate - Healthcare Translation Web App

A real-time healthcare translation application built with React that enables voice-to-text transcription, live translation, and translated audio playback for medical professionals.

## 🚀 Features

- **Real-time Voice Capture**: Uses Web Speech API for accurate voice-to-text transcription
- **Live Translation**: AI-enhanced translation with medical terminology support
- **Text-to-Speech**: Plays translated text in the target language
- **Multi-language Support**: 12+ languages including English, Spanish, French, German, and more
- **Mobile-first Design**: Responsive UI optimized for mobile devices
- **Privacy-focused**: Local-only recording with no persistent PHI storage
- **Medical Term Enhancement**: Special handling for common medical terms

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS
- **Speech Recognition**: Web Speech API
- **Text-to-Speech**: Web Speech Synthesis API
- **Icons**: Lucide React
- **Deployment**: Vercel-ready

## 📋 Prerequisites

- Node.js (version 16 or higher)
- npm or yarn
- Modern web browser with speech recognition support
- HTTPS connection (required for speech recognition)

## 🚀 Quick Start

### 1. Clone and Install Dependencies

```bash
cd my-app
npm install
```

### 2. Start Development Server

```bash
npm run dev
```

### 3. Open in Browser

Navigate to `http://localhost:5173` (or the URL shown in your terminal)

## 🌐 Deployment

### Deploy to Vercel

1. **Install Vercel CLI** (if not already installed):
```bash
npm i -g vercel
```

2. **Deploy**:
```bash
vercel --prod
```

3. **Set Environment Variables** (if using OpenAI API):
```bash
vercel env add OPENAI_API_KEY
```

### Manual Deployment

1. **Build the project**:
```bash
npm run build
```

2. **Preview the build**:
```bash
npm run preview
```

3. **Deploy the `dist` folder** to your preferred hosting service

## 🎯 How to Use

### Basic Usage

1. **Select Languages**: Choose your source and target languages from the dropdown menus
2. **Start Recording**: Click the microphone button to begin voice capture
3. **Speak Clearly**: Speak in your selected source language
4. **View Translation**: The translated text will appear in real-time
5. **Listen to Translation**: Click the speaker button to hear the translated text

### Medical Phrases to Test

Try these sample medical phrases:

- "I have chest pain and shortness of breath"
- "The patient is experiencing nausea and dizziness"
- "Please describe your symptoms in detail"
- "When did the fever start?"
- "Are you allergic to any medications?"

### Supported Languages

- 🇺🇸 English
- 🇪🇸 Spanish
- 🇫🇷 French
- 🇩🇪 German
- 🇮🇹 Italian
- 🇵🇹 Portuguese
- 🇷🇺 Russian
- 🇯🇵 Japanese
- 🇰🇷 Korean
- 🇨🇳 Chinese
- 🇸🇦 Arabic
- 🇮🇳 Hindi

## 🔧 Configuration

### Browser Compatibility

- **Chrome**: Full support
- **Edge**: Full support
- **Safari**: Limited support
- **Firefox**: Limited support

### HTTPS Requirement

Speech recognition requires HTTPS. For local development:
- Use `https://localhost:5173` instead of `http://`
- Or deploy to Vercel for automatic HTTPS

## 🏗️ Project Structure

```
my-app/
├── src/
│   ├── App.jsx              # Main React application component
│   ├── main.jsx             # Application entry point with React 19
│   ├── index.css            # Global styles with Tailwind CSS
│   └── api/
│       └── translate.js      # Frontend translation API client
├── api/
│   └── translate.js          # Vercel API route (OpenAI integration)
├── server.js                 # Express.js backend server
├── public/
│   └── vite.svg
├── tailwind.config.js        # Tailwind CSS configuration
├── postcss.config.js         # PostCSS configuration
├── vite.config.js            # Vite build configuration
├── vercel.json               # Vercel deployment configuration
└── package.json              # Dependencies and scripts
```

## 🧠 AI Tools & Technologies

### Speech Recognition
- **Web Speech API**: Browser-native speech-to-text
- **Real-time Processing**: Continuous speech recognition
- **Language Support**: 12+ languages with medical terminology
- **Privacy-First**: Local processing, no cloud storage

### Translation Services
- **Primary**: OpenAI GPT-4o for medical translations
- **Fallback**: MyMemory API (free tier)
- **Backup**: LibreTranslate (open source)
- **Medical Enhancement**: Custom medical terminology database

### Text-to-Speech
- **Web Speech Synthesis API**: Browser-native TTS
- **Multi-language Support**: Native language voices
- **Medical Context**: Optimized for healthcare terminology

### Backend Architecture
- **Express.js Server**: RESTful API endpoints
- **AssemblyAI Integration**: Advanced audio transcription
- **CORS Enabled**: Cross-origin request support
- **Error Handling**: Comprehensive error management

## 🔒 Security Considerations

### Data Privacy
- **Local Processing**: Voice data processed in browser only
- **No PHI Storage**: No medical information stored permanently
- **HTTPS Required**: All communications encrypted
- **Clear Consent**: User informed about data handling

### API Security
- **Environment Variables**: API keys stored securely
- **Input Validation**: All user inputs sanitized
- **Rate Limiting**: API usage monitoring
- **Error Handling**: Secure error messages

### Browser Security
- **HTTPS Enforcement**: Speech recognition requires secure connection
- **Permission Management**: Microphone access with user consent
- **CORS Configuration**: Controlled cross-origin access
- **Content Security Policy**: XSS protection

### Medical Data Protection
- **HIPAA Considerations**: No persistent medical data storage
- **Local-Only Processing**: Voice data never leaves user's device
- **Transparent Privacy**: Clear privacy notices and data handling
- **Secure Transmission**: All API calls use HTTPS encryption

## 🏛️ Code Architecture

### Frontend (React 19)
```javascript
// Main App Component Structure
App.jsx
├── State Management (useState, useEffect)
├── Speech Recognition (Web Speech API)
├── Translation Logic (API Integration)
├── Text-to-Speech (Web Speech Synthesis)
└── UI Components (Tailwind CSS)
```

### Backend (Express.js)
```javascript
// Server Architecture
server.js
├── Translation Endpoint (/api/translate)
├── Transcription Endpoint (/api/transcribe)
├── Health Check (/api/health)
└── CORS & Security Middleware
```

### API Integration Flow
1. **Voice Input** → Web Speech API → Text
2. **Text Processing** → Medical Enhancement → API Call
3. **Translation** → OpenAI/MyMemory/LibreTranslate → Result
4. **Audio Output** → Web Speech Synthesis → Playback

### Key Components

#### Speech Recognition (`App.jsx`)
- Real-time voice capture
- Language-specific recognition
- Error handling and fallbacks
- Privacy-focused processing

#### Translation API (`src/api/translate.js`)
- Multi-provider translation
- Medical terminology enhancement
- Fallback mechanisms
- Error handling

#### Backend Server (`server.js`)
- Express.js REST API
- AssemblyAI integration
- Medical terminology database
- CORS and security middleware

### Data Flow
```
User Voice → Browser Speech API → Text → Translation API → Translated Text → TTS → Audio Output
```

### Error Handling
- **Speech Recognition**: Browser compatibility checks
- **Translation**: Multi-provider fallback system
- **TTS**: Voice availability validation
- **Network**: Connection error management

## 🔒 Privacy & Security

- **Local Processing**: Voice recordings are processed locally in your browser
- **No PHI Storage**: No medical information is stored or transmitted
- **HTTPS Required**: All communication is encrypted
- **Clear Notices**: Users are informed about data handling practices

## 🐛 Troubleshooting

### Common Issues

1. **Speech Recognition Not Working**:
   - Ensure you're using HTTPS
   - Check browser permissions for microphone access
   - Try refreshing the page

2. **Translation Not Appearing**:
   - Check your internet connection
   - Verify the API endpoint is accessible
   - Look for error messages in the browser console

3. **Text-to-Speech Not Working**:
   - Ensure your browser supports speech synthesis
   - Check that the target language is supported
   - Try clicking the stop button and speaking again

### Browser Console

Check the browser console (F12) for detailed error messages and debugging information.

## 🚀 Future Enhancements

- [ ] OpenAI API integration for better translation quality
- [ ] Offline mode support
- [ ] Medical terminology database
- [ ] Voice activity detection
- [ ] Multi-user support
- [ ] Custom language models
- [ ] Integration with EHR systems


## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For support or questions:
- Create an issue in the repository
- Check the troubleshooting section
- Review the browser console for error messages

---

**Built with ❤️ for healthcare professionals**
