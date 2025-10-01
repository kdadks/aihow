import React, { useState, useEffect } from 'react';
import { X, Cookie, Shield, Settings } from 'lucide-react';
import { Button } from './ui/Button';

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
}

export const CookieConsent: React.FC = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true, // Always true, can't be disabled
    analytics: false,
    marketing: false,
    preferences: false,
  });

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      // Show banner after a short delay for better UX
      setTimeout(() => setShowBanner(true), 1000);
    } else {
      // Load saved preferences
      try {
        const savedPreferences = JSON.parse(consent);
        // Validate that it's an object with expected properties
        if (typeof savedPreferences === 'object' && savedPreferences !== null &&
            typeof savedPreferences.necessary === 'boolean') {
          setPreferences(savedPreferences);
        } else {
          throw new Error('Invalid preferences format');
        }
      } catch (e) {
        // Handle legacy format or invalid JSON
        console.warn('Loading legacy cookie preferences, updating to new format');
        // If it's "accepted", treat as all accepted
        if (consent === 'accepted') {
          setPreferences({
            necessary: true,
            analytics: true,
            marketing: true,
            preferences: true,
          });
        } else {
          // Reset to defaults if invalid
          setPreferences({
            necessary: true,
            analytics: false,
            marketing: false,
            preferences: false,
          });
        }
        // Update localStorage with valid JSON
        localStorage.setItem('cookieConsent', JSON.stringify(preferences));
      }
    }
  }, []);

  const handleAcceptAll = () => {
    const allAccepted: CookiePreferences = {
      necessary: true,
      analytics: true,
      marketing: true,
      preferences: true,
    };
    savePreferences(allAccepted);
  };

  const handleRejectAll = () => {
    const onlyNecessary: CookiePreferences = {
      necessary: true,
      analytics: false,
      marketing: false,
      preferences: false,
    };
    savePreferences(onlyNecessary);
  };

  const handleSavePreferences = () => {
    savePreferences(preferences);
  };

  const savePreferences = (prefs: CookiePreferences) => {
    localStorage.setItem('cookieConsent', JSON.stringify(prefs));
    localStorage.setItem('cookieConsentDate', new Date().toISOString());
    setPreferences(prefs);
    setShowBanner(false);
    setShowDetails(false);

    // Trigger analytics based on consent
    if (prefs.analytics) {
      // Initialize analytics tracking
      console.log('Analytics tracking enabled');
    }
    if (prefs.marketing) {
      // Initialize marketing tracking
      console.log('Marketing tracking enabled');
    }
  };

  const togglePreference = (key: keyof CookiePreferences) => {
    if (key === 'necessary') return; // Can't disable necessary cookies
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
  };

  if (!showBanner) return null;

  return (
    <>
      {/* Modal backdrop and content for detailed view only */}
      {showDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
            onClick={() => setShowDetails(false)}
          />

          {/* Detailed Preferences Modal */}
          <div className="relative w-full max-w-4xl bg-white rounded-lg shadow-2xl overflow-hidden">
            <div>
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 text-white">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold">Cookie Preferences</h3>
                  <button
                    onClick={() => setShowDetails(false)}
                    className="text-white hover:text-gray-200"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 max-h-[60vh] overflow-y-auto">
                <p className="text-sm text-gray-600 mb-6">
                  We use different types of cookies to optimize your experience on our website.
                  Click on the categories below to learn more and customize your preferences.
                </p>

                {/* Necessary Cookies */}
                <div className="mb-6 pb-6 border-b border-gray-200">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Shield className="w-5 h-5 text-green-600" />
                        <h4 className="font-semibold text-gray-900">Necessary Cookies</h4>
                        <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
                          Always Active
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        These cookies are essential for the website to function properly.
                        They enable basic functions like page navigation, secure areas access,
                        and form submissions. The website cannot function properly without these cookies.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Analytics Cookies */}
                <div className="mb-6 pb-6 border-b border-gray-200">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-2">Analytics Cookies</h4>
                      <p className="text-sm text-gray-600 mb-3">
                        These cookies help us understand how visitors interact with our website.
                        They collect anonymous information about page visits, traffic sources,
                        and user behavior to help us improve our service.
                      </p>
                      <p className="text-xs text-gray-500">
                        Examples: Google Analytics, session tracking
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer ml-4">
                      <input
                        type="checkbox"
                        checked={preferences.analytics}
                        onChange={() => togglePreference('analytics')}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>

                {/* Marketing Cookies */}
                <div className="mb-6 pb-6 border-b border-gray-200">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-2">Marketing Cookies</h4>
                      <p className="text-sm text-gray-600 mb-3">
                        These cookies are used to track visitors across websites. They are used
                        to display ads that are relevant and engaging for individual users,
                        making them more valuable for publishers and advertisers.
                      </p>
                      <p className="text-xs text-gray-500">
                        Examples: Facebook Pixel, Google Ads, retargeting
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer ml-4">
                      <input
                        type="checkbox"
                        checked={preferences.marketing}
                        onChange={() => togglePreference('marketing')}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>

                {/* Preference Cookies */}
                <div className="mb-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-2">Preference Cookies</h4>
                      <p className="text-sm text-gray-600 mb-3">
                        These cookies enable the website to remember your choices (such as language,
                        region, or theme) and provide enhanced, personalized features.
                      </p>
                      <p className="text-xs text-gray-500">
                        Examples: Language preferences, theme settings, saved filters
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer ml-4">
                      <input
                        type="checkbox"
                        checked={preferences.preferences}
                        onChange={() => togglePreference('preferences')}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200">
                <a
                  href="/privacy"
                  className="text-sm text-blue-600 hover:underline"
                >
                  Privacy Policy
                </a>
                <div className="flex space-x-3">
                  <Button
                    onClick={() => setShowDetails(false)}
                    variant="outline"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSavePreferences}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Save Preferences
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Simple Banner at Bottom - Always visible when not in details view */}
      {!showDetails && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t-2 border-gray-200 shadow-2xl animate-slide-up">
          <div className="max-w-7xl mx-auto p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex items-start space-x-3 flex-1">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Cookie className="w-5 h-5 text-blue-600" />
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-semibold text-gray-900 mb-1">
                    We value your privacy
                  </h3>
                  <p className="text-sm text-gray-600">
                    We use cookies to enhance your browsing experience and analyze our traffic.
                    By clicking "Accept All", you consent to our use of cookies.{' '}
                    <a href="/privacy" className="text-blue-600 hover:underline font-medium">
                      Learn more
                    </a>
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 sm:flex-nowrap sm:ml-4">
                <Button
                  onClick={handleAcceptAll}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2"
                >
                  Accept All
                </Button>
                <Button
                  onClick={handleRejectAll}
                  variant="outline"
                  className="text-sm px-4 py-2"
                >
                  Reject All
                </Button>
                <Button
                  onClick={() => setShowDetails(true)}
                  variant="outline"
                  leftIcon={<Settings className="w-4 h-4" />}
                  className="text-sm px-4 py-2"
                >
                  Customize
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
