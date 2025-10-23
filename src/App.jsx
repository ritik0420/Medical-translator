import { useState, useEffect, useRef, useCallback } from 'react';
import { Mic, MicOff, Volume2, VolumeX, Languages, Shield, AlertCircle } from 'lucide-react';
import { translateText } from './api/translate';

// Supported languages for the healthcare translation app
const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
  { code: 'de', name: 'German', flag: '🇩🇪' },
  { code: 'it', name: 'Italian', flag: '🇮🇹' },
  { code: 'pt', name: 'Portuguese', flag: '🇵🇹' },
  { code: 'ru', name: 'Russian', flag: '🇷🇺' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', flag: '🇰🇷' },
  { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
  { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳' }
];

function App() {
  // State management
  const [isRecording, setIsRecording] = useState(false);
  const [originalText, setOriginalText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [cleanTranslatedText, setCleanTranslatedText] = useState('');
  const [sourceLanguage, setSourceLanguage] = useState('en');
  const [targetLanguage, setTargetLanguage] = useState('es');
  const [isTranslating, setIsTranslating] = useState(false);
  const [error, setError] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  // Refs for speech recognition and synthesis
  const recognitionRef = useRef(null);
  const synthesisRef = useRef(null);

  // Initialize speech recognition
  useEffect(() => {
    console.log('Initializing speech recognition...');
    
    // Check if we're on HTTPS or localhost
    const isSecure = window.location.protocol === 'https:' || window.location.hostname === 'localhost';
    console.log('Is secure:', isSecure, 'Protocol:', window.location.protocol, 'Hostname:', window.location.hostname);
    
    if (!isSecure) {
      setError('Speech recognition requires HTTPS. Please use https://localhost:5173');
      return;
    }

    // Check for speech recognition support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    console.log('Speech recognition available:', !!SpeechRecognition);
    
    if (SpeechRecognition) {
      try {
        recognitionRef.current = new SpeechRecognition();
        console.log('Speech recognition object created:', !!recognitionRef.current);
        
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = sourceLanguage;

        recognitionRef.current.onresult = (event) => {
          let interimTranscript = '';
          let finalTranscript = '';

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += transcript;
            } else {
              interimTranscript += transcript;
            }
          }

          const currentText = finalTranscript || interimTranscript;
          setOriginalText(currentText);
          
          // Auto-translate when we have final results
          if (finalTranscript && finalTranscript.trim()) {
            handleTranslation(finalTranscript);
          }
        };

        recognitionRef.current.onerror = (event) => {
          console.error('Speech recognition error:', event.error);
          if (event.error === 'not-allowed') {
            setError('Microphone access denied. Please allow microphone permissions and refresh the page.');
          } else if (event.error === 'no-speech') {
            setError('No speech detected. Please try speaking again.');
          } else {
            setError(`Speech recognition error: ${event.error}`);
          }
          setIsRecording(false);
        };

        recognitionRef.current.onend = () => {
          setIsRecording(false);
        };

        recognitionRef.current.onstart = () => {
          setError('');
        };
        
        console.log('Speech recognition initialized successfully');
      } catch (error) {
        console.error('Failed to initialize speech recognition:', error);
        setError('Failed to initialize speech recognition. Please refresh the page.');
      }
    } else {
      console.log('Speech recognition not supported');
      setError('Speech recognition not supported in this browser. Please use Chrome or Edge.');
    }

    // Initialize speech synthesis
    if ('speechSynthesis' in window) {
      synthesisRef.current = window.speechSynthesis;
      console.log('Speech synthesis initialized');
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [sourceLanguage]);

  // Translation function using OpenAI API
  const handleTranslation = useCallback(async (text) => {
    if (!text.trim()) return;
    
    console.log('handleTranslation called with:', { text, sourceLanguage, targetLanguage });
    
    setIsTranslating(true);
    setError('');
    
    // Stop any ongoing speech when starting new translation
    if (synthesisRef.current) {
      synthesisRef.current.cancel();
      setIsSpeaking(false);
    }
    
    try {
      // Call the real OpenAI translation API
      const translation = await translateText(text, sourceLanguage, targetLanguage);
      
      // Set the translated text
      setTranslatedText(translation);
      setCleanTranslatedText(translation);
      
      // Automatically speak the translated text after a short delay
      setTimeout(() => {
        if (translation.trim()) {
          speakTranslatedText();
        }
      }, 500);
    } catch (err) {
      console.error('Translation error:', err);
      setError(err.message);
      
      // Fallback to a simple mock translation for demo purposes
      const targetLangName = SUPPORTED_LANGUAGES.find(l => l.code === targetLanguage)?.name || targetLanguage;
      const fallbackTranslation = `[Demo Mode - ${targetLangName}]: ${text}`;
      setTranslatedText(fallbackTranslation);
      setCleanTranslatedText(text);
      
      // Automatically speak the fallback translation
      setTimeout(() => {
        if (text.trim()) {
          speakTranslatedText();
        }
      }, 500);
    } finally {
      setIsTranslating(false);
    }
  }, [sourceLanguage, targetLanguage]);

  // Retranslate when target language changes (only if we have text)
  useEffect(() => {
    console.log('Target language changed to:', targetLanguage);
    console.log('Original text:', originalText);
    console.log('Is translating:', isTranslating);
    console.log('Current translated text:', translatedText);
    
    // Only retranslate if we have original text and we're not currently translating
    if (originalText.trim() && !isTranslating) {
      console.log('Retranslating to:', targetLanguage);
      // Use a timeout to prevent infinite loops
      const timeoutId = setTimeout(() => {
        handleTranslation(originalText);
      }, 100);
      
      return () => clearTimeout(timeoutId);
    }
  }, [targetLanguage]);

  // Medical terminology enhancement
  const enhanceMedicalTerms = (text) => {
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

  // Start/stop recording
  const toggleRecording = () => {
    if (!recognitionRef.current) {
      setError('Speech recognition not available. Please use Chrome or Edge browser.');
      return;
    }

    if (isRecording) {
      try {
        recognitionRef.current.stop();
        setIsRecording(false);
      } catch (error) {
        console.error('Failed to stop recognition:', error);
        setIsRecording(false);
      }
    } else {
      // Check if recognition is already running before starting
      if (recognitionRef.current.state === 'started' || recognitionRef.current.state === 'starting') {
        setError('Recognition is already running. Please wait or refresh the page.');
        return;
      }
      
      setError('');
      setOriginalText('');
      setTranslatedText('');
      setCleanTranslatedText('');
      
      try {
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (error) {
        console.error('Failed to start recognition:', error);
        if (error.name === 'InvalidStateError') {
          setError('Recognition is already running. Please stop and try again.');
        } else {
          setError('Failed to start recording. Please check microphone permissions.');
        }
        setIsRecording(false);
      }
    }
  };

  // Speak translated text
  const speakTranslatedText = () => {
    if (!synthesisRef.current || !cleanTranslatedText.trim()) return;

    // Stop any ongoing speech and clear any previous errors
    synthesisRef.current.cancel();
    setError('');
    
    const utterance = new SpeechSynthesisUtterance(cleanTranslatedText);
    utterance.lang = targetLanguage;
    utterance.rate = 0.8;
    utterance.pitch = 1;
    utterance.volume = 0.8;

    utterance.onstart = () => {
      setIsSpeaking(true);
      setError(''); // Clear any previous errors when starting
    };
    
    utterance.onend = () => {
      setIsSpeaking(false);
    };
    
    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event.error);
      setIsSpeaking(false);
      // Only set error for critical failures, not user interruptions
      if (event.error !== 'interrupted') {
        setError(`Text-to-speech failed: ${event.error}`);
      }
    };

    try {
      synthesisRef.current.speak(utterance);
    } catch (error) {
      console.error('Failed to start speech synthesis:', error);
      setIsSpeaking(false);
      setError('Text-to-speech initialization failed');
    }
  };

  // Stop speaking
  const stopSpeaking = () => {
    if (synthesisRef.current) {
      synthesisRef.current.cancel();
      setIsSpeaking(false);
      // Don't set error when user manually stops speaking
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-medical-50 to-primary-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-medical-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">🏥</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">MediTranslate</h1>
                <p className="text-sm text-gray-600">Healthcare Translation Assistant</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Shield className="w-4 h-4" />
              <span>Local-only recording</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Language Selectors */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center space-x-2 mb-4">
            <Languages className="w-5 h-5 text-medical-500" />
            <h2 className="text-lg font-semibold text-gray-900">Language Settings</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Source Language
              </label>
              <select
                value={sourceLanguage}
                onChange={(e) => setSourceLanguage(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-500 focus:border-transparent"
                disabled={isRecording}
              >
                {SUPPORTED_LANGUAGES.map(lang => (
                  <option key={lang.code} value={lang.code}>
                    {lang.flag} {lang.name}
                  </option>
                ))}
              </select>
            </div>
            
      <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Target Language
              </label>
              <select
                value={targetLanguage}
                onChange={(e) => setTargetLanguage(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-500 focus:border-transparent"
                disabled={isRecording}
              >
                {SUPPORTED_LANGUAGES.map(lang => (
                  <option key={lang.code} value={lang.code}>
                    {lang.flag} {lang.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Recording Controls */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col items-center space-y-4">
            <button
              onClick={toggleRecording}
              disabled={!recognitionRef.current || !!error}
              className={`w-20 h-20 rounded-full flex items-center justify-center text-white font-semibold transition-all duration-200 ${
                isRecording
                  ? 'bg-red-500 hover:bg-red-600 recording-pulse'
                  : 'bg-medical-500 hover:bg-medical-600'
              } ${!recognitionRef.current || !!error ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isRecording ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
            </button>
            
            <div className="text-center">
              <p className="text-lg font-medium text-gray-900">
                {isRecording ? 'Recording... Click to stop' : 'Click to start recording'}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Speak clearly in {SUPPORTED_LANGUAGES.find(l => l.code === sourceLanguage)?.name || sourceLanguage}
              </p>
              {!recognitionRef.current && (
                <p className="text-xs text-red-500 mt-2">
                  Speech recognition not initialized. Check console for details.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Transcripts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Original Text */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-3 h-3 bg-medical-500 rounded-full"></div>
              <h3 className="text-lg font-semibold text-gray-900">
                {SUPPORTED_LANGUAGES.find(l => l.code === sourceLanguage)?.name || sourceLanguage}
              </h3>
            </div>
            <div className="min-h-[200px] p-4 bg-gray-50 rounded-lg border border-gray-200">
              {originalText ? (
                <p className="text-gray-900 leading-relaxed">{originalText}</p>
              ) : (
                <p className="text-gray-500 italic">Start speaking to see the transcript here...</p>
              )}
            </div>
          </div>

          {/* Translated Text */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-primary-500 rounded-full"></div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {SUPPORTED_LANGUAGES.find(l => l.code === targetLanguage)?.name || targetLanguage}
                </h3>
                {isTranslating && (
                  <div className="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                )}
      </div>
              
              <div className="flex items-center space-x-3">
                <button
                  onClick={isSpeaking ? stopSpeaking : speakTranslatedText}
                  disabled={!cleanTranslatedText.trim()}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    isSpeaking
                      ? 'bg-red-500 text-white hover:bg-red-600'
                      : 'bg-primary-500 text-white hover:bg-primary-600'
                  } ${!cleanTranslatedText.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  <span className="text-sm font-medium">
                    {isSpeaking ? 'Stop Speaking' : 'Listen to Translation'}
                  </span>
                </button>
              </div>
            </div>
            
            <div className="min-h-[200px] p-4 bg-gray-50 rounded-lg border border-gray-200">
              {isTranslating ? (
                <div className="flex flex-col items-center justify-center h-full space-y-4">
                  <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-primary-600 font-medium">Translating...</p>
                  <p className="text-sm text-gray-500">Please wait while we process your speech</p>
                </div>
              ) : translatedText ? (
                <p className="text-gray-900 leading-relaxed">{translatedText}</p>
              ) : (
                <p className="text-gray-500 italic">Translation will appear here...</p>
              )}
            </div>
          </div>
        </div>

        {/* Privacy Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Shield className="w-5 h-5 text-blue-500 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900">Privacy & Security</h4>
              <p className="text-sm text-blue-800 mt-1">
                Your voice recordings are processed locally in your browser. No medical information is stored or transmitted to external servers. 
                Translation services may process text for language conversion purposes only.
        </p>
      </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="text-center text-gray-600">
            <p className="text-sm">
              MediTranslate - Healthcare Translation Assistant | 
              <span className="text-medical-500 font-medium"> Built for medical professionals</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;