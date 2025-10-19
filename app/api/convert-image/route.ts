import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { imageUrl } = await request.json()

    if (!imageUrl) {
      return NextResponse.json({ error: 'Image URL is required' }, { status: 400 })
    }

    console.log(`[Image Converter] Fetching image: ${imageUrl}`)

    // Fetch the image from the URL server-side (no CORS issues)
    const response = await fetch(imageUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'image/webp,image/apng,image/jpeg,image/png,image/*,*/*;q=0.8',
        'Accept-Encoding': 'gzip, deflate, br',
        'Referer': imageUrl.includes('zoopla') ? 'https://www.zoopla.co.uk/' : 'https://www.rightmove.co.uk/',
        'sec-ch-ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
        'Sec-Fetch-Dest': 'image',
        'Sec-Fetch-Mode': 'no-cors',
        'Sec-Fetch-Site': 'cross-site',
      },
    })

    if (!response.ok) {
      console.error(`[Image Converter] Failed to fetch image: ${response.status} ${response.statusText}`)
      return NextResponse.json({ 
        error: 'Failed to fetch image', 
        status: response.status,
        statusText: response.statusText 
      }, { status: response.status })
    }

    // Get the image as a buffer
    const arrayBuffer = await response.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    if (buffer.length === 0) {
      console.error(`[Image Converter] Received empty image buffer`)
      return NextResponse.json({ error: 'Received empty image' }, { status: 500 })
    }

    // Get the content type
    let contentType = response.headers.get('content-type') || 'image/jpeg'
    
    // Normalize content type
    if (contentType.includes('jpeg') || contentType.includes('jpg')) {
      contentType = 'image/jpeg'
    } else if (contentType.includes('png')) {
      contentType = 'image/png'
    } else if (contentType.includes('webp')) {
      contentType = 'image/webp'
    } else {
      // Default to JPEG if unknown
      contentType = 'image/jpeg'
    }

    // Convert to base64
    const base64 = buffer.toString('base64')
    const dataUrl = `data:${contentType};base64,${base64}`

    console.log(`[Image Converter] Successfully converted image to base64 (${buffer.length} bytes, ${contentType})`)

    return NextResponse.json({ 
      base64: dataUrl,
      size: buffer.length,
      contentType: contentType
    })
  } catch (error) {
    console.error('[Image Converter] Error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to convert image', 
        details: error instanceof Error ? error.message : String(error) 
      },
      { status: 500 }
    )
  }
}

