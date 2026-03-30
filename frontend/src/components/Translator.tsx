import React, { useState, useEffect, useRef } from 'react';
import { translateText } from '../services/translationService';
import { createWorker } from 'tesseract.js';

const languages = [
  { code: 'English', name: 'English', flag: '🇬🇧' },
  { code: 'Uzbek', name: "O'zbek", flag: '🇺🇿' },
  { code: 'Russian', name: 'Русский', flag: '🇷🇺' },
  { code: 'Spanish', name: 'Español', flag: '🇪🇸' },
  { code: 'French', name: 'Français', flag: '🇫🇷' },
  { code: 'German', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'Chinese', name: '中文', flag: '🇨🇳' },
  { code: 'Arabic', name: 'العربية', flag: '🇸🇦' },
  { code: 'Turkish', name: 'Türkçe', flag: '🇹🇷' },
  { code: 'Korean', name: '한국어', flag: '🇰🇷' },
  { code: 'Japanese', name: '日本語', flag: '🇯🇵' },
  { code: 'Italian', name: 'Italiano', flag: '🇮🇹' },
];

const Translator: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [sourceLang, setSourceLang] = useState('English');
  const [targetLang, setTargetLang] = useState('Uzbek');
  const [translatedText, setTranslatedText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [ocrProgress, setOcrProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Preload voices for mobile compatibility
  useEffect(() => {
    if ('speechSynthesis' in window) {
      // Load voices immediately
      let voices = window.speechSynthesis.getVoices();
      
      // If voices not loaded yet, wait for them
      if (voices.length === 0) {
        window.speechSynthesis.onvoiceschanged = () => {
          voices = window.speechSynthesis.getVoices();
          console.log('Voices loaded:', voices.length);
        };
      }
      
      // Trigger voice loading on iOS
      const utterance = new SpeechSynthesisUtterance('');
      window.speechSynthesis.speak(utterance);
      window.speechSynthesis.cancel();
    }
  }, []);

  // OCR - Extract text from image
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith('image/')) {
      setError('Iltimos, rasm fayl yuklang (JPG, PNG, etc.)');
      return;
    }

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('Rasm hajmi 10MB dan kichik bo\'lishi kerak');
      return;
    }

    setIsProcessingImage(true);
    setError('');
    setOcrProgress(0);

    try {
      // Create Tesseract worker
      const worker = await createWorker('eng', 1, {
        logger: (m: any) => {
          if (m.status === 'recognizing text') {
            setOcrProgress(Math.round(m.progress * 100));
          }
        },
      });

      // Recognize text from image
      const { data: { text } } = await worker.recognize(file);
      
      await worker.terminate();

      if (text.trim()) {
        setInputText(text.trim());
        setOcrProgress(100);
      } else {
        setError('Rasmdan matn topilmadi. Boshqa rasm yuklang.');
      }
    } catch (err) {
      console.error('OCR error:', err);
      setError('Rasmdan matn o\'qishda xatolik. Qaytadan urinib ko\'ring.');
    } finally {
      setIsProcessingImage(false);
      setOcrProgress(0);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Trigger file input click
  const handleImageButtonClick = () => {
    fileInputRef.current?.click();
  };

  // Auto-format text: capitalize first letter and after punctuation, add space after punctuation
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    let text = e.target.value;
    
    // Add space after punctuation marks if not already present
    text = text.replace(/([.,!?;:])([^\s])/g, '$1 $2');
    
    // Capitalize first letter of the text
    if (text.length > 0) {
      text = text.charAt(0).toUpperCase() + text.slice(1);
    }
    
    // Capitalize letter after sentence-ending punctuation (. ! ?)
    text = text.replace(/([.!?]\s+)([a-z])/g, (_match, punctuation, letter) => {
      return punctuation + letter.toUpperCase();
    });
    
    setInputText(text);
  };

  const handleTranslate = async () => {
    if (!inputText.trim()) {
      setError('Please enter text to translate');
      return;
    }

    setLoading(true);
    setError('');
    setTranslatedText('');

    const result = await translateText(inputText, targetLang, sourceLang);

    setLoading(false);

    if (result.success && result.data) {
      setTranslatedText(result.data.translatedText);
    } else {
      setError(result.error || 'Translation failed');
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(translatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Text-to-Speech function - Mobile optimized
  const handleSpeak = () => {
    if (!('speechSynthesis' in window)) {
      setError('Ovoz o\'qish brauzeringizda qo\'llab-quvvatlanmaydi');
      return;
    }

    // Stop if already speaking
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    // Cancel any ongoing speech first (important for mobile)
    window.speechSynthesis.cancel();

    // Small delay to ensure cancellation is complete (critical for iOS)
    setTimeout(() => {
      const utterance = new SpeechSynthesisUtterance(translatedText);
      
      // Set language based on target language
      const languageCodes: { [key: string]: string } = {
        'English': 'en-US',
        'Uzbek': 'uz-UZ',
        'Russian': 'ru-RU',
        'Spanish': 'es-ES',
        'French': 'fr-FR',
        'German': 'de-DE',
        'Chinese': 'zh-CN',
        'Arabic': 'ar-SA',
        'Turkish': 'tr-TR',
        'Korean': 'ko-KR',
        'Japanese': 'ja-JP',
        'Italian': 'it-IT',
      };
      
      utterance.lang = languageCodes[targetLang] || 'en-US';
      utterance.rate = 0.9; // Slightly faster for mobile
      utterance.pitch = 1.0; // Normal pitch for better mobile compatibility
      utterance.volume = 1;

      // Get available voices
      const voices = window.speechSynthesis.getVoices();
      const targetLangCode = utterance.lang.split('-')[0];
      
      // Find best voice for the language
      let bestVoice = voices.find(voice => 
        voice.lang.startsWith(targetLangCode) && 
        voice.name.toLowerCase().includes('google')
      );
      
      if (!bestVoice) {
        bestVoice = voices.find(voice => 
          voice.lang.startsWith(targetLangCode) && 
          voice.name.toLowerCase().includes('natural')
        );
      }
      
      if (!bestVoice) {
        bestVoice = voices.find(voice => 
          voice.lang.startsWith(targetLangCode) && 
          !voice.localService
        );
      }
      
      if (!bestVoice) {
        bestVoice = voices.find(voice => voice.lang.startsWith(targetLangCode));
      }
      
      if (bestVoice) {
        utterance.voice = bestVoice;
      }

      utterance.onstart = () => {
        setIsSpeaking(true);
        setError('');
      };
      
      utterance.onend = () => {
        setIsSpeaking(false);
      };
      
      utterance.onerror = (event) => {
        console.error('Speech error:', event);
        setIsSpeaking(false);
        setError('Ovoz o\'qishda xatolik yuz berdi. Qaytadan urinib ko\'ring.');
      };

      // Speak immediately (must be in direct response to user action for mobile)
      window.speechSynthesis.speak(utterance);
      
      // iOS Safari fix: Resume if paused
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }
    }, 100);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleTranslate();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#000000] via-[#0a0f1e] to-[#0d1424] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-700/5 rounded-full blur-3xl"></div>
      </div>

      {/* Floating Language Characters */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
        {/* Row 1 */}
        <div className="absolute top-[5%] left-[3%] text-6xl text-blue-400 font-bold animate-float" style={{ animationDelay: '0s' }}>A</div>
        <div className="absolute top-[8%] left-[12%] text-5xl text-blue-300 font-bold animate-float" style={{ animationDelay: '0.3s' }}>中</div>
        <div className="absolute top-[6%] left-[22%] text-4xl text-blue-500 font-bold animate-float" style={{ animationDelay: '0.6s' }}>Ж</div>
        <div className="absolute top-[10%] left-[32%] text-7xl text-blue-400 font-bold animate-float" style={{ animationDelay: '0.9s' }}>ع</div>
        <div className="absolute top-[7%] left-[42%] text-5xl text-blue-300 font-bold animate-float" style={{ animationDelay: '1.2s' }}>Ö</div>
        <div className="absolute top-[9%] left-[52%] text-6xl text-blue-500 font-bold animate-float" style={{ animationDelay: '1.5s' }}>한</div>
        <div className="absolute top-[5%] left-[62%] text-4xl text-blue-400 font-bold animate-float" style={{ animationDelay: '1.8s' }}>É</div>
        <div className="absolute top-[8%] left-[72%] text-5xl text-blue-300 font-bold animate-float" style={{ animationDelay: '2.1s' }}>日</div>
        <div className="absolute top-[6%] left-[82%] text-6xl text-blue-500 font-bold animate-float" style={{ animationDelay: '2.4s' }}>Ñ</div>
        <div className="absolute top-[10%] left-[92%] text-4xl text-blue-400 font-bold animate-float" style={{ animationDelay: '2.7s' }}>Ü</div>
        
        {/* Row 2 */}
        <div className="absolute top-[18%] left-[5%] text-5xl text-blue-300 font-bold animate-float" style={{ animationDelay: '3s' }}>Ş</div>
        <div className="absolute top-[20%] left-[15%] text-7xl text-blue-500 font-bold animate-float" style={{ animationDelay: '3.3s' }}>Ğ</div>
        <div className="absolute top-[17%] left-[25%] text-4xl text-blue-400 font-bold animate-float" style={{ animationDelay: '3.6s' }}>Ç</div>
        <div className="absolute top-[22%] left-[35%] text-6xl text-blue-300 font-bold animate-float" style={{ animationDelay: '3.9s' }}>İ</div>
        <div className="absolute top-[19%] left-[45%] text-5xl text-blue-500 font-bold animate-float" style={{ animationDelay: '4.2s' }}>Ё</div>
        <div className="absolute top-[21%] left-[55%] text-4xl text-blue-400 font-bold animate-float" style={{ animationDelay: '4.5s' }}>Б</div>
        <div className="absolute top-[18%] left-[65%] text-6xl text-blue-300 font-bold animate-float" style={{ animationDelay: '4.8s' }}>文</div>
        <div className="absolute top-[20%] left-[75%] text-5xl text-blue-500 font-bold animate-float" style={{ animationDelay: '5.1s' }}>Д</div>
        <div className="absolute top-[17%] left-[85%] text-7xl text-blue-400 font-bold animate-float" style={{ animationDelay: '5.4s' }}>Â</div>
        <div className="absolute top-[22%] left-[95%] text-4xl text-blue-300 font-bold animate-float" style={{ animationDelay: '5.7s' }}>語</div>
        
        {/* Row 3 */}
        <div className="absolute top-[32%] left-[2%] text-6xl text-blue-500 font-bold animate-float" style={{ animationDelay: '6s' }}>Ø</div>
        <div className="absolute top-[35%] left-[13%] text-5xl text-blue-400 font-bold animate-float" style={{ animationDelay: '6.3s' }}>Å</div>
        <div className="absolute top-[30%] left-[23%] text-4xl text-blue-300 font-bold animate-float" style={{ animationDelay: '6.6s' }}>Æ</div>
        <div className="absolute top-[33%] left-[33%] text-7xl text-blue-500 font-bold animate-float" style={{ animationDelay: '6.9s' }}>Þ</div>
        <div className="absolute top-[31%] left-[43%] text-6xl text-blue-400 font-bold animate-float" style={{ animationDelay: '7.2s' }}>Ð</div>
        <div className="absolute top-[34%] left-[53%] text-5xl text-blue-300 font-bold animate-float" style={{ animationDelay: '7.5s' }}>Ł</div>
        <div className="absolute top-[32%] left-[63%] text-4xl text-blue-500 font-bold animate-float" style={{ animationDelay: '7.8s' }}>Ź</div>
        <div className="absolute top-[35%] left-[73%] text-6xl text-blue-400 font-bold animate-float" style={{ animationDelay: '8.1s' }}>Ż</div>
        <div className="absolute top-[30%] left-[83%] text-5xl text-blue-300 font-bold animate-float" style={{ animationDelay: '8.4s' }}>Ą</div>
        <div className="absolute top-[33%] left-[93%] text-7xl text-blue-500 font-bold animate-float" style={{ animationDelay: '8.7s' }}>Ę</div>
        
        {/* Row 4 */}
        <div className="absolute top-[48%] left-[7%] text-4xl text-blue-400 font-bold animate-float" style={{ animationDelay: '9s' }}>Ć</div>
        <div className="absolute top-[45%] left-[17%] text-6xl text-blue-300 font-bold animate-float" style={{ animationDelay: '9.3s' }}>Ń</div>
        <div className="absolute top-[50%] left-[27%] text-5xl text-blue-500 font-bold animate-float" style={{ animationDelay: '9.6s' }}>Ś</div>
        <div className="absolute top-[47%] left-[37%] text-4xl text-blue-400 font-bold animate-float" style={{ animationDelay: '9.9s' }}>Ř</div>
        <div className="absolute top-[49%] left-[47%] text-7xl text-blue-300 font-bold animate-float" style={{ animationDelay: '10.2s' }}>Č</div>
        <div className="absolute top-[46%] left-[57%] text-6xl text-blue-500 font-bold animate-float" style={{ animationDelay: '10.5s' }}>Ď</div>
        <div className="absolute top-[48%] left-[67%] text-5xl text-blue-400 font-bold animate-float" style={{ animationDelay: '10.8s' }}>Ť</div>
        <div className="absolute top-[50%] left-[77%] text-4xl text-blue-300 font-bold animate-float" style={{ animationDelay: '11.1s' }}>Ň</div>
        <div className="absolute top-[45%] left-[87%] text-6xl text-blue-500 font-bold animate-float" style={{ animationDelay: '11.4s' }}>Ů</div>
        <div className="absolute top-[47%] left-[97%] text-5xl text-blue-400 font-bold animate-float" style={{ animationDelay: '11.7s' }}>Ý</div>
        
        {/* Row 5 */}
        <div className="absolute top-[62%] left-[4%] text-7xl text-blue-300 font-bold animate-float" style={{ animationDelay: '12s' }}>Α</div>
        <div className="absolute top-[65%] left-[14%] text-4xl text-blue-500 font-bold animate-float" style={{ animationDelay: '12.3s' }}>Β</div>
        <div className="absolute top-[60%] left-[24%] text-6xl text-blue-400 font-bold animate-float" style={{ animationDelay: '12.6s' }}>Γ</div>
        <div className="absolute top-[63%] left-[34%] text-5xl text-blue-300 font-bold animate-float" style={{ animationDelay: '12.9s' }}>Δ</div>
        <div className="absolute top-[61%] left-[44%] text-4xl text-blue-500 font-bold animate-float" style={{ animationDelay: '13.2s' }}>Ω</div>
        <div className="absolute top-[64%] left-[54%] text-7xl text-blue-400 font-bold animate-float" style={{ animationDelay: '13.5s' }}>Σ</div>
        <div className="absolute top-[62%] left-[64%] text-6xl text-blue-300 font-bold animate-float" style={{ animationDelay: '13.8s' }}>Π</div>
        <div className="absolute top-[65%] left-[74%] text-5xl text-blue-500 font-bold animate-float" style={{ animationDelay: '14.1s' }}>Φ</div>
        <div className="absolute top-[60%] left-[84%] text-4xl text-blue-400 font-bold animate-float" style={{ animationDelay: '14.4s' }}>Ψ</div>
        <div className="absolute top-[63%] left-[94%] text-6xl text-blue-300 font-bold animate-float" style={{ animationDelay: '14.7s' }}>Θ</div>
      </div>

      <div className="w-full max-w-5xl relative z-10 animate-fade-in">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center mb-4">
            <div className="p-3 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl shadow-lg shadow-blue-600/50">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
              </svg>
            </div>
          </div>
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 bg-clip-text text-transparent drop-shadow-2xl leading-tight">
            AI Tarjimon
          </h1>
        </div>

        {/* Main Card */}
        <div className="bg-[#0a0f1e]/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-blue-900/30 overflow-hidden">
          <div className="p-8 md:p-10">
            {/* Input Section */}
            <div className="mb-8">
              <label className="flex items-center gap-2 text-gray-300 text-sm font-semibold mb-3">
                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Manba Matn
              </label>
              <div className="relative">
                <textarea
                  value={inputText}
                  onChange={handleTextChange}
                  onKeyPress={handleKeyPress}
                  placeholder="Matnni kiriting yoki joylashtiring..."
                  className="w-full h-44 px-5 py-4 bg-[#0d1424]/80 text-white rounded-2xl border border-blue-900/40 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/30 focus:outline-none resize-none transition-all placeholder:text-gray-600 text-base leading-relaxed break-words"
                />
                <div className="absolute bottom-3 right-3 flex items-center gap-2">
                  <span className="text-gray-500 text-xs font-medium px-2 py-1 bg-black/40 rounded-lg border border-blue-900/30">
                    {inputText.length} belgi
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between mt-2 flex-wrap gap-2">
                <div className="text-gray-500 text-xs flex items-center gap-1 flex-wrap">
                  <kbd className="px-2 py-0.5 bg-black/40 border border-blue-900/30 rounded text-gray-400 font-mono text-xs">Ctrl</kbd>
                  <span>+</span>
                  <kbd className="px-2 py-0.5 bg-black/40 border border-blue-900/30 rounded text-gray-400 font-mono text-xs">Enter</kbd>
                  <span>tarjima qilish uchun</span>
                </div>
                
                {/* Image Upload Button */}
                <button
                  onClick={handleImageButtonClick}
                  disabled={isProcessingImage}
                  className="flex items-center gap-2 px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 rounded-lg transition-all text-xs border border-blue-600/40 hover:border-blue-500 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Rasmdan matn o'qish"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>{isProcessingImage ? 'O\'qilmoqda...' : 'Rasm yuklash'}</span>
                </button>
                
                {/* Hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
              
              {/* OCR Progress */}
              {isProcessingImage && (
                <div className="mt-3 p-3 bg-blue-600/10 border border-blue-600/30 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-blue-400 text-xs font-medium">Rasmdan matn o'qilmoqda...</span>
                    <span className="text-blue-400 text-xs font-bold">{ocrProgress}%</span>
                  </div>
                  <div className="w-full bg-blue-900/30 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-full transition-all duration-300 rounded-full"
                      style={{ width: `${ocrProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>

            {/* Language Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {/* Source Language */}
              <div>
                <label className="flex items-center gap-2 text-gray-300 text-sm font-semibold mb-3">
                  <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                  </svg>
                  Qaysi tildan
                </label>
                <div className="relative">
                  <select
                    value={sourceLang}
                    onChange={(e) => setSourceLang(e.target.value)}
                    className="w-full px-5 py-3.5 bg-[#0d1424]/80 text-white rounded-xl border border-blue-900/40 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/30 focus:outline-none cursor-pointer transition-all appearance-none text-base font-medium"
                  >
                    {languages.map((lang) => (
                      <option key={lang.code} value={lang.code} className="bg-[#0d1424]">
                        {lang.flag} {lang.name}
                      </option>
                    ))}
                  </select>
                  <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {/* Target Language */}
              <div>
                <label className="flex items-center gap-2 text-gray-300 text-sm font-semibold mb-3">
                  <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                  </svg>
                  Qaysi tilga
                </label>
                <div className="relative">
                  <select
                    value={targetLang}
                    onChange={(e) => setTargetLang(e.target.value)}
                    className="w-full px-5 py-3.5 bg-[#0d1424]/80 text-white rounded-xl border border-blue-900/40 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/30 focus:outline-none cursor-pointer transition-all appearance-none text-base font-medium"
                  >
                    {languages.map((lang) => (
                      <option key={lang.code} value={lang.code} className="bg-[#0d1424]">
                        {lang.flag} {lang.name}
                      </option>
                    ))}
                  </select>
                  <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Translate Button */}
            <button
              onClick={handleTranslate}
              disabled={loading || !inputText.trim()}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-semibold py-3.5 px-6 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-600/30 hover:shadow-xl hover:shadow-blue-600/40 flex items-center justify-center gap-2.5 text-base group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-white relative z-10"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span className="relative z-10">Tarjima qilmoqda...</span>
                </>
              ) : (
                <>
                  <svg
                    className="w-5 h-5 relative z-10 group-hover:scale-110 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                  <span className="relative z-10">Tarjima Qilish</span>
                </>
              )}
            </button>

            {/* Error Message */}
            {error && (
              <div className="mt-6 p-5 bg-red-500/10 border border-red-500/30 rounded-2xl backdrop-blur-sm animate-slide-up">
                <div className="text-red-400 text-sm flex items-center gap-3 font-medium">
                  <div className="flex-shrink-0 w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-red-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span>{error}</span>
                </div>
              </div>
            )}

            {/* Result Section */}
            {translatedText && (
              <div className="mt-8 animate-slide-up">
                <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
                  <label className="flex items-center gap-2 text-gray-300 text-sm font-semibold">
                    <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Tarjima Natijasi
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleSpeak}
                      className="flex items-center gap-2 px-3.5 py-2 bg-[#0d1424]/80 hover:bg-blue-600 text-gray-300 hover:text-white rounded-lg transition-all text-sm border border-blue-900/40 hover:border-blue-500 font-medium group whitespace-nowrap"
                      title={isSpeaking ? "To'xtatish" : "Tinglash"}
                    >
                      {isSpeaking ? (
                        <>
                          <svg className="w-4 h-4 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          <span className="hidden sm:inline">To'xtatish</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                          </svg>
                          <span className="hidden sm:inline">Tinglash</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={handleCopy}
                      className="flex items-center gap-2 px-3.5 py-2 bg-[#0d1424]/80 hover:bg-blue-600 text-gray-300 hover:text-white rounded-lg transition-all text-sm border border-blue-900/40 hover:border-blue-500 font-medium group whitespace-nowrap"
                      title="Nusxa olish"
                    >
                    {copied ? (
                      <>
                        <svg
                          className="w-4 h-4 text-green-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="text-green-400 font-semibold">Nusxa olindi!</span>
                      </>
                    ) : (
                      <>
                        <svg
                          className="w-4 h-4 group-hover:scale-110 transition-transform"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                          />
                        </svg>
                        <span>Nusxa olish</span>
                      </>
                    )}
                  </button>
                  </div>
                </div>
                <div className="relative p-6 bg-gradient-to-br from-blue-600/10 to-blue-700/10 rounded-2xl border border-blue-600/30 min-h-[140px] backdrop-blur-sm overflow-hidden">
                  <div className="absolute top-3 right-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  </div>
                  <div className="text-white text-lg leading-relaxed whitespace-pre-wrap font-medium break-words overflow-wrap-anywhere">
                    {translatedText}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 px-4">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-[#0a0f1e]/50 backdrop-blur-sm rounded-full border border-blue-900/30 flex-wrap justify-center">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-gray-500 text-sm font-medium">Groq AI</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Translator;
