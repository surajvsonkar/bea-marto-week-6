import OpenAI from 'openai';

/**
 * AI Provider Configuration
 *
 * Uses the OpenAI SDK which is compatible with DeepSeek's API.
 * To switch between providers, change the baseURL and apiKey.
 *
 * TOKEN LIMITS:
 * - DeepSeek Chat: max 8,192 tokens per request
 * - OpenAI GPT-4o-mini: max 16,384 tokens per request
 * - We limit responses to 500-1000 tokens to control costs
 *
 * RATE LIMITING:
 * - DeepSeek: 60 RPM (requests per minute) on free tier
 * - OpenAI: 500 RPM on Tier 1
 * - We add a simple in-memory rate limiter below
 */

const isOpenAI = process.env.AI_PROVIDER === 'openai';
const MODEL = isOpenAI ? 'gpt-4o-mini' : 'deepseek-chat';

function getClient(): OpenAI {
  const apiKey = isOpenAI ? process.env.OPENAI_API_KEY : process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    throw new Error(
      `AI API key is missing. Please configure ${
        isOpenAI ? 'OPENAI_API_KEY' : 'DEEPSEEK_API_KEY'
      } in environment variables.`
    );
  }
  return new OpenAI({
    baseURL: isOpenAI ? undefined : 'https://api.deepseek.com',
    apiKey,
  });
}

// Simple in-memory rate limiter
const requestLog: number[] = [];
const MAX_REQUESTS_PER_MINUTE = 30;

function checkRateLimit(): boolean {
  const now = Date.now();
  const oneMinuteAgo = now - 60_000;

  // Remove old entries
  while (requestLog.length > 0 && requestLog[0] < oneMinuteAgo) {
    requestLog.shift();
  }

  if (requestLog.length >= MAX_REQUESTS_PER_MINUTE) {
    return false;
  }

  requestLog.push(now);
  return true;
}

/** Generate text (non-streaming) */
export async function generateText(
  systemPrompt: string,
  userPrompt: string,
  maxTokens: number = 500
): Promise<string> {
  if (!checkRateLimit()) {
    throw new Error('Rate limit exceeded. Please wait a moment and try again.');
  }

  const client = getClient();
  const completion = await client.chat.completions.create({
    model: MODEL,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    max_tokens: maxTokens,
    temperature: 0.7,
  });

  return completion.choices[0]?.message?.content || '';
}

/** Generate text with streaming */
export async function generateTextStream(
  systemPrompt: string,
  userPrompt: string,
  maxTokens: number = 500
) {
  if (!checkRateLimit()) {
    throw new Error('Rate limit exceeded. Please wait a moment and try again.');
  }

  const client = getClient();
  const stream = await client.chat.completions.create({
    model: MODEL,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    max_tokens: maxTokens,
    temperature: 0.7,
    stream: true,
  });

  return stream;
}

export const PROMPTS = {
  bio: (name: string, title: string, company: string) => ({
    system:
      'You are a professional copywriter. Generate a compelling 2-3 sentence professional bio for a business card directory. Be specific, professional, and highlight unique strengths. Do not use generic phrases.',
    user: `Write a professional bio for ${name}, who works as ${title} at ${company}.`,
  }),

  description: (name: string, title: string, company: string, category: string) => ({
    system:
      'You are a business directory editor. Write a polished 3-4 sentence description for a professional listing. Include what they do, their expertise, and what makes them stand out. Be concise.',
    user: `Write a professional directory listing description for ${name}, a ${title} at ${company} in the ${category} industry.`,
  }),
};
