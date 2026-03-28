import React, { useEffect, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const PWAInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      // Delay to show animation
      setTimeout(() => {
        setShowPrompt(true);
        setTimeout(() => setIsVisible(true), 100);
      }, 2000); // Show after 2 seconds
    };

    window.addEventListener('beforeinstallprompt', handler);

    // FOR TESTING: Show prompt after 3 seconds (localhost)
    // Remove this in production
    const isDev = import.meta.env.DEV;
    if (isDev) {
      setTimeout(() => {
        setShowPrompt(true);
        setTimeout(() => setIsVisible(true), 100);
      }, 3000);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) {
      // If no prompt event, try to guide user to manual install
      const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
      const isEdge = /Edg/.test(navigator.userAgent);
      const isAndroid = /Android/.test(navigator.userAgent);
      const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent);

      let message = 'PWA o\'rnatish:\n\n';
      
      if (isIOS) {
        message += '📱 iOS:\n' +
                   '1. Pastdagi Share tugmasini (□↑) bosing\n' +
                   '2. "Add to Home Screen" ni tanlang\n' +
                   '3. "Add" tugmasini bosing';
      } else if (isAndroid) {
        message += '📱 Android:\n' +
                   '1. Menyu (⋮) ni oching\n' +
                   '2. "Add to Home screen" ni tanlang\n' +
                   '3. "Add" tugmasini bosing';
      } else if (isChrome || isEdge) {
        message += '💻 Desktop:\n' +
                   '1. Manzil satrida ⊕ ikonkasini bosing\n' +
                   '2. Yoki menyu (⋮) → "Install AI Translator"\n' +
                   '3. "Install" tugmasini bosing';
      } else {
        message += 'Brauzer menyusidan "Add to Home screen" yoki\n' +
                   '"Install" opsiyasini tanlang';
      }

      alert(message);
      setIsVisible(false);
      setTimeout(() => {
        setShowPrompt(false);
      }, 300);
      return;
    }

    try {
      // Show native browser install prompt
      await deferredPrompt.prompt();
      
      // Wait for user choice
      const { outcome } = await deferredPrompt.userChoice;

      if (outcome === 'accepted') {
        console.log('✅ PWA muvaffaqiyatli o\'rnatildi!');
      } else {
        console.log('❌ Foydalanuvchi o\'rnatishni bekor qildi');
      }

      // Clear the prompt
      setDeferredPrompt(null);
    } catch (error) {
      console.error('O\'rnatishda xatolik:', error);
    }

    // Hide the custom prompt
    setIsVisible(false);
    setTimeout(() => {
      setShowPrompt(false);
    }, 300);
  };

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(() => {
      setShowPrompt(false);
    }, 300);
  };

  if (!showPrompt) return null;

  return (
    <div 
      className={`fixed bottom-6 right-6 z-50 max-w-[400px] transition-all duration-500 ease-out transform ${
        isVisible 
          ? 'translate-y-0 opacity-100 scale-100' 
          : 'translate-y-full opacity-0 scale-95'
      }`}
    >
      <div className="bg-[#1a1f2e] rounded-xl shadow-2xl border border-gray-700/50 overflow-hidden">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {/* App Icon */}
            <div className="flex-shrink-0 w-9 h-9 rounded-lg overflow-hidden">
              <img 
                src="/icon-192x192.png" 
                alt="AI Translator" 
                className="w-full h-full object-cover"
              />
            </div>

            {/* Title */}
            <div>
              <h3 className="text-white font-semibold text-sm leading-tight">
                AI Translator
              </h3>
              <p className="text-blue-100 text-xs">
                Ilovani o'rnating
              </p>
            </div>
          </div>

          {/* Close button */}
          <button
            onClick={handleDismiss}
            className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-white/20 transition-all"
            aria-label="Yopish"
          >
            <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="px-4 py-3 flex items-center gap-3">
          {/* Features */}
          <div className="flex items-center gap-3 flex-1">
            <div className="flex items-center gap-1.5">
              <div className="w-7 h-7 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-xs text-gray-400">Tez</span>
            </div>

            <div className="flex items-center gap-1.5">
              <div className="w-7 h-7 bg-green-500/10 rounded-lg flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-xs text-gray-400">Offline</span>
            </div>

            <div className="flex items-center gap-1.5">
              <div className="w-7 h-7 bg-purple-500/10 rounded-lg flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <span className="text-xs text-gray-400">Qulay</span>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleInstall}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-2 px-4 rounded-lg active:scale-95 transition-all shadow-lg flex items-center gap-1.5 text-sm whitespace-nowrap"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span>O'rnatish</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PWAInstallPrompt;
