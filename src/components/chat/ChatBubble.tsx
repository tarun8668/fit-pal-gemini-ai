
import React from 'react';
import { ChatMessage } from '@/types/chat';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ChatBubbleProps {
  message: ChatMessage;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
  const isUser = message.role === 'user';
  
  return (
    <div className={cn(
      "flex w-full mb-4",
      isUser ? "justify-end" : "justify-start"
    )}>
      <div className={cn(
        "p-4 rounded-2xl max-w-[80%] md:max-w-[70%] shadow-sm animate-fade-in",
        isUser 
          ? "bg-gradient-to-r from-primary to-primary/90 text-black font-medium rounded-tr-none" 
          : "bg-gray-100 text-gray-800 rounded-tl-none border border-gray-200"
      )}>
        {message.content.length > 300 ? (
          <ScrollArea className="max-h-[300px] pr-2">
            <div className="whitespace-pre-wrap">{message.content}</div>
          </ScrollArea>
        ) : (
          <div className="whitespace-pre-wrap">{message.content}</div>
        )}
      </div>
    </div>
  );
};
