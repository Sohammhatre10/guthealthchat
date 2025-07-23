import React from 'react';
import { Bot, User } from 'lucide-react';

interface ChatMessageProps {
  message: string;
  isBot: boolean;
  timestamp: string;
}

export function ChatMessage({ message, isBot, timestamp }: ChatMessageProps) {
  return (
    <div className={`flex space-x-4 mb-8 animate-slideUp ${isBot ? '' : 'flex-row-reverse space-x-reverse'}`}>
      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-md ${
        isBot 
          ? 'bg-gradient-to-br from-good-bug-sage to-good-bug-forest' 
          : 'bg-gradient-to-br from-good-bug-terracotta to-good-bug-brown'
      }`}>
        {isBot ? (
          <Bot className="w-5 h-5 text-good-bug-cream" />
        ) : (
          <User className="w-5 h-5 text-good-bug-cream" />
        )}
      </div>
      <div className={`flex-1 max-w-xs sm:max-w-md md:max-w-lg ${isBot ? '' : 'text-right'}`}>
        <div className={`inline-block px-5 py-4 rounded-3xl shadow-md ${
          isBot 
            ? 'bg-good-bug-warm-beige text-good-bug-forest border border-good-bug-cream' 
            : 'bg-gradient-to-r from-good-bug-sage to-good-bug-forest text-good-bug-cream'
        }`}>
          <p className="text-sm leading-relaxed whitespace-pre-wrap font-medium">{message}</p>
        </div>
        <p className="text-xs text-good-bug-brown mt-2 px-2 font-medium">{timestamp}</p>
      </div>
    </div>
  );
}