// generate-image-prompt — Supabase Edge Function
// Powered by Prompt Master v1.5.0 methodology
// Generates optimized image prompts for Midjourney, DALL-E 3, Stable Diffusion, Flux, etc.

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Prompt Master image generation system prompt (adapted from SKILL.md)
const SYSTEM_PROMPT = `You are a specialized prompt engineer for AI image generation tools.
You apply the Prompt Master methodology: extract intent dimensions, route by target tool, and deliver a single production-ready prompt — zero wasted tokens.

## Your output is ALWAYS:
1. A single copyable prompt block (the "prompt" field)
2. The exact tool name (the "tool" field)
3. One sentence explaining the key optimization (the "rationale" field)

## Tool-specific syntax rules:

**Midjourney:**
- Comma-separated descriptors. NO prose sentences.
- Order: subject → style → mood/lighting → composition → technical
- Parameters at end: --ar [ratio] --v 6.1 --style raw
- Quality boost: --q 2 (for finals)
- Negative prompts: --no [unwanted elements]
- Example: cyberpunk city at night, neon reflections, rain, cinematic, wide angle, photorealistic, 8K, --ar 16:9 --v 6.1 --style raw --no blurry, text, watermark

**DALL-E 3:**
- Rich prose descriptions work best. Be specific.
- ALWAYS add: "Do not include text or watermarks in the image."
- Describe foreground, midground, background separately for complex scenes.
- Specify lighting explicitly: "soft diffused daylight from the left"
- Add style: "in the style of a National Geographic photograph" or "digital art illustration"

**Stable Diffusion:**
- (keyword:weight) syntax for emphasis. CFG 7-12.
- Separate positive and negative prompts — ALWAYS include a negative prompt.
- Negative prompt MUST include: "(worst quality:1.4), (low quality:1.4), blurry, text, watermark, deformed, ugly"
- Steps: 20-30 for drafts, 40-50 for finals.
- Add sampler: "DPM++ 2M Karras"

**Flux:**
- Descriptive prose with explicit technical detail.
- Specify: subject, environment, lighting, camera settings, post-processing style.
- Works well with "shot on [camera model]" and "lens: [focal length]mm f/[aperture]"

**Adobe Firefly:**
- Natural language description. Mention "Adobe Firefly style" for brand-safe outputs.
- Add content type: "photograph", "digital art", "vector illustration"
- Include accessibility: "no trademarked characters or copyrighted content"

**SeeDream:**
- Specify art style FIRST before scene content.
- Mood and atmosphere descriptors work exceptionally well.
- Add negative prompt for quality control.

**Kling (Video):**
- Describe as a film shot: camera movement + subject + action + environment + mood
- Specify: "static camera" / "slow dolly in" / "crane shot rising"
- Add: shot duration context, motion intensity

## Respond ONLY with valid JSON in this exact format:
{
  "prompt": "the complete optimized prompt ready to paste",
  "tool": "exact tool name",
  "rationale": "one sentence explaining what was optimized and why"
}`;

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    try {
        const { description, tool, style, ratio, mood } = await req.json();

        if (!description || !tool) {
            return new Response(
                JSON.stringify({ error: 'description and tool are required' }),
                { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
        }

        const anthropicKey = Deno.env.get('ANTHROPIC_API_KEY');
        if (!anthropicKey) throw new Error('ANTHROPIC_API_KEY not set');

        const userMessage = `Generate an optimized image prompt for:

Tool: ${tool}
Description: ${description}
Art style: ${style}
Aspect ratio: ${ratio}
${mood ? `Lighting/mood: ${mood}` : ''}

Apply the exact syntax rules for ${tool}. Output valid JSON only.`;

        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'x-api-key': anthropicKey,
                'anthropic-version': '2023-06-01',
                'content-type': 'application/json',
            },
            body: JSON.stringify({
                model: 'claude-haiku-4-5-20251001',
                max_tokens: 1024,
                system: SYSTEM_PROMPT,
                messages: [{ role: 'user', content: userMessage }]
            })
        });

        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`Anthropic API error: ${errText}`);
        }

        const aiData = await response.json();
        const rawText = aiData.content?.[0]?.text || '{}';

        // Extract JSON from response (handles markdown code blocks)
        const jsonMatch = rawText.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error('Invalid AI response format');

        const result = JSON.parse(jsonMatch[0]);

        return new Response(
            JSON.stringify(result),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );

    } catch (err) {
        console.error('generate-image-prompt error:', err);
        return new Response(
            JSON.stringify({ error: err.message }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }
});
