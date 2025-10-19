import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const { property, calculationType } = await request.json()

    // Create a detailed prompt for property analysis
    const prompt = `You are a professional UK property investment analyst. Analyze this investment opportunity and provide a concise verdict (3-4 sentences).

Property Details:
- Address: ${property.address}
- Type: ${property.propertyType}
- Price: £${property.price?.toLocaleString() || 'N/A'}
- Bedrooms: ${property.bedrooms || 'N/A'}
- Bathrooms: ${property.bathrooms || 'N/A'}
${property.yield ? `- Gross Yield: ${property.yield}%` : ''}
${property.roi ? `- ROI: ${property.roi}%` : ''}
${property.monthlyRent ? `- Monthly Rent: £${property.monthlyRent}` : ''}
${calculationType ? `- Strategy: ${calculationType}` : ''}

Description: ${property.description || 'No description provided'}

Provide a professional verdict that:
1. Summarizes the key strengths or weaknesses
2. Comments on the financial viability
3. Mentions any red flags or opportunities
4. Gives a recommendation (Strong Buy, Buy, Hold, or Pass)

Keep it concise and professional. Do not use bullet points or formatting, just 3-4 clear sentences.`

    // Call Ollama API
    const ollamaResponse = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3:latest',
        prompt: prompt,
        stream: false,
      }),
    })

    if (!ollamaResponse.ok) {
      throw new Error(`Ollama API error: ${ollamaResponse.statusText}`)
    }

    const data = await ollamaResponse.json()
    
    return NextResponse.json({ 
      verdict: data.response.trim()
    })

  } catch (error) {
    console.error('AI Verdict API error:', error)
    
    // Check if Ollama is not running
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return NextResponse.json(
        { 
          error: 'Unable to connect to Ollama. Using default verdict.',
          verdict: 'AI verdict unavailable. Please ensure Ollama is running to get personalized property analysis.'
        },
        { status: 200 } // Return 200 so PDF generation continues
      )
    }

    return NextResponse.json(
      { 
        verdict: 'AI analysis temporarily unavailable. This property shows standard investment characteristics for the area.'
      },
      { status: 200 }
    )
  }
}

