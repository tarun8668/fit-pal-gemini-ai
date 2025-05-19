
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get('GEMINI_API_KEY') || "AIzaSyDyQBZOW537U0IME1RSEq4yZ7ArPbdwFno";
    if (!apiKey) {
      throw new Error('Missing Gemini API key');
    }

    // Parse the request body
    const { message, history } = await req.json();

    if (!message) {
      throw new Error('No message provided');
    }

    console.log('Received message:', message);
    
    // Format conversation history for Gemini API
    const formattedHistory: Message[] = history?.filter((m: Message) => 
      m.role === 'user' || m.role === 'assistant'
    ).slice(-10) || [];

    // Create the prompt with context about fitness and lifestyle topics
    const prompt = `You are a helpful fitness and lifestyle assistant. You provide advice, tips, and information about workouts, 
    nutrition, recovery, and healthy lifestyle choices. You ONLY answer questions about fitness, nutrition, health, workouts, and wellness.
    If asked about topics outside of fitness and health, politely steer the conversation back to fitness topics.`;

    // Format messages for Gemini API
    const messages = [
      ...formattedHistory.map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
      })),
      {
        role: 'user',
        parts: [{ text: message }]
      }
    ];

    // Make request to Gemini API with the correct endpoint
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [{ text: prompt }]
          },
          ...messages
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 800,
        }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', errorText);
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Gemini API response:', JSON.stringify(data));

    let aiResponse = "I'm sorry, I couldn't generate a response. Please try again.";
    
    // Handle the Gemini API response structure
    if (data.candidates && 
        data.candidates[0] && 
        data.candidates[0].content && 
        data.candidates[0].content.parts && 
        data.candidates[0].content.parts[0]) {
      aiResponse = data.candidates[0].content.parts[0].text;
    }

    return new Response(JSON.stringify({ response: aiResponse }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in chat-with-gemini function:', error);
    
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
