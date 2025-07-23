import React, { useState } from 'react';
import { Send, Paperclip } from 'lucide-react';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

export function MessageInput({ onSendMessage, disabled = false }: MessageInputProps) {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="bg-good-bug-cream border-t border-good-bug-warm-beige px-6 py-5">
      <form onSubmit={handleSubmit} className="flex items-end space-x-4">
        <button
          type="button"
          className="flex-shrink-0 p-3 text-good-bug-brown hover:text-good-bug-forest transition-colors rounded-full hover:bg-good-bug-warm-beige"
        >
          <Paperclip className="w-6 h-6" />
        </button>
        <div className="flex-1 relative">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about your gut health, digestion, or nutrition..."
            className="w-full px-5 py-4 border-2 border-good-bug-warm-beige rounded-2xl focus:ring-2 focus:ring-good-bug-sage focus:border-good-bug-sage resize-none transition-all placeholder-good-bug-brown bg-white shadow-sm font-medium"
            rows={1}
            style={{ minHeight: '56px', maxHeight: '120px' }}
            disabled={disabled}
          />
        </div>
        <button
          type="submit"
          disabled={!message.trim() || disabled}
          className={`flex-shrink-0 p-4 rounded-2xl transition-all shadow-md ${
            message.trim() && !disabled
              ? 'bg-gradient-to-r from-good-bug-sage to-good-bug-forest text-good-bug-cream hover:shadow-lg transform hover:scale-105'
              : 'bg-good-bug-warm-beige text-good-bug-brown cursor-not-allowed'
          }`}
        >
          <Send className="w-6 h-6" />
        </button>
      </form>
    </div>
  );
}