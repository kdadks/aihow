import React, { useState } from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { useVoiceRecognition } from '../../hooks/useVoiceRecognition';
import { cn } from '../../utils/cn';

interface EnhancedVoiceSearchProps {
  onTranscript: (transcript: string) => void;
  className?: string;
  placeholder?: string;
}

export const EnhancedVoiceSearch: React.FC<EnhancedVoiceSearchProps> = ({
  onTranscript,
  className,
  placeholder = 'Click the microphone to start speaking...'
}) => {
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleTranscript = (text: string) => {
    setTranscript(text);
    onTranscript(text);
  };

  const { isListening, startListening, stopListening } = useVoiceRecognition({
    onTranscript: handleTranscript,
    onError: (err) => setError(err)
  });

  const handleToggle = () => {
    if (isListening) {
      stopListening();
    } else {
      setError(null);
      startListening();
    }
  };

  return (
    <div className={cn("relative", className)}>
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={transcript}
            onChange={(e) => handleTranscript(e.target.value)}
            placeholder={placeholder}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
          <Button
            type="button"
            variant={isListening ? "primary" : "ghost"}
            size="icon"
            className={cn(
              "absolute right-2 top-1/2 -translate-y-1/2",
              isListening && "animate-pulse"
            )}
            onClick={handleToggle}
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
        </div>
      </div>

      {error && (
        <div className="mt-2 text-sm text-red-600">
          {error}
        </div>
      )}

      {isListening && (
        <div className="absolute -bottom-6 left-0 right-0 text-sm text-gray-500 flex items-center justify-center">
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
          Listening...
        </div>
      )}
    </div>
  );
};