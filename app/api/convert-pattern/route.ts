import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { pattern } = await request.json()
    
    if (!pattern || pattern.trim().length === 0) {
      return NextResponse.json({ error: 'Pattern is required' }, { status: 400 })
    }

    // Limit input length to prevent excessive API usage
    if (pattern.length > 1000) {
      return NextResponse.json({ error: 'Pattern is too long. Please limit to 1000 characters.' }, { status: 400 })
    }

    const systemPrompt = `You are a crochet pattern converter. Convert traditional crochet patterns to CrocheTeX format.

CrocheTeX Syntax Rules:
- Use function syntax with parentheses: ch(10), sc(5), dc(3)
- Basic stitches: chain/ch, sc (single crochet), dc (double crochet), hdc (half double), tr (treble), dtr (double treble), sl_st (slip stitch)
- Post stitches: fpdc (front post dc), bpdc (back post dc), fptr, bptr
- Blocks use curly braces: repeat(5) { ... }, round { ... }, magic_ring { ... }
- Special commands: turn, join, end
- Complex stitches: shell, cluster, picot, dc2tog, sc2tog, etc.
- Comments start with //

Examples:
1. "Chain 20, single crochet in next 19 stitches" → "ch(20)\nsc(19)"
2. "Magic ring, 6 single crochet" → "magic_ring {\n  sc(6)\n  join\n}"
3. "Repeat 5 times: double crochet 3, chain 1" → "repeat(5) {\n  dc(3)\n  ch(1)\n}"

Convert the following pattern to CrocheTeX. Keep it concise and use proper syntax. Don't add extra explanations, just return the CrocheTeX code:`

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: pattern }
      ],
      max_tokens: 500,
      temperature: 0.3,
    })

    const convertedPattern = completion.choices[0]?.message?.content

    if (!convertedPattern) {
      return NextResponse.json({ error: 'Failed to convert pattern' }, { status: 500 })
    }

    // Clean up the response - remove markdown code blocks if present
    const cleanedPattern = convertedPattern
      .replace(/^```crochet\n?/gm, '')
      .replace(/^```\n?/gm, '')
      .replace(/\n```$/gm, '')
      .trim()

    return NextResponse.json({ 
      convertedPattern: cleanedPattern,
      originalPattern: pattern 
    })

  } catch (error) {
    console.error('OpenAI API error:', error)
    return NextResponse.json({ error: 'Failed to convert pattern' }, { status: 500 })
  }
} 