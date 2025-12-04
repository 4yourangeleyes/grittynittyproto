import React, { useState, useEffect } from 'react';
import { X, Download } from 'lucide-react';
import { Button } from './Button';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const PWAInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      
      // Save the event so it can be triggered later
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      // Show the install prompt after a short delay (better UX)
      setTimeout(() => {
        setShowPrompt(true);
      }, 3000);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      console.log('App is already installed');
      setShowPrompt(false);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    // Show the install prompt
    await deferredPrompt.prompt();

    // Wait for the user to respond
    const choiceResult = await deferredPrompt.userChoice;

    if (choiceResult.outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
    }

    // Clear the deferred prompt
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    // Don't show again for this session
    sessionStorage.setItem('pwa-prompt-dismissed', 'true');
  };

  // Don't show if already dismissed this session
  if (sessionStorage.getItem('pwa-prompt-dismissed')) {
    return null;
  }

  if (!showPrompt || !deferredPrompt) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 left-4 md:left-auto md:w-96 bg-white border-2 border-grit-dark shadow-grit p-6 z-50 animate-slide-up">
      <button
        onClick={handleDismiss}
        className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors"
        aria-label="Dismiss"
      >
        <X size={20} />
      </button>

      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-grit-primary rounded-lg flex items-center justify-center flex-shrink-0">
          <Download size={24} className="text-white" />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-lg mb-2">Install GritDocs</h3>
          <p className="text-sm text-gray-600 mb-4">
            Install GritDocs for quick access and offline support. Works like a native app!
          </p>
          <div className="flex gap-2">
            <Button onClick={handleInstall} size="sm">
              Install
            </Button>
            <Button onClick={handleDismiss} variant="outline" size="sm">
              Not Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
