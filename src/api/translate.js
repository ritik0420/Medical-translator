// Translation API endpoint for the healthcare app using LibreTranslate
export const translateText = async (text, sourceLang, targetLang) => {
  try {
    console.log('Translating:', { text, sourceLang, targetLang });
    
    const response = await fetch('http://localhost:3001/api/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        sourceLang,
        targetLang
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Translation failed: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Translation successful:', data);
    return data.translation;
  } catch (error) {
    console.error('Translation error:', error);
    
    // Enhanced fallback with medical context
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
    
    const targetLangName = languageNames[targetLang] || targetLang;
    
    // Provide a more helpful fallback message
    if (error.message.includes('API key')) {
      throw new Error('Translation API key not configured. Please set up your API key.');
    } else if (error.message.includes('quota')) {
      throw new Error('Translation API quota exceeded. Please check your billing.');
    } else {
      throw new Error(`Translation failed: ${error.message}`);
    }
  }
};

// Additional transcription API endpoint using AssemblyAI
export const transcribeAudio = async (audioUrl) => {
  try {
    console.log('Transcribing audio:', { audioUrl });
    
    const response = await fetch('http://localhost:3001/api/transcribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        audioUrl
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Transcription failed: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Transcription successful:', data);
    return data.text;
  } catch (error) {
    console.error('Transcription error:', error);
    
    // Provide a more helpful fallback message
    if (error.message.includes('API key')) {
      throw new Error('AssemblyAI API key not configured. Please set up your API key.');
    } else if (error.message.includes('quota')) {
      throw new Error('AssemblyAI API quota exceeded. Please check your billing.');
    } else {
      throw new Error(`Transcription failed: ${error.message}`);
    }
  }
};

// Medical terminology enhancement
export const enhanceMedicalTerms = (text) => {
  // Common medical terms that might need special handling
  const medicalTerms = {
    'pain': 'pain/discomfort',
    'fever': 'elevated body temperature',
    'nausea': 'feeling of sickness',
    'dizziness': 'feeling lightheaded',
    'shortness of breath': 'difficulty breathing',
    'chest pain': 'chest discomfort',
    'headache': 'head pain',
    'stomach ache': 'abdominal discomfort'
  };

  let enhancedText = text;
  Object.entries(medicalTerms).forEach(([term, enhancement]) => {
    const regex = new RegExp(`\\b${term}\\b`, 'gi');
    enhancedText = enhancedText.replace(regex, enhancement);
  });

  return enhancedText;
};
