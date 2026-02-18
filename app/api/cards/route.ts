import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { sender_name, recipient_name, relation_type, message_content, theme_id } = body;

    // Validate required fields
    if (!recipient_name || !message_content || !theme_id) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Insert into Supabase
    const { data, error } = await supabase
      .from('cards')
      .insert([
        {
          sender_name: sender_name || 'صديق',
          recipient_name,
          relation_type: relation_type || 'صديق',
          message_content,
          theme_id,
        },
      ])
      .select('id')
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to save card' },
        { status: 500 }
      );
    }

    return NextResponse.json({ id: data.id });
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      { error: 'Failed to save card' },
      { status: 500 }
    );
  }
}
