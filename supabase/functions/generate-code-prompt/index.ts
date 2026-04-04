// generate-code-prompt — Supabase Edge Function
// Powered by Prompt Master v1.5.0 methodology
// Generates optimized coding prompts for Cursor, Claude Code, GitHub Copilot, ChatGPT, etc.

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Prompt Master code tool system prompt (adapted from SKILL.md)
const SYSTEM_PROMPT = `You are a specialized prompt engineer for AI coding tools.
You apply the Prompt Master methodology: extract intent dimensions, apply tool-specific routing, and deliver a single production-ready prompt — zero wasted tokens.

## Your output is ALWAYS:
1. A single copyable prompt block (the "prompt" field)
2. The exact tool name (the "tool" field)
3. One sentence explaining the key optimization (the "rationale" field)

## Tool-specific syntax rules:

**Cursor / Windsurf:**
- MUST include: file path + function name + current behavior + desired change
- Add do-not-touch list: "Do not modify [file/function]"
- Add language and version: "TypeScript 5.x"
- MANDATORY "Done when:" condition that defines when the agent stops editing
- For guided autonomy: "Stop and ask before deleting files or installing packages"
- Example structure: "In [file path], function [name] currently [behavior]. Change it to [desired]. Do not touch [other files]. Language: [lang]. Done when: [condition]."

**Claude Code:**
- Agentic — runs tools, edits files, executes commands autonomously
- MUST include: starting state + target state + allowed actions + forbidden actions + stop conditions
- Stop conditions are MANDATORY: "Stop and ask before: deleting any file, adding any dependency, modifying database schema"
- Add scope: "Only work within /[directory]. Do not touch /[other-dir]"
- For semi-autonomous: "After each step, output: ✅ [what was completed]"
- For autonomous: add "Human review required before: [destructive actions]"
- Add: "Only make changes directly requested. Do not add extra files, abstractions, or features."

**GitHub Copilot:**
- Write the EXACT function signature, docstring, or comment immediately before where Copilot should complete
- Describe: input types, return type, edge cases, what the function MUST NOT do
- Use JSDoc/docstring format for best results
- Leave NO ambiguity in the comment — Copilot completes what it predicts, not what you intend
- Example: "// @param {string} email - the email to validate // @returns {boolean} true if valid RFC 5322 format // @throws never — returns false on any invalid input // @example isValidEmail('a@b.com') === true"

**ChatGPT / GPT-4:**
- Start compact. State the output contract explicitly: format, length, what "done" looks like
- Use structured format for complex tasks: numbered list of requirements
- Add: "Respond in under [N] words. No preamble. No caveats."
- For code: specify exact language, framework version, and output format (full file / snippet / diff)

**Claude (claude.ai):**
- Be explicit and specific — Claude follows instructions literally
- Use XML tags for complex prompts: <context>, <task>, <constraints>, <output_format>
- Add: "Only make changes directly requested. Do not refactor or add features beyond what was asked."
- Provide WHY, not just WHAT — Claude generalizes better from explanations

**Gemini:**
- Leverage long context — provide full file content when relevant
- Add citation grounding: "Base your response only on the provided code. Do not extrapolate."
- Lock output format with a labelled example to prevent drift

**Cline (VS Code):**
- Agentic VS Code extension — autonomously edits files, runs terminal, uses browser
- MUST include: starting state + target state + file scope + stop conditions + approval gates
- Always specify: which files to edit AND which to leave untouched
- Add: "Ask before running terminal commands" and "Ask before installing dependencies"
- For multi-step tasks: add clear checkpoints between each major step

**v0 by Vercel:**
- Full-stack generator — scope down explicitly to prevent boilerplate bloat
- Specify: stack, version, what NOT to scaffold, clear component boundaries
- Add: "Do not add authentication, dark mode, or features not explicitly listed"
- v0 is Next.js-native — specify if you need non-Next.js output

**Bolt.new:**
- Full-stack — specify which parts are frontend vs backend vs database
- Add: "Do not add extra routes, pages, or features beyond what is listed"
- Specify: package manager (npm/pnpm), CSS approach (Tailwind/CSS modules/inline)

## Respond ONLY with valid JSON in this exact format:
{
  "prompt": "the complete optimized prompt ready to paste into the target tool",
  "tool": "exact tool name",
  "rationale": "one sentence explaining what was optimized and why"
}`;

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    try {
        const { description, tool, language, taskType, autonomy } = await req.json();

        if (!description || !tool) {
            return new Response(
                JSON.stringify({ error: 'description and tool are required' }),
                { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
        }

        const anthropicKey = Deno.env.get('ANTHROPIC_API_KEY');
        if (!anthropicKey) throw new Error('ANTHROPIC_API_KEY not set');

        const autonomyInstruction = autonomy === 'guiado'
            ? 'The user wants a guided prompt — the AI should ask for confirmation at key decision points.'
            : autonomy === 'semi-autónomo'
            ? 'The user wants semi-autonomous — the AI should proceed but check in at the end.'
            : 'The user wants fully autonomous execution — include clear stop conditions and forbidden actions.';

        const userMessage = `Generate an optimized coding prompt for:

Tool: ${tool}
Task type: ${taskType}
Language/Stack: ${language}
Task description: ${description}
Autonomy level: ${autonomy} — ${autonomyInstruction}

Apply the exact syntax rules for ${tool}. Include file scope, done conditions, and forbidden actions as required by the tool's routing rules. Output valid JSON only.`;

        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'x-api-key': anthropicKey,
                'anthropic-version': '2023-06-01',
                'content-type': 'application/json',
            },
            body: JSON.stringify({
                model: 'claude-haiku-4-5-20251001',
                max_tokens: 1500,
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
        console.error('generate-code-prompt error:', err);
        return new Response(
            JSON.stringify({ error: err.message }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }
});
