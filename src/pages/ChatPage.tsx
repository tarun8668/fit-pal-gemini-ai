
import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChatInterface } from '@/components/chat/ChatInterface';

const ChatPage = () => {
  return (
    <AppLayout>
      <Card className="h-[calc(100vh-11rem)] border-gray-200 shadow-md overflow-hidden flex flex-col">
        <CardHeader className="border-b py-4 flex-shrink-0">
          <CardTitle className="text-xl font-semibold">AI Fitness Assistant</CardTitle>
          <CardDescription className="text-sm">
            Ask questions about workouts, nutrition, or fitness tips
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0 flex-grow overflow-hidden">
          <ChatInterface />
        </CardContent>
      </Card>
    </AppLayout>
  );
};

export default ChatPage;
