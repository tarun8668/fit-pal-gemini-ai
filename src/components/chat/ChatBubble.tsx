
import React from 'react';
import { ChatMessage } from '@/types/chat';
import { cn } from '@/lib/utils';

interface ChatBubbleProps {
  message: ChatMessage;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
  const isUser = message.role === 'user';
  
  return (
    <div className={cn(
      "flex",
      isUser ? "justify-end" : "justify-start"
    )}>
      <div className={cn(
        "p-4 rounded-2xl max-w-md animate-fade-in",
        isUser 
          ? "bg-primary text-white rounded-tr-none" 
          : "bg-gray-100 text-gray-700 rounded-tl-none"
      )}>
        {message.content}
      </div>
    </div>
  );
};
