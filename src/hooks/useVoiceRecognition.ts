import { useState, useCallback, useRef } from 'react';

interface UseVoiceRecognitionProps {
  onTranscript: (transcript: string) => void;
  onError?: (error: string) => void;
}

export function useVoiceRecognition({ onTranscript, onError }: UseVoiceRecognitionProps) {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const startListening = useCallback(async () => {
    try {
      if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        throw new Error('Voice recognition is not supported in your browser.');
      }

      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onstart = () => {
        setIsListening(true);
      };

      recognitionRef.current.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join(' ');
        
        onTranscript(transcript);
      };

      recognitionRef.current.onerror = (event) => {
        onError?.(event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };

      await recognitionRef.current.start();
    } catch (err) {
      onError?.(err instanceof Error ? err.message : 'An error occurred with voice recognition');
      setIsListening(false);
    }
  }, [onTranscript, onError]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  }, []);

  return {
    isListening,
    startListening,
    stopListening
  };
}