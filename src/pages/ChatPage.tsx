
import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChatInterface } from '@/components/chat/ChatInterface';

const ChatPage = () => {
  return (
    <AppLayout>
      <Card className="h-[calc(100vh-11rem)]">
        <CardHeader className="border-b">
          <CardTitle>AI Fitness Assistant</CardTitle>
          <CardDescription>Powered by Google Gemini - Ask questions about workouts, nutrition, or fitness tips</CardDescription>
        </CardHeader>
        <CardContent className="p-0 h-[calc(100%-5rem)]">
          <ChatInterface />
        </CardContent>
      </Card>
    </AppLayout>
  );
};

export default ChatPage;
