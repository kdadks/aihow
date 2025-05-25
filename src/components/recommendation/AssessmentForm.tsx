import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { assessmentQuestions } from '../../data/questions';
import { ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Question, Recommendation } from '../../types';
import { tools } from '../../data/tools';

interface AssessmentFormProps {
  onComplete: (recommendations: Recommendation[]) => void;
}

export const AssessmentForm: React.FC<AssessmentFormProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [loading, setLoading] = useState(false);

  const totalSteps = assessmentQuestions.filter(q => 
    !q.dependsOn || (q.dependsOn && answers[q.dependsOn.questionId] && 
      q.dependsOn.answers.includes(answers[q.dependsOn.questionId] as string))
  ).length;

  const visibleQuestions = assessmentQuestions.filter(q => 
    !q.dependsOn || (q.dependsOn && answers[q.dependsOn.questionId] && 
      q.dependsOn.answers.includes(answers[q.dependsOn.questionId] as string))
  );

  const currentQuestion = visibleQuestions[currentStep];

  const handleSingleAnswer = (questionId: string, value: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleMultipleAnswer = (questionId: string, value: string) => {
    const currentAnswers = answers[questionId] as string[] || [];
    const updatedAnswers = currentAnswers.includes(value)
      ? currentAnswers.filter(v => v !== value)
      : [...currentAnswers, value];
    
    setAnswers(prev => ({
      ...prev,
      [questionId]: updatedAnswers
    }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Generate recommendations
      generateRecommendations();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isStepComplete = (question: Question) => {
    if (question.type === 'single' && answers[question.id]) {
      return true;
    }
    if (question.type === 'multiple' && Array.isArray(answers[question.id]) && (answers[question.id] as string[]).length > 0) {
      return true;
    }
    return false;
  };

  const generateRecommendations = () => {
    setLoading(true);

    // Simulate API call with setTimeout
    setTimeout(() => {
      // Demo logic for recommendations - in a real app this would be a more sophisticated algorithm
      const purpose = answers['purpose'] as string;
      const experience = answers['experience'] as string;
      const budget = answers['budget'] as string;

      // Simple scoring system based on answers
      const recommendations: Recommendation[] = tools
        .map(tool => {
          let score = 0;
          let reasons = [];

          // Score based on purpose
          if (purpose === 'content' && tool.categoryId.includes('media') || tool.categoryId.includes('document')) {
            score += 30;
            reasons.push('Matches your content creation needs');
          }
          if (purpose === 'development' && tool.categoryId.includes('code')) {
            score += 30;
            reasons.push('Perfect for software development');
          }
          if (purpose === 'productivity' && tool.categoryId.includes('workflow')) {
            score += 30;
            reasons.push('Great for productivity and automation');
          }

          // Score based on experience
          if ((experience === 'beginner' || experience === 'novice') && tool.features.length < 5) {
            score += 20;
            reasons.push('User-friendly for beginners');
          }
          if ((experience === 'intermediate' || experience === 'advanced') && tool.features.length >= 5) {
            score += 20;
            reasons.push('Has advanced features you\'ll appreciate');
          }

          // Score based on budget
          if (budget === 'free' && tool.pricing.hasFreeOption) {
            score += 25;
            reasons.push('Offers a free option that matches your budget');
          }
          if (budget === 'low' && tool.pricing.startingPrice && tool.pricing.startingPrice.includes('$10')) {
            score += 25;
            reasons.push('Affordable pricing that fits your budget');
          }
          if ((budget === 'medium' || budget === 'high' || budget === 'enterprise') && tool.featured) {
            score += 15;
            reasons.push('Premium tool with advanced capabilities');
          }

          // Add rating score
          score += tool.rating * 5;

          // Bonus for trending and featured
          if (tool.trending) score += 10;
          if (tool.featured) score += 5;

          // Add a random factor to break ties
          score += Math.random() * 5;

          return {
            toolId: tool.id,
            score,
            matchReason: reasons.join('. ')
          };
        })
        .sort((a, b) => b.score - a.score)
        .slice(0, 5);

      setLoading(false);
      onComplete(recommendations);
    }, 1500);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <div className="relative">
          <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-100">
            <div 
              style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-600 transition-all duration-500"
            ></div>
          </div>
          <div className="flex justify-between">
            <span className="text-xs font-medium text-blue-600">{currentStep + 1} of {totalSteps}</span>
            <span className="text-xs font-medium text-gray-500">Finding your perfect AI tools</span>
          </div>
        </div>
      </div>

      {currentQuestion && (
        <div className="bg-white rounded-lg shadow-md p-6 md:p-8 mb-8 transition-all duration-300">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">{currentQuestion.text}</h2>
          
          {currentQuestion.type === 'single' && currentQuestion.options && (
            <div className="space-y-4">
              {currentQuestion.options.map((option) => (
                <div 
                  key={option.id}
                  onClick={() => handleSingleAnswer(currentQuestion.id, option.value)}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    answers[currentQuestion.id] === option.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <div className="flex items-center">
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                      answers[currentQuestion.id] === option.value
                        ? 'border-blue-500 bg-blue-500' 
                        : 'border-gray-300'
                    }`}>
                      {answers[currentQuestion.id] === option.value && (
                        <CheckCircle2 className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <label className="ml-3 cursor-pointer flex-1">
                      <span className="text-gray-900 font-medium">{option.text}</span>
                    </label>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {currentQuestion.type === 'multiple' && currentQuestion.options && (
            <div className="space-y-4">
              {currentQuestion.options.map((option) => {
                const isSelected = Array.isArray(answers[currentQuestion.id]) && 
                  (answers[currentQuestion.id] as string[]).includes(option.value);
                
                return (
                  <div 
                    key={option.id}
                    onClick={() => handleMultipleAnswer(currentQuestion.id, option.value)}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <div className="flex items-center">
                      <div className={`w-5 h-5 rounded border flex items-center justify-center ${
                        isSelected
                          ? 'border-blue-500 bg-blue-500' 
                          : 'border-gray-300'
                      }`}>
                        {isSelected && (
                          <CheckCircle2 className="w-4 h-4 text-white" />
                        )}
                      </div>
                      <label className="ml-3 cursor-pointer flex-1">
                        <span className="text-gray-900 font-medium">{option.text}</span>
                      </label>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          
          <div className="mt-8 flex justify-between">
            <Button
              onClick={prevStep}
              variant="outline"
              disabled={currentStep === 0}
              leftIcon={<ArrowLeft className="h-4 w-4" />}
            >
              Previous
            </Button>
            <Button
              onClick={nextStep}
              disabled={!isStepComplete(currentQuestion) || loading}
              isLoading={loading && currentStep === totalSteps - 1}
              rightIcon={<ArrowRight className="h-4 w-4" />}
            >
              {currentStep < totalSteps - 1 ? 'Next' : 'Get Recommendations'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};