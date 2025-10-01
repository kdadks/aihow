import React, { useState, useEffect } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import { Card } from '../ui/Card';
import { generateIntelligentAnswer, simulateTypingDelay } from '../../utils/generateAnswer';

interface GenerativeAnswerProps {
  query: string;
  searchResults?: any[];
  onAnswerGenerated?: (answer: string) => void;
}

export const GenerativeAnswer: React.FC<GenerativeAnswerProps> = ({
  query,
  searchResults = [],
  onAnswerGenerated
}) => {
  const [answer, setAnswer] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    console.log('GenerativeAnswer mounted:', { query, resultsCount: searchResults.length });
    if (query && query.trim().length >= 1 && searchResults.length > 0) {
      console.log('Generating answer for:', query);
      generateAnswer();
    } else {
      console.log('Not generating - condition not met');
      setAnswer(null);
      setIsVisible(false);
    }
  }, [query, searchResults]);

  const generateAnswer = async () => {
    console.log('generateAnswer called');
    setIsLoading(true);
    setAnswer(null);
    setIsVisible(false);

    try {
      // Simulate processing delay for realistic feel
      await simulateTypingDelay();

      // Generate intelligent answer based on search results
      const generatedAnswer = generateIntelligentAnswer(query, searchResults);
      console.log('Generated answer:', generatedAnswer);

      if (generatedAnswer) {
        setAnswer(generatedAnswer);
        setIsVisible(true);
        onAnswerGenerated?.(generatedAnswer);
      }
    } catch (err) {
      console.error('Error generating answer:', err);
      // Fail silently - don't show error to user
    } finally {
      setIsLoading(false);
    }
  };

  // Don't render anything if there's no answer and not loading
  if (!isLoading && !answer) {
    return null;
  }

  return (
    <Card className={`mb-6 border-l-4 border-l-blue-500 transition-all duration-300 ${
      isVisible ? 'opacity-100' : 'opacity-0'
    }`}>
      <div className="p-6">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            {isLoading ? (
              <Loader2 className="h-6 w-6 text-blue-600 animate-spin" />
            ) : (
              <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center mb-2">
              <h3 className="text-sm font-semibold text-gray-900">
                Smart Summary
              </h3>
              <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 rounded-full">
                AI-Powered
              </span>
            </div>

            {isLoading ? (
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-4/6"></div>
              </div>
            ) : answer ? (
              <div className="prose prose-sm max-w-none">
                <p className="text-gray-700 leading-relaxed m-0">
                  {answer}
                </p>
              </div>
            ) : null}

            {answer && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <p className="text-xs text-gray-500 italic">
                  This smart summary is generated based on your search query and matching tools in our database.
                  Explore the detailed results below for more information.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};
