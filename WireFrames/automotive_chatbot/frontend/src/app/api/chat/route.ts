import { NextRequest, NextResponse } from 'next/server';

const RASA_URL = process.env.RASA_URL || 'http://localhost:5005';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Forward the request directly to Rasa webhook
    const response = await fetch(`${RASA_URL}/webhooks/rest/webhook`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sender: body.user_id || 'anonymous',
        message: body.message
      }),
    });

    if (!response.ok) {
      throw new Error(`Rasa responded with status: ${response.status}`);
    }

    const data = await response.json();
    // Convert Rasa response format to expected format
    const responseText = data.length > 0 ? data[0].text : "Sorry, I didn't understand that.";
    return NextResponse.json({ response: responseText });
    
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { 
        response: "Sorry, I'm having trouble connecting to the chatbot. Please make sure Rasa is running on port 5005.",
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: "Chat API is running",
    rasa_url: RASA_URL 
  });
} 