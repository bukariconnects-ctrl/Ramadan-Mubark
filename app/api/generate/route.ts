import { NextResponse } from 'next/server';
import { generateGreeting, GenerationRequest } from '@/lib/huggingface';

export async function POST(request: Request) {
  try {
    const body: GenerationRequest = await request.json();
    
    // Validate request
    if (!body.mode) {
      return NextResponse.json(
        { error: 'Mode is required' },
        { status: 400 }
      );
    }

    if (body.mode === 'manual') {
      if (!body.recipientName || !body.relation || !body.tone) {
        return NextResponse.json(
          { error: 'Missing required fields for manual mode' },
          { status: 400 }
        );
      }
    } else if (body.mode === 'magic') {
      if (!body.userText) {
        return NextResponse.json(
          { error: 'User text is required for magic mode' },
          { status: 400 }
        );
      }
    }

    const message = await generateGreeting(body);

    return NextResponse.json({ message });
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      { error: 'Failed to generate greeting' },
      { status: 500 }
    );
  }
}
