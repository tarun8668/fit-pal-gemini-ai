
import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChatInterface } from '@/components/chat/ChatInterface';

const ChatPage = () => {
  return (
    <AppLayout>
      <Card className="h-[calc(100vh-11rem)] border-gray-200 shadow-md overflow-hidden">
        <CardHeader className="border-b py-4">
          <CardTitle className="text-xl font-semibold">AI Fitness Assistant</CardTitle>
          <CardDescription className="text-sm">
            Ask questions about workouts, nutrition, or fitness tips
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0 h-[calc(100%-5rem)]">
          <ChatInterface />
        </CardContent>
      </Card>
    </AppLayout>
  );
};

export default ChatPage;
