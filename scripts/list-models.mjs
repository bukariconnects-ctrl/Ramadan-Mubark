// Script to list available model IDs from Hugging Face Router API
const API_KEY = process.env.HUGGINGFACE_API_KEY;

if (!API_KEY) {
  console.error('Error: HUGGINGFACE_API_KEY environment variable is required');
  process.exit(1);
}

async function listModelIds() {
  try {
    const response = await fetch('https://router.huggingface.co/v1/models', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API Error ${response.status}:`, errorText);
      process.exit(1);
    }

    const data = await response.json();
    
    if (data.data && Array.isArray(data.data)) {
      console.log('=== Available Models on Hugging Face Router ===\n');
      
      // Sort and filter for popular/usable models
      const models = data.data
        .filter(m => m.providers && m.providers.some(p => p.status === 'live'))
        .sort((a, b) => a.id.localeCompare(b.id));
      
      // Group by provider
      const byProvider = {};
      models.forEach(m => {
        m.providers.forEach(p => {
          if (p.status === 'live') {
            if (!byProvider[p.provider]) byProvider[p.provider] = [];
            byProvider[p.provider].push({
              id: m.id,
              pricing: p.pricing,
              context: p.context_length,
            });
          }
        });
      });
      
      // Print by provider
      Object.keys(byProvider).sort().forEach(provider => {
        console.log(`\n--- Provider: ${provider} ---`);
        byProvider[provider].forEach(m => {
          console.log(`  ${m.id}`);
          console.log(`    Pricing: $${m.pricing?.input || '?'}/input, $${m.pricing?.output || '?'}/output`);
          console.log(`    Context: ${m.context?.toLocaleString() || '?'} tokens`);
        });
      });
      
      console.log(`\n=== Total: ${models.length} unique models ===`);
      
      // Suggest some good models for Arabic text generation
      console.log('\n=== Suggested Models for Arabic Text Generation ===');
      const suggested = [
        'Qwen/Qwen2.5-7B-Instruct',
        'Qwen/Qwen2.5-14B-Instruct',
        'Qwen/Qwen2.5-32B-Instruct',
        'meta-llama/Llama-3.1-8B-Instruct',
        'meta-llama/Llama-3.2-3B-Instruct',
        'mistralai/Mistral-7B-Instruct-v0.3',
        'mistralai/Mistral-Nemo-Instruct-2407',
      ];
      
      suggested.forEach(id => {
        const found = models.find(m => m.id === id);
        if (found) {
          console.log(`✅ ${id} - AVAILABLE`);
        } else {
          console.log(`❌ ${id} - NOT FOUND`);
        }
      });
    } else {
      console.log('Unexpected response format:', JSON.stringify(data, null, 2).substring(0, 1000));
    }
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

listModelIds();
