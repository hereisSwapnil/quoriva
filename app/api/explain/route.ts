import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  const { paper } = await req.json();
  if (!paper) return NextResponse.json({ error: 'Paper required' }, { status: 400 });

  const prompt = `You are Quoriva, an AI that makes research papers understandable to anyone curious but non-expert.

Here is a research paper:

TITLE: ${paper.title}
AUTHORS: ${paper.authors?.join(', ') || 'Unknown'}
YEAR: ${paper.year || 'Unknown'}
JOURNAL: ${paper.journal || 'Unknown'}
ABSTRACT: ${paper.abstract}

Generate a structured plain-English explanation with exactly these sections. Use simple language — imagine explaining to a smart friend who has no background in this field.

## 🧠 The Big Idea
One punchy sentence: what is this paper about in plain English?

## ❓ The Problem They Solved
What gap or question did researchers address? Why did it matter?

## 🔬 How They Did It
Briefly describe the method or approach — no jargon. Use analogies if helpful.

## ✨ What They Found
The key results or discoveries. Be specific but accessible.

## 🌍 Why It Matters
Real-world implications. Who benefits? What could change because of this?

## ⚠️ Limitations
What didn't they study? What should future research address?

## 💡 Key Takeaway
One sentence a non-expert can remember and share.

  Keep each section concise — 2-4 sentences max. No bullet points within sections. Write in flowing, human prose.`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1024,
      temperature: 0.2,
    });

    const explanation = completion.choices[0]?.message?.content?.trim();
    if (!explanation) {
      throw new Error('No explanation was returned by the model');
    }

    return NextResponse.json({ explanation });
  } catch (e: unknown) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Explanation failed' },
      { status: 500 }
    );
  }
}
