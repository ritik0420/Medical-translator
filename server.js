import express from 'express';
import cors from 'cors';
import { AssemblyAI } from 'assemblyai';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize AssemblyAI client
const client = new AssemblyAI({
  apiKey: process.env.ASSEMBLYAI_API_KEY,
});

// Middleware
app.use(cors());
app.use(express.json());

// Translation endpoint using LibreTranslate (free)
app.post('/api/translate', async (req, res) => {
  try {
    const { text, sourceLang, targetLang } = req.body;

    // Validate input
    if (!text || !sourceLang || !targetLang) {
      return res.status(400).json({ 
        error: 'Missing required fields: text, sourceLang, targetLang' 
      });
    }

    // Language code mapping for LibreTranslate
    const languageCodes = {
      'en': 'en',
      'es': 'es', 
      'fr': 'fr',
      'de': 'de',
      'it': 'it',
      'pt': 'pt',
      'ru': 'ru',
      'ja': 'ja',
      'ko': 'ko',
      'zh': 'zh',
      'ar': 'ar',
      'hi': 'hi'
    };

    const sourceCode = languageCodes[sourceLang] || sourceLang;
    const targetCode = languageCodes[targetLang] || targetLang;

    // Enhanced medical terminology handling first
    const medicalTerms = {
      'pain': { es: 'dolor', fr: 'douleur', de: 'schmerz', it: 'dolore', pt: 'dor', ru: 'боль', ja: '痛み', ko: '통증', zh: '疼痛', ar: 'ألم', hi: 'दर्द' },
      'fever': { es: 'fiebre', fr: 'fièvre', de: 'fieber', it: 'febbre', pt: 'febre', ru: 'лихорадка', ja: '熱', ko: '열', zh: '发烧', ar: 'حمى', hi: 'बुखार' },
      'headache': { es: 'dolor de cabeza', fr: 'mal de tête', de: 'kopfschmerzen', it: 'mal di testa', pt: 'dor de cabeça', ru: 'головная боль', ja: '頭痛', ko: '두통', zh: '头痛', ar: 'صداع', hi: 'सिरदर्द' },
      'chest': { es: 'pecho', fr: 'poitrine', de: 'brust', it: 'petto', pt: 'peito', ru: 'грудь', ja: '胸', ko: '가슴', zh: '胸部', ar: 'صدر', hi: 'छाती' },
      'breathing': { es: 'respiración', fr: 'respiration', de: 'atmung', it: 'respirazione', pt: 'respiração', ru: 'дыхание', ja: '呼吸', ko: '호흡', zh: '呼吸', ar: 'تنفس', hi: 'साँस लेना' },
      'nausea': { es: 'náusea', fr: 'nausée', de: 'übelkeit', it: 'nausea', pt: 'náusea', ru: 'тошнота', ja: '吐き気', ko: '메스꺼움', zh: '恶心', ar: 'غثيان', hi: 'मतली' },
      'dizziness': { es: 'mareo', fr: 'vertige', de: 'schwindel', it: 'vertigini', pt: 'tontura', ru: 'головокружение', ja: 'めまい', ko: '현기증', zh: '头晕', ar: 'دوار', hi: 'चक्कर' },
      'stomach': { es: 'estómago', fr: 'estomac', de: 'magen', it: 'stomaco', pt: 'estômago', ru: 'желудок', ja: '胃', ko: '위', zh: '胃', ar: 'معدة', hi: 'पेट' },
      'ache': { es: 'dolor', fr: 'douleur', de: 'schmerz', it: 'dolore', pt: 'dor', ru: 'боль', ja: '痛み', ko: '통증', zh: '疼痛', ar: 'ألم', hi: 'दर्द' },
      'back': { es: 'espalda', fr: 'dos', de: 'rücken', it: 'schiena', pt: 'costas', ru: 'спина', ja: '背中', ko: '등', zh: '背部', ar: 'ظهر', hi: 'पीठ' },
      'leg': { es: 'pierna', fr: 'jambe', de: 'bein', it: 'gamba', pt: 'perna', ru: 'нога', ja: '脚', ko: '다리', zh: '腿', ar: 'ساق', hi: 'पैर' },
      'arm': { es: 'brazo', fr: 'bras', de: 'arm', it: 'braccio', pt: 'braço', ru: 'рука', ja: '腕', ko: '팔', zh: '手臂', ar: 'ذراع', hi: 'बांह' },
      'neck': { es: 'cuello', fr: 'cou', de: 'hals', it: 'collo', pt: 'pescoço', ru: 'шея', ja: '首', ko: '목', zh: '脖子', ar: 'رقبة', hi: 'गर्दन' },
      'shoulder': { es: 'hombro', fr: 'épaule', de: 'schulter', it: 'spalla', pt: 'ombro', ru: 'плечо', ja: '肩', ko: '어깨', zh: '肩膀', ar: 'كتف', hi: 'कंधा' },
      'have': { es: 'tengo', fr: 'j\'ai', de: 'habe', it: 'ho', pt: 'tenho', ru: 'у меня', ja: '持っている', ko: '가지고 있다', zh: '有', ar: 'لدي', hi: 'मेरे पास' },
      'i': { es: 'yo', fr: 'je', de: 'ich', it: 'io', pt: 'eu', ru: 'я', ja: '私', ko: '나', zh: '我', ar: 'أنا', hi: 'मैं' }
    };

    // Check if we can provide a medical-specific translation
    let medicalTranslation = '';
    const lowerText = text.toLowerCase();
    
    // Handle common medical phrases
    if (lowerText.includes('stomach ache') || lowerText.includes('stomach pain')) {
      const stomachTerm = medicalTerms['stomach'][targetLang];
      const acheTerm = medicalTerms['ache'][targetLang];
      const haveTerm = medicalTerms['have'][targetLang];
      const iTerm = medicalTerms['i'][targetLang];
      
      if (stomachTerm && acheTerm && haveTerm && iTerm) {
        medicalTranslation = `${iTerm} ${haveTerm} ${stomachTerm} ${acheTerm}`;
      }
    } else if (lowerText.includes('headache')) {
      const headacheTerm = medicalTerms['headache'][targetLang];
      const haveTerm = medicalTerms['have'][targetLang];
      const iTerm = medicalTerms['i'][targetLang];
      
      if (headacheTerm && haveTerm && iTerm) {
        medicalTranslation = `${iTerm} ${haveTerm} ${headacheTerm}`;
      }
    } else if (lowerText.includes('chest pain')) {
      const chestTerm = medicalTerms['chest'][targetLang];
      const acheTerm = medicalTerms['ache'][targetLang];
      const haveTerm = medicalTerms['have'][targetLang];
      const iTerm = medicalTerms['i'][targetLang];
      
      if (chestTerm && acheTerm && haveTerm && iTerm) {
        medicalTranslation = `${iTerm} ${haveTerm} ${chestTerm} ${acheTerm}`;
      }
    }

    // If we have a medical translation, use it
    if (medicalTranslation) {
      return res.json({
        translation: medicalTranslation,
        sourceLang,
        targetLang,
        provider: 'medical-terms'
      });
    }

    // Try MyMemory API for other translations
    try {
      const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${sourceCode}|${targetCode}`);
      
      if (!response.ok) {
        throw new Error(`MyMemory API error: ${response.status}`);
      }

      const data = await response.json();
      
      // Check if we got valid response and it's not gibberish
      if (data && data.responseData && data.responseData.translatedText) {
        const translation = data.responseData.translatedText;
        
        // Basic quality check - if translation is too different from original, use fallback
        if (translation.length < text.length * 0.3 || translation.length > text.length * 3) {
          throw new Error('Translation quality too poor');
        }
        
        return res.json({
          translation: translation,
          sourceLang,
          targetLang,
          provider: 'mymemory'
        });
      } else {
        throw new Error('Invalid response from MyMemory');
      }
    } catch (mymemoryError) {
      console.log('MyMemory failed, trying LibreTranslate:', mymemoryError.message);
      
      // Try LibreTranslate as backup
      try {
        const libreResponse = await fetch('https://libretranslate.de/translate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            q: text,
            source: sourceCode,
            target: targetCode,
            format: 'text'
          })
        });

        if (libreResponse.ok) {
          const libreData = await libreResponse.json();
          if (libreData && libreData.translatedText) {
            return res.json({
              translation: libreData.translatedText,
              sourceLang,
              targetLang,
              provider: 'libretranslate'
            });
          }
        }
      } catch (libreError) {
        console.log('LibreTranslate also failed:', libreError.message);
      }
    }

    // Final fallback - return original text with a note
    res.json({
      translation: text,
      sourceLang,
      targetLang,
      provider: 'fallback',
      note: 'Translation service unavailable - showing original text'
    });

  } catch (error) {
    console.error('Translation error:', error);
    res.status(500).json({ 
      error: 'Translation failed. Please try again.' 
    });
  }
});

// Audio transcription endpoint using AssemblyAI (additional feature)
app.post('/api/transcribe', async (req, res) => {
  try {
    const { audioUrl } = req.body;

    // Validate input
    if (!audioUrl) {
      return res.status(400).json({ 
        error: 'Missing required field: audioUrl' 
      });
    }

    const params = {
      audio: audioUrl,
      speech_model: "universal",
    };

    const transcript = await client.transcripts.transcribe(params);

    res.json({
      text: transcript.text,
      audioUrl,
      provider: 'assemblyai'
    });

  } catch (error) {
    console.error('Transcription error:', error);
    res.status(500).json({ 
      error: 'Transcription failed. Please try again.' 
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Translation server is running' });
});

app.listen(PORT, () => {
  console.log(`🚀 Translation server running on http://localhost:${PORT}`);
  console.log(`🆓 Using MyMemory API (completely free & accurate) - no API key required!`);
  console.log(`🎤 AssemblyAI transcription also available at /api/transcribe`);
});
