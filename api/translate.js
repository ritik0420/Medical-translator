import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { text, sourceLang, targetLang } = req.body;

    // Validate input
    if (!text || !sourceLang || !targetLang) {
      return res.status(400).json({ 
        error: 'Missing required fields: text, sourceLang, targetLang' 
      });
    }

    // Get language names for better context
    const languageNames = {
      'en': 'English',
      'es': 'Spanish', 
      'fr': 'French',
      'de': 'German',
      'it': 'Italian',
      'pt': 'Portuguese',
      'ru': 'Russian',
      'ja': 'Japanese',
      'ko': 'Korean',
      'zh': 'Chinese',
      'ar': 'Arabic',
      'hi': 'Hindi'
    };

    const sourceLangName = languageNames[sourceLang] || sourceLang;
    const targetLangName = languageNames[targetLang] || targetLang;

    // Create medical-focused translation prompt
    const systemPrompt = `You are a professional medical translator specializing in healthcare communication. 
    Translate the following text from ${sourceLangName} to ${targetLangName} with special attention to:
    - Medical terminology accuracy
    - Cultural sensitivity in healthcare contexts
    - Clear, professional medical communication
    - Preserving the original meaning while ensuring medical accuracy
    
    Provide only the translation without any additional commentary or explanations.`;

    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // You can use "gpt-3.5-turbo" for lower costs
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: text }
      ],
      max_tokens: 1000,
      temperature: 0.3 // Lower temperature for more consistent medical translations
    });

    const translatedText = response.choices[0].message.content;

    return res.status(200).json({
      translation: translatedText,
      sourceLang,
      targetLang,
      model: "gpt-4o"
    });

  } catch (error) {
    console.error('OpenAI API error:', error);
    
    // Handle specific OpenAI errors
    if (error.code === 'insufficient_quota') {
      return res.status(402).json({ 
        error: 'OpenAI API quota exceeded. Please check your billing.' 
      });
    }
    
    if (error.code === 'invalid_api_key') {
      return res.status(401).json({ 
        error: 'Invalid OpenAI API key. Please check your configuration.' 
      });
    }

    return res.status(500).json({ 
      error: 'Translation failed. Please try again.' 
    });
  }
}