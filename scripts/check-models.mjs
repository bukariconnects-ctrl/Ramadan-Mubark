// Script to check available models from Hugging Face Router API
const API_KEY = process.env.HUGGINGFACE_API_KEY;

if (!API_KEY) {
  console.error('Error: HUGGINGFACE_API_KEY environment variable is required');
  process.exit(1);
}

async function listModels() {
  try {
    // Try to get available models from Hugging Face
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
      
      // Try alternative endpoint
      console.log('\nTrying alternative approach...');
      await testSpecificModels();
      return;
    }

    const data = await response.json();
    console.log('Available Models:');
    console.log(JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error fetching models:', error);
    console.log('\nTrying to test specific models...');
    await testSpecificModels();
  }
}

async function testSpecificModels() {
  const modelsToTest = [
    'google/gemma-2-9b-it',
    'google/gemma-2-2b-it',
    'google/gemma-2-27b-it',
    'meta-llama/Llama-3.2-3B-Instruct',
    'meta-llama/Llama-3.1-8B-Instruct',
    'Qwen/Qwen2.5-7B-Instruct',
    'Qwen/Qwen2.5-14B-Instruct',
    'mistralai/Mistral-7B-Instruct-v0.3',
  ];

  console.log('\nTesting specific models (sending test requests):\n');

  for (const model of modelsToTest) {
    try {
      const response = await fetch('https://router.huggingface.co/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: model,
          messages: [{ role: 'user', content: 'Hi' }],
          max_tokens: 5,
        }),
      });

      if (response.ok) {
        console.log(`✅ ${model} - AVAILABLE`);
      } else {
        const error = await response.json();
        console.log(`❌ ${model} - ${error.error?.message || response.statusText}`);
      }
    } catch (error) {
      console.log(`❌ ${model} - Error: ${error.message}`);
    }
    
    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 500));
  }
}

// Run the script
listModels();
