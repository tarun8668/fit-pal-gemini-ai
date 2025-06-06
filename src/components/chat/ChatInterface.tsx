
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChatBubble } from './ChatBubble';
import { Send, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useChatLimits } from '@/hooks/useChatLimits';
import { useMembership } from '@/context/MembershipContext';
import { Link } from 'react-router-dom';
import { ChatMessage } from '@/types/chat';

export const ChatInterface = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m your AI fitness assistant. How can I help you today?',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { promptsUsed, canSendMessage, incrementPrompts } = useChatLimits();
  const { hasMembership } = useMembership();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    // Check if user has premium membership or still has free messages
    if (!hasMembership && !canSendMessage) {
      toast({
        title: "Message Limit Reached",
        description: "You've used all your free messages today. Upgrade to premium for unlimited chat!",
        variant: "destructive",
      });
      return;
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Only increment prompts for non-premium users
    if (!hasMembership) {
      incrementPrompts();
    }

    try {
      const { data, error } = await supabase.functions.invoke('chat-with-gemini', {
        body: { message: input.trim() }
      });

      if (error) {
        throw error;
      }

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response || 'Sorry, I encountered an error. Please try again.',
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <ChatBubble
            key={message.id}
            message={message}
          />
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-muted rounded-lg p-3 max-w-[80%]">
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>AI is thinking...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {!hasMembership && (
        <div className="px-4 py-2 bg-muted/50 border-t">
          <div className="flex items-center justify-between text-sm">
            <span>Free messages used: {promptsUsed}/2 today</span>
            <Link to="/membership">
              <Button size="sm" variant="outline">
                Upgrade for Unlimited
              </Button>
            </Link>
          </div>
        </div>
      )}
      
      <div className="border-t p-4">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={
              !hasMembership && !canSendMessage 
                ? "Upgrade to premium to continue chatting..." 
                : "Ask me about fitness, nutrition, or workouts..."
            }
            disabled={isLoading || (!hasMembership && !canSendMessage)}
            className="flex-1"
          />
          <Button 
            onClick={sendMessage} 
            disabled={isLoading || !input.trim() || (!hasMembership && !canSendMessage)}
            size="icon"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
