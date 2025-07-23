import React from 'react';

interface SuggestedQuestionsProps {
  onSelectQuestion: (question: string) => void;
}

export function SuggestedQuestions({ onSelectQuestion }: SuggestedQuestionsProps) {
  const suggestions = [
    "What foods are best for gut health?",
    "How can I improve my digestion naturally?",
    "What are signs of an unhealthy gut?",
    "Should I take probiotics?",
    "How does stress affect gut health?",
    "What is the gut-brain connection?"
  ];

  return (
    <div className="px-6 py-8">
      <h3 className="text-base font-bold text-good-bug-forest mb-5">Suggested questions:</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {suggestions.map((question, index) => (
          <button
            key={index}
            onClick={() => onSelectQuestion(question)}
            className="text-left p-4 rounded-2xl border-2 border-good-bug-warm-beige hover:border-good-bug-sage hover:bg-good-bug-warm-beige transition-all text-sm text-good-bug-forest hover:text-good-bug-forest font-medium shadow-sm hover:shadow-md bg-white"
          >
            {question}
          </button>
        ))}
      </div>
    </div>
  );
}