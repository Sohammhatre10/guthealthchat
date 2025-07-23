import React from 'react';
import { Bot } from 'lucide-react';

export function TypingIndicator() {
  return (
    <div className="flex space-x-4 mb-8 animate-slideUp">
      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-good-bug-sage to-good-bug-forest flex items-center justify-center shadow-md">
        <Bot className="w-5 h-5 text-good-bug-cream" />
      </div>
      <div className="flex-1">
        <div className="inline-block px-5 py-4 rounded-3xl bg-good-bug-warm-beige border border-good-bug-cream shadow-md">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-good-bug-sage rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-good-bug-sage rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-good-bug-sage rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}