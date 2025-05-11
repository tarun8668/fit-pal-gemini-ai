
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send } from 'lucide-react';
import { ChatMessage, MessageRole } from '@/types/chat';
import { ChatBubble } from './ChatBubble';

export const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { 
      id: '1', 
      role: 'assistant', 
      content: "Hi there! I'm your FitPal AI assistant. How can I help with your fitness journey today? You can ask me about workout plans, nutrition advice, or recovery tips!" 
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (inputValue.trim() === '') return;
    
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    
    try {
      // This would be replaced with actual Gemini API call
      // For now, we'll simulate a response
      setTimeout(() => {
        const aiResponse: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: getSimulatedResponse(inputValue)
        };
        setMessages(prev => [...prev, aiResponse]);
        setIsLoading(false);
      }, 1500);
      
      // Actual API implementation would go here
      // const response = await sendMessageToGemini(inputValue);
      // setMessages(prev => [...prev, response]);
      
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm sorry, I'm having trouble connecting right now. Please try again later."
      }]);
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
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <ChatBubble
            key={message.id}
            message={message}
          />
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-700 rounded-2xl rounded-tl-none p-4 max-w-md">
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
      
      <div className="p-4 border-t border-gray-200">
        <div className="flex space-x-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about workouts, nutrition, or recovery..."
            className="flex-1"
            disabled={isLoading}
          />
          <Button 
            onClick={handleSend} 
            disabled={isLoading || !inputValue.trim()}
            className="bg-primary hover:bg-primary/90"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

// Temporary function to simulate AI responses
function getSimulatedResponse(userMessage: string): string {
  const message = userMessage.toLowerCase();
  
  if (message.includes('workout') || message.includes('exercise')) {
    return "For an effective workout plan, I recommend starting with a 3-day full-body routine if you're new to fitness. Focus on compound exercises like squats, deadlifts, and bench press. As you progress, you might want to try a Push/Pull/Legs split for more specific muscle targeting. Would you like me to suggest a specific routine based on your goals?";
  } else if (message.includes('diet') || message.includes('food') || message.includes('eat')) {
    return "A balanced diet is key to achieving your fitness goals! Make sure you're getting adequate protein (about 0.8-1g per pound of body weight), complex carbs, and healthy fats. For meal timing, try to eat protein-rich meals every 3-4 hours to maximize muscle protein synthesis. Would you like some meal recommendations based on specific goals?";
  } else if (message.includes('calorie') || message.includes('weight')) {
    return "To calculate your maintenance calories, you can use the formula: BMR × activity level. For weight loss, aim for a moderate deficit of 300-500 calories daily. For muscle gain, a small surplus of 200-300 calories is often ideal. Remember, consistency is more important than perfection!";
  } else if (message.includes('recovery') || message.includes('sore')) {
    return "For optimal recovery: 1) Prioritize sleep (7-9 hours), 2) Stay hydrated, 3) Consider light activity on rest days (like walking or stretching), 4) Ensure adequate protein intake, and 5) Don't neglect mobility work. For muscle soreness, gentle stretching, proper hydration, and occasional contrast therapy (alternating hot and cold) can help.";
  } 
  
  return "That's a great question about your fitness journey! To give you the best advice, I'd need to know a bit more about your specific goals, current fitness level, and any preferences you have. Could you share more details so I can provide personalized recommendations?";
}
