import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { generateTextStream, PROMPTS } from '@/lib/ai/provider';

/**
 * POST /api/ai/generate
 *
 * Server-side API route for AI content generation.
 * - Keeps the AI API key on the server (never sent to client)
 * - Supports streaming responses (token-by-token)
 * - Saves results to Supabase ai_generations table
 * - Rate-limited via in-memory limiter in provider.ts
 */
export async function POST(request: Request) {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { type, name, title, company, category } = await request.json();

    if (!name || !title || !company) {
      return NextResponse.json(
        { error: 'Missing required fields: name, title, company' },
        { status: 400 }
      );
    }

    // Choose prompt based on type
    const prompt =
      type === 'description'
        ? PROMPTS.description(name, title, company, category || 'General')
        : PROMPTS.bio(name, title, company);

    // Stream the response
    const stream = await generateTextStream(prompt.system, prompt.user, 600);

    // Create a ReadableStream that sends tokens to the client
    const encoder = new TextEncoder();
    let fullText = '';

    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || '';
            if (content) {
              fullText += content;
              controller.enqueue(encoder.encode(content));
            }
          }

          // Save the completed generation to Supabase
          await supabase.from('ai_generations').insert({
            user_id: user.id,
            type: type || 'bio',
            prompt: JSON.stringify({ name, title, company, category }),
            result: fullText,
          });

          controller.close();
        } catch (err) {
          controller.error(err);
        }
      },
    });

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error: unknown) {
    console.error('AI generation error:', error);
    const message =
      error instanceof Error ? error.message : 'Failed to generate content';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
