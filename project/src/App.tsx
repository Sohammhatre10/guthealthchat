import React, { useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { ChatMessage } from './components/ChatMessage';
import { TypingIndicator } from './components/TypingIndicator';
import { MessageInput } from './components/MessageInput';
import { SuggestedQuestions } from './components/SuggestedQuestions';
import { useChat } from './hooks/useChat';

function App() {
  const { messages, sendMessage, isLoading } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = (message: string) => {
    sendMessage(message);
  };

  return (
    <div className="h-screen bg-gradient-to-br from-good-bug-cream via-good-bug-warm-beige to-primary-100 flex flex-col">
      <Header />
      
      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto px-6 py-8">
          {messages.length === 1 && (
            <div className="mb-12">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-good-bug-forest mb-3 tracking-tight">
                  Welcome to GutHealth AI
                </h2>
                <p className="text-good-bug-brown max-w-lg mx-auto text-lg font-medium leading-relaxed">
                  Get personalized guidance on digestive wellness, nutrition, and gut health from our AI assistant.
                </p>
              </div>
              <SuggestedQuestions onSelectQuestion={handleSendMessage} />
            </div>
          )}
          
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              message={message.content}
              isBot={message.role === 'assistant'}
              timestamp={message.timestamp}
            />
          ))}
          
          {isLoading && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>
        
        <MessageInput onSendMessage={handleSendMessage} disabled={isLoading} />
      </div>
    </div>
  );
}

export default App;