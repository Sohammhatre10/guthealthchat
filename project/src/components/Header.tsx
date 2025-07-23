import React from 'react';
import { Leaf, Heart } from 'lucide-react';

export function Header() {
  return (
    <div className="bg-good-bug-cream border-b border-good-bug-warm-beige px-6 py-5 flex items-center justify-between shadow-sm">
      <div className="flex items-center space-x-3">
        <div className="bg-gradient-to-br from-good-bug-sage to-good-bug-forest p-3 rounded-2xl shadow-md">
          <Leaf className="w-7 h-7 text-good-bug-cream" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-good-bug-forest tracking-tight">GutHealth AI</h1>
          <p className="text-sm text-good-bug-brown font-medium">Your digestive wellness companion</p>
        </div>
      </div>
      <div className="flex items-center space-x-3">
        <Heart className="w-5 h-5 text-good-bug-terracotta" />
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-good-bug-sage rounded-full animate-pulse"></div>
          <span className="text-sm text-good-bug-brown font-medium">Online</span>
        </div>
      </div>
    </div>
  );
}