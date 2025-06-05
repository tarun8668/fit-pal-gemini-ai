
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Lock, Crown } from 'lucide-react';
import { ChatMessage, MessageRole } from '@/types/chat';
import { ChatBubble } from './ChatBubble';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useMembership } from '@/context/MembershipContext';
import { useChatLimits } from '@/hooks/useChatLimits';
import { Link } from 'react-router-dom';

export const ChatInterface: React.FC = () => {
  const { hasMembership } = useMembership();
  const { promptsUsed, canSendMessage, incrementPrompts } = useChatLimits();
  
  const [messages, setMessages] = useState<ChatMessage[]>([
    { 
      id: '1', 
      role: 'assistant', 
      content: "Hi there! I'm your Consist AI assistant. How can I help with your fitness journey today? You can ask me about workout plans, nutrition advice, or recovery tips!" 
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [streamingContent, setStreamingContent] = useState<string>('');
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingContent]);

  const handleSend = async () => {
    if (inputValue.trim() === '') return;
    
    // Check if user can send message (for non-premium users)
    if (!hasMembership && !canSendMessage) {
      toast({
        title: "Daily Limit Reached",
        description: "You've reached your daily limit of 2 AI prompts. Upgrade to premium for unlimited access!",
        variant: "destructive"
      });
      return;
    }
    
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setError(null);
    setStreamingContent('');
    setIsStreaming(true);
    
    // Increment prompts for non-premium users
    if (!hasMembership) {
      incrementPrompts();
    }
    
    try {
      console.log('Sending message to Gemini:', inputValue);
      // Call Gemini AI edge function
      const { data, error } = await supabase.functions.invoke('chat-with-gemini', {
        body: {
          message: inputValue,
          history: messages.map(m => ({
            role: m.role,
            content: m.content
          }))
        }
      });
      
      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(error.message);
      }
      
      console.log('Received response from Gemini:', data);
      
      if (data && data.response) {
        // Simulate word-by-word streaming
        const words = data.response.split(' ');
        let currentText = '';
        
        for (let i = 0; i < words.length; i++) {
          await new Promise<void>((resolve) => {
            setTimeout(() => {
              currentText += (i > 0 ? ' ' : '') + words[i];
              setStreamingContent(currentText);
              scrollToBottom();
              resolve();
            }, 30); // Adjust speed of word appearance (lower = faster)
          });
        }
        
        // After streaming is complete, add the full message
        const aiResponse: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.response
        };
        setIsStreaming(false);
        setStreamingContent('');
        setMessages(prev => [...prev, aiResponse]);
      } else if (data && data.error) {
        throw new Error(data.error);
      } else {
        throw new Error('No response from AI');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setError(error instanceof Error ? error.message : 'Failed to get a response');
      setIsStreaming(false);
      
      toast({
        title: "Error",
        description: "Failed to get a response. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full">
      <ScrollArea 
        className="flex-1 p-4" 
        ref={scrollAreaRef as React.RefObject<HTMLDivElement>}
      >
        <div className="space-y-1 max-w-4xl mx-auto">
          {/* Daily limit warning for non-premium users */}
          {!hasMembership && (
            <Alert className="mb-4 border-amber-500 bg-amber-50 dark:bg-amber-950">
              <Crown className="h-4 w-4" />
              <AlertDescription className="flex items-center justify-between">
                <span>
                  Free plan: {promptsUsed}/2 daily AI prompts used
                </span>
                <Link to="/membership">
                  <Button size="sm" variant="outline" className="ml-2">
                    Upgrade
                  </Button>
                </Link>
              </AlertDescription>
            </Alert>
          )}
          
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>
                {error}. Please try again or contact support if the issue persists.
              </AlertDescription>
            </Alert>
          )}
          
          {messages.map((message) => (
            <ChatBubble
              key={message.id}
              message={message}
            />
          ))}
          
          {isStreaming && (
            <div className="flex justify-start mb-4">
              <div className="bg-gray-100 text-gray-800 rounded-2xl rounded-tl-none p-4 max-w-[80%] md:max-w-[70%] border border-gray-200 shadow-sm">
                <div className="whitespace-pre-wrap">{streamingContent}</div>
              </div>
            </div>
          )}
          
          {isLoading && !isStreaming && (
            <div className="flex justify-start mb-4">
              <div className="bg-gray-100 text-gray-700 rounded-2xl rounded-tl-none p-4 max-w-[70%] border border-gray-200 shadow-sm">
                <div className="flex space-x-2 items-center">
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse"></div>
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse delay-150"></div>
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse delay-300"></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
      
      <div className="p-4 border-t border-gray-200 bg-card/50">
        <div className="flex items-center space-x-2 max-w-4xl mx-auto">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              !hasMembership && !canSendMessage 
                ? "Daily limit reached - upgrade for unlimited access"
                : "Ask about workouts, nutrition, or recovery..."
            }
            className="flex-1 bg-background border-gray-300 focus:border-gray-400"
            disabled={isLoading || isStreaming || (!hasMembership && !canSendMessage)}
          />
          <Button 
            onClick={handleSend} 
            disabled={isLoading || isStreaming || !inputValue.trim() || (!hasMembership && !canSendMessage)}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
            size="icon"
          >
            {!hasMembership && !canSendMessage ? (
              <Lock className="h-4 w-4" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
