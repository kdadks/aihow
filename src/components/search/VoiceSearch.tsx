import React, { useState, useCallback, useRef } from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { cn } from '../../utils/cn';

interface VoiceSearchProps {
  onTranscript: (transcript: string) => void;
  className?: string;
}

export const VoiceSearch: React.FC<VoiceSearchProps> = ({ onTranscript, className }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
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
        setError(null);
      };

      recognitionRef.current.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join(' ');
        
        setTranscript(transcript);
        onTranscript(transcript);
      };

      recognitionRef.current.onerror = (event) => {
        setError(`Error: ${event.error}`);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };

      await recognitionRef.current.start();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred with voice recognition');
      setIsListening(false);
    }
  }, [onTranscript]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  }, []);

  return (
    <div className={cn("relative", className)}>
      <div className="flex items-center space-x-2">
        <Button
          variant={isListening ? "primary" : "outline"}
          size="icon"
          className={cn(
            "relative",
            isListening && "animate-pulse"
          )}
          onClick={isListening ? stopListening : startListening}
        >
          {isListening ? (
            <>
              <Mic className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
            </>
          ) : (
            <MicOff className="h-5 w-5" />
          )}
        </Button>
        
        {transcript && (
          <div className="flex-1 p-2 bg-gray-50 rounded-md">
            <p className="text-sm text-gray-700">{transcript}</p>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-2 text-sm text-red-600">
          {error}
        </div>
      )}
    </div>
  );
};