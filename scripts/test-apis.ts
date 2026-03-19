import { createClient } from '@supabase/supabase-js';
import { createEmbedding } from '../lib/embeddings';

async function testSupabase() {
  console.log('\n🔄 Testing Supabase...');
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
    
    if (!supabaseUrl || !supabaseKey) {
      console.log('❌ Supabase: Missing URL or Anon Key');
      return false;
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data, error } = await supabase.from('businesses').select('count');
    
    if (error) {
      console.log('❌ Supabase:', error.message);
      return false;
    }
    console.log('✅ Supabase: Connected');
    return true;
  } catch (err) {
    console.log('❌ Supabase:', err instanceof Error ? err.message : 'Unknown error');
    return false;
  }
}

async function testGroq() {
  console.log('\n🔄 Testing Groq...');
  try {
    const apiKey = process.env.GROQ_API_KEY?.trim();
    if (!apiKey) {
      console.log('❌ Groq: Missing API key');
      return false;
    }
    
    const response = await fetch('https://api.groq.com/openai/v1/models', {
      headers: { 'Authorization': `Bearer ${apiKey}` }
    });
    
    if (!response.ok) {
      console.log('❌ Groq:', response.status, response.statusText);
      return false;
    }
    console.log('✅ Groq: Connected');
    return true;
  } catch (err) {
    console.log('❌ Groq:', err instanceof Error ? err.message : 'Unknown error');
    return false;
  }
}

async function testHuggingFace() {
  console.log('\n🔄 Testing HuggingFace Embeddings...');
  try {
    const apiKey = process.env.HUGGINGFACE_API_KEY?.trim();
    if (!apiKey) {
      console.log('❌ HuggingFace: Missing API key');
      return false;
    }
    
    // Test actual embedding
    const embedding = await createEmbedding('Test business compliance query');
    if (embedding && embedding.length === 384) {
      console.log('✅ HuggingFace: Connected (384-dim embeddings working)');
      return true;
    }
    console.log('❌ HuggingFace: Unexpected embedding dimensions');
    return false;
  } catch (err) {
    console.log('❌ HuggingFace:', err instanceof Error ? err.message : 'Unknown error');
    return false;
  }
}

async function testGoogleAI() {
  console.log('\n🔄 Testing Google AI (OCR)...');
  try {
    const apiKey = process.env.GOOGLE_AI_API_KEY?.trim();
    if (!apiKey) {
      console.log('❌ Google AI: Missing API key');
      return false;
    }
    
    // Remove "google" text if accidentally included
    const cleanKey = apiKey.replace(/\s*google\s*$/, '');
    
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${cleanKey}`);
    
    if (!response.ok) {
      console.log('❌ Google AI:', response.status, response.statusText);
      return false;
    }
    console.log('✅ Google AI: Connected');
    return true;
  } catch (err) {
    console.log('❌ Google AI:', err instanceof Error ? err.message : 'Unknown error');
    return false;
  }
}

async function main() {
  console.log('🔍 Testing API Connections...\n');
  
  const results = await Promise.all([
    testSupabase(),
    testGroq(),
    testHuggingFace(),
    testGoogleAI()
  ]);
  
  const allPassed = results.every(r => r);
  
  console.log('\n' + '='.repeat(40));
  if (allPassed) {
    console.log('✅ All APIs are working!');
    console.log('\n📋 API Usage Summary:');
    console.log('  • Supabase: Database & vector search');
    console.log('  • Groq: AI chat & business extraction');
    console.log('  • HuggingFace: Text embeddings (RAG)');
    console.log('  • Google AI: OCR for document upload');
  } else {
    console.log('⚠️ Some APIs failed. Check details above.');
  }
  console.log('='.repeat(40));
}

main();
