import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import redis from '@/lib/redis';
import { isRateLimited } from '@/lib/ratelimit';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  const { paper } = await req.json();
  if (!paper || !paper.url) return NextResponse.json({ error: 'Paper with URL required' }, { status: 400 });

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1';
  const cacheKey = `quoriva:explanation:${paper.url}`;

  try {
    // 1. Check Redis Cache
    const cachedExplanation = await redis.get(cacheKey);
    if (cachedExplanation) {
      return NextResponse.json({
        explanation: cachedExplanation,
        cached: true
      });
    }

    // 2. Cache Miss: Check Rate Limit (10 per min for OpenAI calls)
    const { isLimited } = await isRateLimited(ip, 'openai', 5, 60);
    if (isLimited) {
      return NextResponse.json(
        { error: 'Quoriva is currently at its processing limit for new explanations. Please try again in a minute, or browse the papers already explained by our community.' },
        { status: 429 }
      );
    }

    // 3. Call OpenAI
    const prompt = `You are Quoriva, a Senior Research Intelligence Analyst. Your goal is to synthesize complex academic research into a high-value professional briefing for decision-makers and subject matter experts.

Here is the research paper to analyze:

TITLE: ${paper.title}
AUTHORS: ${paper.authors?.join(', ') || 'Unknown'}
YEAR: ${paper.year || 'Unknown'}
JOURNAL: ${paper.journal || 'Unknown'}
ABSTRACT: ${paper.abstract}

Generate a structured, information-dense briefing using precisely these sections:

## 📋 Executive Summary
A concise, high-level synthesis of the paper's core premise and its primary impact on the field. Focus on the "So What?".

## 🔬 Methodology & Rigor
Detail the study design (e.g., Randomized Controlled Trial, Meta-analysis, Longitudinal Study), sample size, control variables, and overall technical rigor. Highlight the robustness of the approach.

## 📊 Key Findings (Data-Driven)
Synthesize the primary results. Include specific metrics, percentages, p-values, or statistical significance indicators where available in the abstract. Use bullet points for clarity.

## 🎯 Strategic Implications
Outline how these findings apply to industry, policy, or professional practice. What should change based on this evidence?

## ⚠️ Critical Analysis
Provide a skeptical assessment. Identify potential biases (e.g., small sample size, selection bias, funding conflicts), methodological constraints, or gaps that future research must address.

## 💡 Actionable Takeaway
One decisive, memory-ready instruction or insight for a professional in this field.

General Constraints:
- Use professional, precise language. Avoid being "childish" or overly simplistic.
- Use bullet points for data and lists to increase information density.
- Maintain a neutral, objective, and analytical tone.
- Total length should be around 400-600 words.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1500,
      temperature: 0.3,
    });

    const explanation = completion.choices[0]?.message?.content?.trim();
    if (!explanation) {
      throw new Error('No explanation was returned by the model');
    }

    // 4. Save to Redis (no expiration as per user "no" to 7 days, implying long-term/permanent)
    await redis.set(cacheKey, explanation);

    return NextResponse.json({
      explanation,
      cached: false
    });
  } catch (e: unknown) {
    console.error('Explanation error:', e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Explanation failed' },
      { status: 500 }
    );
  }
}
