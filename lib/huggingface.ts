const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY!;
const MODEL = 'Qwen/Qwen2.5-7B-Instruct';

const BASE_URL = 'https://router.huggingface.co/v1';

export interface GenerationRequest {
  mode: 'manual' | 'magic';
  senderName?: string;
  recipientName?: string;
  relation?: string;
  tone?: string;
  userText?: string;
  wordCount?: number;
}

export async function generateGreeting(request: GenerationRequest): Promise<string> {
  let userPrompt: string;
  const wordCount = request.wordCount || 50;

  if (request.mode === 'manual') {
    userPrompt = `أنشئ تهنئة رمضان بالعربية لـ ${request.recipientName} (${request.relation})، النبرة: ${request.tone}. فقط التهنئة (حوالي ${wordCount} كلمة).`;
  } else {
    userPrompt = `حلل النص التالي واستخرج سياق التهنئة، ثم أنشئ تهنئة رمضان (حوالي ${wordCount} كلمة): "${request.userText}". فقط التهنئة بالعربية.`;
  }

  const systemPrompt = `أنت كاتب إبداعي متخصص في تهاني رمضان. قدم تهنئة قصيرة وجميلة بالعربية (حوالي ${wordCount} كلمة). استخدم الإيموجي بشكل معتدل. لا تضف أي شرح.`;

  try {
    const response = await fetch(`${BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HUGGINGFACE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          {
            role: 'system',
            content: systemPrompt,
          },
          {
            role: 'user',
            content: userPrompt,
          },
        ],
        max_tokens: 150,
        temperature: 0.7,
        top_p: 0.9,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Hugging Face API error:', errorText);
      throw new Error(`API error: ${response.status}`);
    }

    const result = await response.json();
    
    if (result.choices && result.choices[0]?.message?.content) {
      return cleanGeneratedText(result.choices[0].message.content);
    }
    
    throw new Error('Unexpected response format');
  } catch (error) {
    console.error('Error generating greeting:', error);
    // Fallback greeting
    return getFallbackGreeting(request.recipientName || 'حبيبي');
  }
}

function cleanGeneratedText(text: string): string {
  // Remove special tokens and extra whitespace
  return text
    .replace(/<\|im_start\|>.*?<\|im_end\|>/g, '')
    .replace(/<\|.*\|>/g, '')
    .replace(/assistant|user|system/gi, '')
    .trim();
}

function getFallbackGreeting(recipientName: string): string {
  const fallbacks = [
    `رمضان كريم يا ${recipientName}! 🌙 تقبل الله صيامك وقيامك وجميع أعمالك. كل عام وأنت بخير! 🌟`,
    `🌙 رمضان مبارك يا ${recipientName}! أدام الله عليك الصحة والسعادة في هذا الشهر الفضيل. 🕌✨`,
    `كل عام وأنت بخير يا ${recipientName}! 🌙 رمضان كريم، تقبل الله منا ومنكم صالح الأعمال. 🤲`,
  ];
  
  return fallbacks[Math.floor(Math.random() * fallbacks.length)];
}
