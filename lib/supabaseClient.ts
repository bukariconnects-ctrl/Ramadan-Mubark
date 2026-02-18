import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

export interface Card {
  id: string;
  sender_name: string;
  recipient_name: string;
  relation_type: string;
  message_content: string;
  theme_id: string;
  created_at: string;
}

export async function getCardById(id: string): Promise<Card | null> {
  const { data, error } = await supabase
    .from('cards')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error('Error fetching card:', error);
    return null;
  }
  
  return data as Card;
}
