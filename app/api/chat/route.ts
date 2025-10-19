import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

interface Message {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json()

    // System prompt for property investment context
    const systemPrompt: Message = {
      role: 'system',
      content: `You are a helpful AI assistant specialized in UK property investment. You help users with:
- Property investment strategies (Buy-to-Let, Buy-Refurbish-Refinance, HMO)
- Understanding property metrics (yield, ROI, cash flow)
- Using property calculators and search tools
- UK property taxes and regulations
- Property market insights

Be concise, practical, and friendly. When discussing calculations, refer users to the built-in calculators. When discussing specific numbers, use UK property market context.`
    }

    // Prepare messages for Ollama (include system prompt)
    const ollamaMessages = [systemPrompt, ...messages]

    // Call Ollama API
    const ollamaResponse = await fetch('http://localhost:11434/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3:latest',
        messages: ollamaMessages,
        stream: false,
      }),
    })

    if (!ollamaResponse.ok) {
      throw new Error(`Ollama API error: ${ollamaResponse.statusText}`)
    }

    const data = await ollamaResponse.json()
    
    return NextResponse.json({ 
      message: data.message.content 
    })

  } catch (error) {
    console.error('Chat API error:', error)
    
    // Check if Ollama is not running
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return NextResponse.json(
        { 
          error: 'Unable to connect to Ollama. Please ensure Ollama is running on http://localhost:11434' 
        },
        { status: 503 }
      )
    }

    return NextResponse.json(
      { 
        error: 'Failed to get response from AI. Please try again.' 
      },
      { status: 500 }
    )
  }
}

